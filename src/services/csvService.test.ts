import { describe, expect, it } from 'vitest';
import { autoDetectColumnMapping, parseCsvText } from './csvService';

describe('autoDetectColumnMapping', () => {
  it('detects standard certificate column headers case-insensitively', () => {
    const mapping = autoDetectColumnMapping([
      'Full Name',
      'Email Address',
      'Award Track',
      'Issue Date',
      'Signatory',
    ]);
    expect(mapping).toEqual({
      name: 'Full Name',
      email: 'Email Address',
      role: 'Award Track',
      date: 'Issue Date',
      signature: 'Signatory',
    });
  });
});

describe('parseCsvText', () => {
  it('parses headers, trims cell values, and skips trailing blank lines', () => {
    const csv = `Name,Email,Role\n  Aarav Sharma , aarav@example.com , Winner \nPriya Nair,priya@example.com,Finalist\n\n`;
    const dataset = parseCsvText(csv, 'csv', 'test.csv');

    expect(dataset.headers).toEqual(['Name', 'Email', 'Role']);
    expect(dataset.rows).toHaveLength(2);
    expect(dataset.rows[0].values).toEqual({
      Name: 'Aarav Sharma',
      Email: 'aarav@example.com',
      Role: 'Winner',
    });
    expect(dataset.issues).toHaveLength(0);
  });

  it('throws on CSVs with headers but zero participant rows', () => {
    expect(() => parseCsvText('Name,Email\n', 'csv', 'empty.csv')).toThrow();
  });
});
