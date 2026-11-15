import { useCallback, useState } from 'react';
import { autoDetectColumnMapping, parseCsvFile } from '../services/csvService';
import { parseExcelFile, parsePastedNames } from '../services/excelService';
import { importPublicGoogleSheet } from '../services/sheetsService';
import { ColumnMapping, ParticipantDataset } from '../types/participant';
import { createId } from '../utils/fileUtils';
import { validateParticipants } from '../utils/validation';

export function useParticipants(initialDataset: ParticipantDataset | null = null) {
  const [dataset, setDataset] = useState<ParticipantDataset | null>(initialDataset);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const applyValidation = useCallback(
    (next: Omit<ParticipantDataset, 'issues'>): ParticipantDataset => {
      const issues = validateParticipants(next.rows, next.headers, next.mapping);
      return { ...next, issues };
    },
    []
  );

  const importCsv = useCallback(async (file: File): Promise<ParticipantDataset | null> => {
    setImportError(null);
    setIsImporting(true);
    try {
      const parsed = await parseCsvFile(file);
      setDataset(parsed);
      return parsed;
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
      return null;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const importExcel = useCallback(async (file: File): Promise<ParticipantDataset | null> => {
    setImportError(null);
    setIsImporting(true);
    try {
      const parsed = await parseExcelFile(file);
      setDataset(parsed);
      return parsed;
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to parse Excel file.');
      return null;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const importPastedNames = useCallback(
    (rawText: string, options?: { defaultRole?: string; defaultDate?: string }): ParticipantDataset | null => {
      setImportError(null);
      try {
        const parsed = parsePastedNames(rawText, options);
        setDataset(parsed);
        return parsed;
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Could not import pasted names.');
        return null;
      }
    },
    []
  );

  const importSheetsUrl = useCallback(async (url: string): Promise<ParticipantDataset | null> => {
    setImportError(null);
    setIsImporting(true);
    try {
      const parsed = await importPublicGoogleSheet(url);
      setDataset(parsed);
      return parsed;
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import Google Sheet.');
      return null;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const updateMapping = useCallback(
    (field: keyof ColumnMapping, column: string) => {
      setDataset((prev) => {
        if (!prev) return prev;
        const mapping = { ...prev.mapping, [field]: column };
        return applyValidation({ ...prev, mapping });
      });
    },
    [applyValidation]
  );

  const updateCell = useCallback(
    (rowId: string, header: string, value: string) => {
      setDataset((prev) => {
        if (!prev) return prev;
        const rows = prev.rows.map((row) =>
          row.id === rowId ? { ...row, values: { ...row.values, [header]: value } } : row
        );
        return applyValidation({ ...prev, rows });
      });
    },
    [applyValidation]
  );

  const deleteRow = useCallback(
    (rowId: string) => {
      setDataset((prev) => {
        if (!prev) return prev;
        const rows = prev.rows.filter((r) => r.id !== rowId);
        return applyValidation({ ...prev, rows });
      });
    },
    [applyValidation]
  );

  const addParticipant = useCallback(
    (values?: Record<string, string>) => {
      setDataset((prev) => {
        if (!prev) {
          const defaultHeaders = ['Name', 'Email', 'Role', 'Date'];
          const rowValues: Record<string, string> = {};
          defaultHeaders.forEach((h) => {
            rowValues[h] = values?.[h] ?? '';
          });
          return applyValidation({
            source: 'manual',
            sourceLabel: 'Manual List',
            headers: defaultHeaders,
            rows: [{ id: createId('row'), values: rowValues }],
            mapping: autoDetectColumnMapping(defaultHeaders),
          });
        }
        const rowValues: Record<string, string> = {};
        prev.headers.forEach((h) => {
          rowValues[h] = values?.[h] ?? '';
        });
        const rows = [{ id: createId('row'), values: rowValues }, ...prev.rows];
        return applyValidation({ ...prev, rows });
      });
    },
    [applyValidation]
  );

  const clearDataset = useCallback(() => {
    setDataset(null);
    setImportError(null);
  }, []);

  const hasBlockingErrors =
    !dataset ||
    dataset.rows.length === 0 ||
    !dataset.mapping.name ||
    dataset.issues.some((i) => i.severity === 'error');

  return {
    dataset,
    setDataset,
    isImporting,
    importError,
    setImportError,
    importCsv,
    importExcel,
    importPastedNames,
    importSheetsUrl,
    updateMapping,
    updateCell,
    deleteRow,
    addParticipant,
    clearDataset,
    hasBlockingErrors,
  };
}
