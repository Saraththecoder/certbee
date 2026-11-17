import { TemplateMimeType } from '../types/certificate';
import { ColumnMapping, ParticipantRow, ValidationIssue } from '../types/participant';

const ALLOWED_TEMPLATE_TYPES: TemplateMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'application/pdf',
];
const MAX_TEMPLATE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function resolveTemplateMimeType(file: File): TemplateMimeType | null {
  if (ALLOWED_TEMPLATE_TYPES.includes(file.type as TemplateMimeType)) {
    return file.type as TemplateMimeType;
  }
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith('.png')) return 'image/png';
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return 'image/jpeg';
  if (lowerName.endsWith('.svg')) return 'image/svg+xml';
  if (lowerName.endsWith('.pdf')) return 'application/pdf';
  return null;
}

export function validateTemplateFile(file: File): {
  valid: boolean;
  mimeType?: TemplateMimeType;
  error?: string;
} {
  const resolvedType = resolveTemplateMimeType(file);
  if (!resolvedType) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || file.name.split('.').pop() || 'unknown'}). Please upload a PNG, JPG, SVG, or PDF certificate template.`,
    };
  }
  if (file.size > MAX_TEMPLATE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Template file exceeds the 25 MB browser memory limit. Export a slightly compressed PNG, JPG, SVG, or PDF.',
    };
  }
  return { valid: true, mimeType: resolvedType };
}

export function parseGoogleSheetUrl(rawUrl: string): {
  valid: boolean;
  csvUrl?: string;
  fallbackCsvUrl?: string;
  sheetId?: string;
  gid?: string;
  error?: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please paste a Google Sheets URL.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      valid: false,
      error: 'That does not look like a valid URL. Paste the full https://docs.google.com/spreadsheets/... link.',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      valid: false,
      error: 'Only encrypted HTTPS Google Sheets links (https://docs.google.com/...) are allowed.',
    };
  }

  if (parsed.hostname.toLowerCase() !== 'docs.google.com') {
    return {
      valid: false,
      error: 'URL must be an exact docs.google.com Google Sheets link.',
    };
  }

  const gidFromQuery = parsed.searchParams.get('gid');
  const gidFromHash = parsed.hash.match(/gid=(\d+)/)?.[1];
  const rawGid = gidFromQuery || gidFromHash || undefined;
  const gid = rawGid && /^\d+$/.test(rawGid) ? rawGid : undefined;

  // Handle "Publish to the web" links (/pub, /pubhtml, /pub?output=csv) using a clean allowlisted URL
  if (/^\/spreadsheets\/(?:u\/\d+\/)?d\/e\/[a-zA-Z0-9-_]+\/(?:pubhtml|pub)$/.test(parsed.pathname)) {
    const pubUrl = new URL(`https://docs.google.com${parsed.pathname.replace(/\/pubhtml$/, '/pub')}`);
    pubUrl.searchParams.set('output', 'csv');
    if (gid) {
      pubUrl.searchParams.set('gid', gid);
      pubUrl.searchParams.set('single', 'true');
    }
    return { valid: true, csvUrl: pubUrl.toString(), gid };
  }

  const idMatch = parsed.pathname.match(/\/spreadsheets\/(?:u\/\d+\/)?d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch || !idMatch[1]) {
    return {
      valid: false,
      error: 'Could not find a spreadsheet ID in this URL. Check that it includes /spreadsheets/d/<ID>.',
    };
  }

  const sheetId = idMatch[1];
  const resolvedGid = gid || '0';

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${resolvedGid}`;
  const fallbackCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${resolvedGid}`;
  return { valid: true, csvUrl, fallbackCsvUrl, sheetId, gid: resolvedGid };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateParticipants(
  rows: ParticipantRow[],
  headers: string[],
  mapping: ColumnMapping
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenNames = new Map<string, number>();
  const seenEmails = new Map<string, number>();

  rows.forEach((row, index) => {
    // Check malformed / completely empty row
    const nonEmptyCount = headers.filter((h) => (row.values[h] ?? '').trim().length > 0).length;
    if (nonEmptyCount === 0) {
      issues.push({
        rowId: row.id,
        rowIndex: index,
        field: 'Row',
        severity: 'error',
        message: 'Row is completely empty. Edit or remove it before generating certificates.',
      });
      return;
    }

    // Required Name column check
    if (mapping.name) {
      const nameVal = (row.values[mapping.name] ?? '').trim();
      if (!nameVal) {
        issues.push({
          rowId: row.id,
          rowIndex: index,
          field: mapping.name,
          severity: 'error',
          message: `Missing required participant name in "${mapping.name}".`,
        });
      } else {
        const lower = nameVal.toLowerCase();
        if (seenNames.has(lower)) {
          issues.push({
            rowId: row.id,
            rowIndex: index,
            field: mapping.name,
            severity: 'warning',
            message: `Duplicate participant name "${nameVal}" (first seen on row ${seenNames.get(lower)! + 1}).`,
          });
        } else {
          seenNames.set(lower, index);
        }
      }
    }

    // Optional Email validation & duplicate detection
    if (mapping.email) {
      const emailVal = (row.values[mapping.email] ?? '').trim();
      if (emailVal && !EMAIL_REGEX.test(emailVal)) {
        issues.push({
          rowId: row.id,
          rowIndex: index,
          field: mapping.email,
          severity: 'warning',
          message: `Invalid email format "${emailVal}".`,
        });
      } else if (emailVal) {
        const lowerEmail = emailVal.toLowerCase();
        if (seenEmails.has(lowerEmail)) {
          issues.push({
            rowId: row.id,
            rowIndex: index,
            field: mapping.email,
            severity: 'warning',
            message: `Duplicate email "${emailVal}" (first seen on row ${seenEmails.get(lowerEmail)! + 1}).`,
          });
        } else {
          seenEmails.set(lowerEmail, index);
        }
      }
    }
  });

  return issues;
}
