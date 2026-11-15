import { describe, expect, it } from 'vitest';
import {
  parseGoogleSheetUrl,
  validateParticipants,
  validateTemplateFile,
} from './validation';

function makeMockFile(name: string, type: string, sizeBytes = 1024): File {
  const content = new Uint8Array(Math.min(sizeBytes, 16));
  const file = new File([content], name, { type });
  if (sizeBytes !== content.byteLength) {
    Object.defineProperty(file, 'size', { value: sizeBytes });
  }
  return file;
}

describe('validateTemplateFile', () => {
  it('accepts PNG, JPG, SVG, and PDF files under 25 MB', () => {
    expect(validateTemplateFile(makeMockFile('cert.png', 'image/png')).valid).toBe(true);
    expect(validateTemplateFile(makeMockFile('cert.jpg', 'image/jpeg')).valid).toBe(true);
    expect(validateTemplateFile(makeMockFile('cert.svg', 'image/svg+xml')).valid).toBe(true);
    expect(validateTemplateFile(makeMockFile('cert.pdf', 'application/pdf')).valid).toBe(true);
  });

  it('falls back to file extension when browser omits MIME type', () => {
    const res = validateTemplateFile(makeMockFile('template.pdf', ''));
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe('application/pdf');
  });

  it('rejects unsupported file types and files over 25 MB', () => {
    expect(validateTemplateFile(makeMockFile('notes.txt', 'text/plain')).valid).toBe(false);
    expect(
      validateTemplateFile(makeMockFile('huge.png', 'image/png', 26 * 1024 * 1024)).valid
    ).toBe(false);
  });
});

describe('parseGoogleSheetUrl', () => {
  it('preserves hash gid and generates both export and gviz fallback URLs', () => {
    const res = parseGoogleSheetUrl(
      'https://docs.google.com/spreadsheets/d/1AbC_xYz99/edit?usp=sharing#gid=987654'
    );
    expect(res.valid).toBe(true);
    expect(res.gid).toBe('987654');
    expect(res.csvUrl).toBe(
      'https://docs.google.com/spreadsheets/d/1AbC_xYz99/export?format=csv&gid=987654'
    );
    expect(res.fallbackCsvUrl).toBe(
      'https://docs.google.com/spreadsheets/d/1AbC_xYz99/gviz/tq?tqx=out:csv&gid=987654'
    );
  });

  it('supports /u/<index>/d/<id> URLs and /pubhtml publish-to-web URLs', () => {
    const userPath = parseGoogleSheetUrl(
      'https://docs.google.com/spreadsheets/u/0/d/1AbC_xYz99/edit?gid=42#gid=42'
    );
    expect(userPath.valid).toBe(true);
    expect(userPath.gid).toBe('42');

    const pub = parseGoogleSheetUrl(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vDemo/pubhtml?gid=777&single=true'
    );
    expect(pub.valid).toBe(true);
    expect(pub.csvUrl).toContain('/pub?');
    expect(pub.csvUrl).toContain('output=csv');
    expect(pub.csvUrl).toContain('gid=777');
  });

  it('rejects non-Google URLs or missing spreadsheet IDs', () => {
    expect(parseGoogleSheetUrl('https://example.com/sheet.csv').valid).toBe(false);
    expect(parseGoogleSheetUrl('https://docs.google.com/spreadsheets/').valid).toBe(false);
  });
});

describe('validateParticipants', () => {
  it('flags missing names as errors and duplicate names or invalid emails as warnings', () => {
    const issues = validateParticipants(
      [
        { id: '1', values: { Name: 'Alex Morgan', Email: 'alex@example.com' } },
        { id: '2', values: { Name: 'Alex Morgan', Email: 'bad-email' } },
        { id: '3', values: { Name: '', Email: 'sam@example.com' } },
      ],
      ['Name', 'Email'],
      { name: 'Name', email: 'Email', role: '', date: '', signature: '' }
    );

    expect(issues.some((i) => i.severity === 'error' && i.rowId === '3')).toBe(true);
    expect(
      issues.some((i) => i.severity === 'warning' && i.rowId === '2' && i.message.includes('Duplicate'))
    ).toBe(true);
    expect(
      issues.some((i) => i.severity === 'warning' && i.rowId === '2' && i.message.includes('Invalid email'))
    ).toBe(true);
  });
});
