import type * as XLSXTypes from 'xlsx';
import { ParticipantDataset, ParticipantRow } from '../types/participant';
import { createId } from '../utils/fileUtils';
import { validateParticipants } from '../utils/validation';
import { autoDetectColumnMapping, parseCsvText } from './csvService';

export async function parseExcelFile(file: File): Promise<ParticipantDataset> {
  const lowerName = file.name.toLowerCase();
  const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

  if (!isExcel) {
    throw new Error('Please upload an Excel (.xlsx or .xls) file.');
  }

  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('This Excel workbook contains no sheets.');
  }

  // Find first non-empty worksheet
  let targetSheet: XLSXTypes.WorkSheet | null = null;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (sheet && sheet['!ref']) {
      targetSheet = sheet;
      break;
    }
  }

  if (!targetSheet) {
    throw new Error('The Excel workbook appears to be empty.');
  }

  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(targetSheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (rawRows.length === 0) {
    throw new Error('No rows were found in the Excel sheet.');
  }

  // If the sheet is a single column without a header-like first row (e.g. just student names),
  // preserve every row by synthesizing a "Name" header when the first cell looks like a person's name
  // and does not match common header keywords.
  const firstRowCells = (rawRows[0] ?? []).map((c) => String(c ?? '').trim());
  if (firstRowCells.length === 1) {
    const firstVal = firstRowCells[0].toLowerCase();
    const headerKeywords = ['name', 'full name', 'student', 'participant', 'recipient', 'attendee'];
    if (firstVal && !headerKeywords.some((kw) => firstVal === kw || firstVal.includes(kw))) {
      const rows: ParticipantRow[] = rawRows
        .map((r) => String(r[0] ?? '').trim())
        .filter((val) => val.length > 0)
        .map((val) => ({
          id: createId('row'),
          values: { Name: val },
        }));

      if (rows.length === 0) {
        throw new Error('No participant names were found in the Excel sheet.');
      }

      const headers = ['Name'];
      const mapping = autoDetectColumnMapping(headers);
      const issues = validateParticipants(rows, headers, mapping);

      return {
        source: 'excel',
        sourceLabel: file.name,
        headers,
        rows,
        mapping,
        issues,
      };
    }
  }

  const csvText = XLSX.utils.sheet_to_csv(targetSheet);
  return parseCsvText(csvText, 'excel', file.name);
}

export function extractPastedLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function parsePastedNames(
  rawText: string,
  options?: { defaultRole?: string; defaultDate?: string }
): ParticipantDataset {
  const names = extractPastedLines(rawText);
  if (names.length === 0) {
    throw new Error('Paste at least one name (one per line) to continue.');
  }

  const role = options?.defaultRole?.trim() || '';
  const date = options?.defaultDate?.trim() || '';

  const headers = ['Name'];
  if (role) headers.push('Role');
  if (date) headers.push('Date');

  const rows: ParticipantRow[] = names.map((name) => {
    const values: Record<string, string> = { Name: name };
    if (role) values.Role = role;
    if (date) values.Date = date;
    return {
      id: createId('row'),
      values,
    };
  });

  const mapping = autoDetectColumnMapping(headers);
  const issues = validateParticipants(rows, headers, mapping);

  return {
    source: 'paste',
    sourceLabel: `Pasted List (${names.length} ${names.length === 1 ? 'name' : 'names'})`,
    headers,
    rows,
    mapping,
    issues,
  };
}
