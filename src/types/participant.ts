export type ImportSource = 'csv' | 'excel' | 'paste' | 'sheets' | 'manual';

export interface ParticipantRow {
  id: string;
  values: Record<string, string>;
}

export interface ColumnMapping {
  name: string;
  email: string;
  role: string;
  date: string;
  signature: string;
}

export interface ValidationIssue {
  rowId: string;
  rowIndex: number;
  field: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface ParticipantDataset {
  source: ImportSource;
  sourceLabel: string;
  headers: string[];
  rows: ParticipantRow[];
  mapping: ColumnMapping;
  issues: ValidationIssue[];
}
