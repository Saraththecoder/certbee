import Papa from 'papaparse';
import { ColumnMapping, ImportSource, ParticipantDataset, ParticipantRow } from '../types/participant';
import { createId } from '../utils/fileUtils';
import { validateParticipants } from '../utils/validation';

export function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const findHeader = (candidates: string[]): string => {
    for (const candidate of candidates) {
      const exact = headers.find((h) => h.trim().toLowerCase() === candidate);
      if (exact) return exact;
    }
    for (const candidate of candidates) {
      const partial = headers.find((h) => h.trim().toLowerCase().includes(candidate));
      if (partial) return partial;
    }
    return '';
  };

  const name =
    findHeader(['name', 'full name', 'participant', 'recipient', 'student', 'attendee']) ||
    headers[0] ||
    '';
  const email = findHeader(['email', 'e-mail', 'mail']);
  const role = findHeader(['role', 'designation', 'title', 'track', 'award', 'achievement', 'course']);
  const date = findHeader(['date', 'issued', 'completion date', 'event date']);
  const signature = findHeader(['signature', 'signatory', 'issuer', 'organizer', 'instructor']);

  return { name, email, role, date, signature };
}

export function parseCsvText(
  csvText: string,
  source: ImportSource,
  sourceLabel: string
): ParticipantDataset {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0 && (!parsed.data || parsed.data.length === 0)) {
    throw new Error(parsed.errors[0]?.message || 'Could not parse CSV rows.');
  }

  const rawHeaders = (parsed.meta.fields ?? []).filter((h) => h.trim().length > 0);
  if (rawHeaders.length === 0) {
    throw new Error('No column headers were found. Ensure the first row contains column names.');
  }

  // Deduplicate headers if necessary
  const headers = rawHeaders.filter((h, i) => rawHeaders.indexOf(h) === i);

  const rows: ParticipantRow[] = (parsed.data ?? []).map((record) => {
    const values: Record<string, string> = {};
    headers.forEach((h) => {
      values[h] = record[h] !== undefined && record[h] !== null ? String(record[h]).trim() : '';
    });
    return {
      id: createId('row'),
      values,
    };
  });

  if (rows.length === 0) {
    throw new Error('The file contains headers but zero participant rows.');
  }

  const mapping = autoDetectColumnMapping(headers);
  const issues = validateParticipants(rows, headers, mapping);

  return {
    source,
    sourceLabel,
    headers,
    rows,
    mapping,
    issues,
  };
}

export async function parseCsvFile(file: File): Promise<ParticipantDataset> {
  const isCsv =
    file.name.toLowerCase().endsWith('.csv') ||
    file.type === 'text/csv' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'text/plain';

  if (!isCsv) {
    throw new Error('Please upload a .csv file.');
  }

  const text = await file.text();
  return parseCsvText(text, 'csv', file.name);
}
