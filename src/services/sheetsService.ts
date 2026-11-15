import { ParticipantDataset } from '../types/participant';
import { parseGoogleSheetUrl } from '../utils/validation';
import { parseCsvText } from './csvService';

const SHEET_FETCH_TIMEOUT_MS = 15000;

class SheetFetchError extends Error {
  status?: number;
  isAuthOrHtml?: boolean;
  isTimeout?: boolean;
  isNetworkOrCors?: boolean;

  constructor(
    message: string,
    opts?: {
      status?: number;
      isAuthOrHtml?: boolean;
      isTimeout?: boolean;
      isNetworkOrCors?: boolean;
    }
  ) {
    super(message);
    this.status = opts?.status;
    this.isAuthOrHtml = opts?.isAuthOrHtml;
    this.isTimeout = opts?.isTimeout;
    this.isNetworkOrCors = opts?.isNetworkOrCors;
  }
}

async function fetchCsvFromUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SHEET_FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal,
    });
  } catch (err) {
    window.clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new SheetFetchError(
        'Request to Google Sheets timed out after 15 seconds. Check your connection or export the tab as a CSV file.',
        { isTimeout: true }
      );
    }
    throw new SheetFetchError(
      'Unable to reach Google Sheets due to a network or browser CORS restriction. Ensure the sheet is shared as "Anyone with the link can view", or use File → Download → Comma Separated Values (.csv).',
      { isNetworkOrCors: true }
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new SheetFetchError(
        'This spreadsheet appears to be private. Set sharing to "Anyone with the link can view" or export it as a CSV file.',
        { status: response.status, isAuthOrHtml: true }
      );
    }
    if (response.status === 400 || response.status === 404) {
      throw new SheetFetchError(
        'Spreadsheet or tab (gid) not found. Verify the Google Sheets link and make sure the selected tab exists.',
        { status: response.status }
      );
    }
    throw new SheetFetchError(
      `Google Sheets returned HTTP ${response.status}. Check the URL and sharing settings.`,
      { status: response.status }
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  const trimmed = body.trim();

  if (
    contentType.includes('text/html') ||
    trimmed.startsWith('<!DOCTYPE html') ||
    trimmed.startsWith('<html')
  ) {
    throw new SheetFetchError(
      'Google Sheets returned a sign-in or HTML page instead of CSV data. Set sharing to "Anyone with the link can view" or download the tab as CSV.',
      { isAuthOrHtml: true }
    );
  }

  if (!trimmed) {
    throw new SheetFetchError(
      'The selected Google Sheet tab returned empty data. Check that the tab (gid) has headers and participant rows.'
    );
  }

  return body;
}

export async function importPublicGoogleSheet(rawUrl: string): Promise<ParticipantDataset> {
  const parsed = parseGoogleSheetUrl(rawUrl);
  if (!parsed.valid || !parsed.csvUrl) {
    throw new Error(parsed.error || 'Invalid Google Sheets URL.');
  }

  const candidateUrls = [parsed.csvUrl];
  if (parsed.fallbackCsvUrl && parsed.fallbackCsvUrl !== parsed.csvUrl) {
    candidateUrls.push(parsed.fallbackCsvUrl);
  }

  let csvBody: string | null = null;
  let lastError: SheetFetchError | null = null;

  for (const url of candidateUrls) {
    try {
      csvBody = await fetchCsvFromUrl(url);
      break;
    } catch (err) {
      lastError =
        err instanceof SheetFetchError
          ? err
          : new SheetFetchError(err instanceof Error ? err.message : 'Unable to fetch Google Sheet.');
    }
  }

  if (!csvBody) {
    throw lastError ?? new Error('Unable to import data from this Google Sheets link.');
  }

  const sourceLabel =
    parsed.gid && parsed.gid !== '0'
      ? `Google Sheet (Tab #${parsed.gid})`
      : 'Google Sheet';

  return parseCsvText(csvBody, 'sheets', sourceLabel);
}
