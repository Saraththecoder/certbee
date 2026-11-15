import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Link2,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { extractPastedLines } from '../services/excelService';
import { ColumnMapping } from '../types/participant';

const PAGE_SIZE = 10;

export function ParticipantTable() {
  const { participants, setStep, editor } = useBatchWorkspace();
  const {
    dataset,
    isImporting,
    importError,
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
  } = participants;

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const [importMode, setImportMode] = useState<'file' | 'paste' | 'sheets'>('file');
  const [importerOpen, setImporterOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pasteDefaultRole, setPasteDefaultRole] = useState('');
  const [pasteDefaultDate, setPasteDefaultDate] = useState('');
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const pastedNamesList = useMemo(() => extractPastedLines(pastedText), [pastedText]);
  const hasLoadedRows = Boolean(dataset && dataset.rows.length > 0);
  const showImporterPanel = !hasLoadedRows || importerOpen;

  const handleSpreadsheetFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const lower = file.name.toLowerCase();
    const res =
      lower.endsWith('.xlsx') || lower.endsWith('.xls')
        ? await importExcel(file)
        : await importCsv(file);
    if (res) {
      setImporterOpen(false);
      setPage(1);
    }
  };

  const handlePasteImport = (e: React.FormEvent) => {
    e.preventDefault();
    const res = importPastedNames(pastedText, {
      defaultRole: pasteDefaultRole,
      defaultDate: pasteDefaultDate,
    });
    if (res) {
      setImporterOpen(false);
      setPage(1);
    }
  };

  const handleSheetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await importSheetsUrl(sheetsUrl);
    if (ok) {
      setImporterOpen(false);
      setPage(1);
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    if (!dataset) return [];
    const q = searchQuery.trim().toLowerCase();
    let list = dataset.rows;

    if (q) {
      list = list.filter((row) =>
        dataset.headers.some((h) => (row.values[h] ?? '').toLowerCase().includes(q))
      );
    }

    if (sortCol) {
      list = [...list].sort((a, b) => {
        const av = (a.values[sortCol] ?? '').toLowerCase();
        const bv = (b.values[sortCol] ?? '').toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [dataset, searchQuery, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredAndSortedRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const errorCount = dataset?.issues.filter((i) => i.severity === 'error').length ?? 0;
  const warningCount = dataset?.issues.filter((i) => i.severity === 'warning').length ?? 0;

  const issuesByRow = useMemo(() => {
    const map = new Map<string, typeof dataset extends null ? never : NonNullable<typeof dataset>['issues']>();
    if (!dataset) return map;
    for (const issue of dataset.issues) {
      const existing = map.get(issue.rowId) ?? [];
      existing.push(issue);
      map.set(issue.rowId, existing);
    }
    return map;
  }, [dataset]);

  const handleSort = (header: string) => {
    if (sortCol === header) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(header);
      setSortDir('asc');
    }
  };

  const handleProceedToEditor = () => {
    if (hasBlockingErrors || !dataset) return;
    if (editor.fields.length === 0) {
      const firstRow = dataset.rows[0]?.values ?? {};
      const nameSample = dataset.mapping.name ? firstRow[dataset.mapping.name] : 'Participant Name';
      const roleSample = dataset.mapping.role ? firstRow[dataset.mapping.role] : 'Participant';
      const dateSample = dataset.mapping.date ? firstRow[dataset.mapping.date] : '14 Nov 2026';

      editor.setFields([
        {
          id: 'fld_name_default',
          key: 'name',
          label: 'Participant Name',
          sampleFallback: nameSample || 'Participant Name',
          xPct: 16,
          yPct: 43,
          widthPct: 68,
          rotation: 0,
          fontFamily: 'Fraunces',
          fontSizePt: 60,
          fontWeight: 600,
          color: '#18181B',
          align: 'center',
          letterSpacing: 0,
          opacity: 1,
          autoFit: true,
        },
        ...(dataset.mapping.role
          ? [
              {
                id: 'fld_role_default',
                key: 'role',
                label: 'Role',
                sampleFallback: roleSample || 'Participant',
                xPct: 22,
                yPct: 57,
                widthPct: 56,
                rotation: 0,
                fontFamily: 'Plus Jakarta Sans' as const,
                fontSizePt: 26,
                fontWeight: 600 as const,
                color: '#141414',
                align: 'center' as const,
                letterSpacing: 1,
                opacity: 1,
                autoFit: true,
              },
            ]
          : []),
        ...(dataset.mapping.date
          ? [
              {
                id: 'fld_date_default',
                key: 'date',
                label: 'Date',
                sampleFallback: dateSample || '14 Nov 2026',
                xPct: 18,
                yPct: 76,
                widthPct: 26,
                rotation: 0,
                fontFamily: 'DM Sans' as const,
                fontSizePt: 21,
                fontWeight: 500 as const,
                color: '#3F3F46',
                align: 'center' as const,
                letterSpacing: 0,
                opacity: 1,
                autoFit: true,
              },
            ]
          : []),
      ]);
    }
    setStep(3);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-sm border border-[#141414] bg-[#1FA971] px-2 py-0.5 font-mono-tabular text-[11px] font-bold text-white">
            STEP 02
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414]">
            Import participants
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Upload a CSV or Excel (.xlsx) spreadsheet, paste names one per line, or import a public Google Sheets link.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-2.5 text-sm font-semibold text-[#141414] hover:bg-[#F3F1EA] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4" />
            Template
          </button>
          <button
            type="button"
            disabled={hasBlockingErrors}
            onClick={handleProceedToEditor}
            className={`inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider transition-colors whitespace-nowrap ${
              hasBlockingErrors
                ? 'bg-[#E4E4E7] text-[#71717A] border-[#A1A1AA] cursor-not-allowed'
                : 'bg-[#141414] text-white hover:bg-[#27272A] shadow-[3px_3px_0_#2563EB]'
            }`}
          >
            CONTINUE TO DESIGN
            <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
          </button>
        </div>
      </div>

      <input
        ref={csvInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          handleSpreadsheetFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        className="hidden"
        onChange={(e) => {
          handleSpreadsheetFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {importError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-sm border-[1.5px] border-[#DC2626] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#141414]">Import issue</p>
            <p className="mt-0.5">{importError}</p>
          </div>
        </div>
      )}

      {showImporterPanel && (
        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white overflow-hidden shadow-[5px_5px_0_#141414]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-[#141414]/15 bg-[#F3F1EA] px-4 sm:px-5 py-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setImportMode('file')}
                className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  importMode === 'file'
                    ? 'border-[#141414] bg-[#F6C33E] text-[#141414]'
                    : 'border-transparent text-[#52525B] hover:text-[#141414]'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                CSV / Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('paste')}
                className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  importMode === 'paste'
                    ? 'border-[#141414] bg-[#F6C33E] text-[#141414]'
                    : 'border-transparent text-[#52525B] hover:text-[#141414]'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Paste names
              </button>
              <button
                type="button"
                onClick={() => setImportMode('sheets')}
                className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  importMode === 'sheets'
                    ? 'border-[#141414] bg-[#F6C33E] text-[#141414]'
                    : 'border-transparent text-[#52525B] hover:text-[#141414]'
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                Google Sheets URL
              </button>
            </div>

            {hasLoadedRows && (
              <button
                type="button"
                onClick={() => setImporterOpen(false)}
                className="rounded-sm border border-[#141414]/25 bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#FBFBF8] whitespace-nowrap"
              >
                Keep current list ({dataset?.rows.length})
              </button>
            )}
          </div>

          {importMode === 'file' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                await handleSpreadsheetFiles(e.dataTransfer.files);
              }}
              className={`p-8 sm:p-14 text-center transition-colors ${
                isDraggingFile ? 'bg-[#EFF6FF]' : 'bg-white'
              }`}
            >
              <div className="mx-auto max-w-lg space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border-[1.5px] border-[#141414] bg-[#C8EFE0] shadow-[2px_2px_0_#141414]">
                  <Upload className="h-5 w-5 text-[#141414]" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg font-bold text-[#141414]">
                    Drag and drop a .csv or .xlsx spreadsheet
                  </p>
                  <p className="text-sm text-[#52525B]">
                    Supports Excel (.xlsx, .xls) workbooks and UTF-8 CSV files parsed directly inside your browser.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    disabled={isImporting}
                    onClick={() => excelInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-5 py-2.5 text-sm font-bold text-[#141414] hover:bg-[#f2b824] transition-colors whitespace-nowrap shadow-[2px_2px_0_#141414]"
                  >
                    <Upload className="h-4 w-4" />
                    {isImporting ? 'Reading spreadsheet...' : 'Import Excel (.xlsx)'}
                  </button>
                  <button
                    type="button"
                    disabled={isImporting}
                    onClick={() => csvInputRef.current?.click()}
                    className="rounded-sm border-[1.5px] border-[#141414] bg-white px-5 py-2.5 text-sm font-semibold text-[#141414] hover:bg-[#F3F1EA] transition-colors whitespace-nowrap"
                  >
                    Choose CSV file
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addParticipant();
                      setImporterOpen(false);
                    }}
                    className="rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-4 py-2.5 text-sm font-medium text-[#52525B] hover:text-[#141414] hover:bg-[#F3F1EA] transition-colors whitespace-nowrap"
                  >
                    Start manual table
                  </button>
                </div>
              </div>
            </div>
          ) : importMode === 'paste' ? (
            <form onSubmit={handlePasteImport} className="p-6 sm:p-10 max-w-2xl mx-auto space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label htmlFor="paste-names-textarea" className="block text-sm font-bold text-[#141414]">
                    Student &amp; participant names
                  </label>
                  <p className="text-xs text-[#52525B]">
                    Paste names directly from a roster, document, or attendance sheet—one name per line.
                  </p>
                </div>
                <span className="font-mono-tabular rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 text-xs font-bold text-[#141414]">
                  {pastedNamesList.length} {pastedNamesList.length === 1 ? 'name' : 'names'} ready
                </span>
              </div>

              <textarea
                id="paste-names-textarea"
                rows={7}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={'Or paste names here, one per line...\nAarav Kumar\nPriya Sharma\nRahul Verma'}
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-4 py-3 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="paste-default-role" className="block text-xs font-semibold text-[#52525B]">
                    Default Role / Award (optional)
                  </label>
                  <input
                    id="paste-default-role"
                    type="text"
                    value={pasteDefaultRole}
                    onChange={(e) => setPasteDefaultRole(e.target.value)}
                    placeholder="e.g. Participant"
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3 py-2 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="paste-default-date" className="block text-xs font-semibold text-[#52525B]">
                    Default Issue Date (optional)
                  </label>
                  <input
                    id="paste-default-date"
                    type="text"
                    value={pasteDefaultDate}
                    onChange={(e) => setPasteDefaultDate(e.target.value)}
                    placeholder="e.g. 14 Nov 2026"
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3 py-2 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => excelInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-3.5 py-2 text-xs font-semibold text-[#141414] hover:bg-[#F3F1EA] transition-colors"
                >
                  <Upload className="h-3.5 w-3.5 text-[#2563EB]" />
                  Or import Excel (.xlsx)
                </button>
                <button
                  type="submit"
                  disabled={pastedNamesList.length === 0}
                  className="rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#27272A] disabled:bg-[#E4E4E7] disabled:text-[#71717A] disabled:border-[#A1A1AA] disabled:cursor-not-allowed transition-colors"
                >
                  Load {pastedNamesList.length} {pastedNamesList.length === 1 ? 'name' : 'names'} into table
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSheetsSubmit} className="p-8 sm:p-12 max-w-2xl mx-auto space-y-4">
              <div className="space-y-1">
                <label htmlFor="sheets-url-input" className="block text-sm font-bold text-[#141414]">
                  Public Google Sheets URL
                </label>
                <p className="text-xs text-[#52525B]">
                  Set sharing to &ldquo;Anyone with the link can view&rdquo; in Google Sheets. Private sheets cannot be fetched without OAuth; export private sheets as CSV or Excel instead.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="sheets-url-input"
                  type="url"
                  required
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="flex-1 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3.5 py-2.5 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isImporting}
                  className="rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-5 py-2.5 text-sm font-bold text-[#141414] hover:bg-[#f2b824] disabled:opacity-60 transition-colors whitespace-nowrap"
                >
                  {isImporting ? 'Fetching...' : 'Import Sheet'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {dataset && hasLoadedRows && (
        <div className="space-y-6">
          <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-5 space-y-5 shadow-[4px_4px_0_#141414]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141414]/15 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#141414]">
                  <span>{dataset.sourceLabel}</span>
                  <span aria-hidden="true" className="text-[#A1A1AA]">·</span>
                  <span className="font-mono-tabular text-[#2563EB]">
                    {dataset.rows.length} {dataset.rows.length === 1 ? 'participant' : 'participants'}
                  </span>
                </div>
                <p className="text-xs text-[#52525B]">
                  Map your spreadsheet columns to CertBee&apos;s standard certificate placeholders. All extra columns remain available as custom fields.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('file');
                    setImporterOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-2.5 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors whitespace-nowrap"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  CSV / Excel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('paste');
                    setImporterOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-2.5 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors whitespace-nowrap"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Paste names
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('sheets');
                    setImporterOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-2.5 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors whitespace-nowrap"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Google Sheets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearDataset();
                    setImporterOpen(false);
                  }}
                  className="inline-flex items-center gap-1 rounded-sm border border-[#141414]/25 bg-white px-2.5 py-1.5 text-xs font-medium text-[#52525B] hover:border-[#DC2626] hover:text-[#DC2626] transition-colors whitespace-nowrap"
                >
                  Clear list
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {(
                [
                  { key: 'name', label: 'Name (Required)' },
                  { key: 'email', label: 'Email' },
                  { key: 'role', label: 'Role / Award' },
                  { key: 'date', label: 'Date' },
                  { key: 'signature', label: 'Signature' },
                ] as Array<{ key: keyof ColumnMapping; label: string }>
              ).map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <label
                    htmlFor={`map-${item.key}`}
                    className="block text-xs font-semibold text-[#52525B]"
                  >
                    {item.label}
                  </label>
                  <select
                    id={`map-${item.key}`}
                    value={dataset.mapping[item.key]}
                    onChange={(e) => updateMapping(item.key, e.target.value)}
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-2.5 py-2 text-xs font-semibold text-[#141414] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="">— Not mapped —</option>
                    {dataset.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#141414]/20 bg-[#F3F1EA] px-4 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                {errorCount === 0 && dataset.mapping.name && dataset.rows.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#1FA971]">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready to design ({dataset.rows.length} valid rows)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#DC2626]">
                    <AlertCircle className="h-4 w-4" />
                    {dataset.rows.length === 0
                      ? 'Add at least one participant or import a list above to proceed.'
                      : !dataset.mapping.name
                      ? 'Select a column for Name (Required) to proceed.'
                      : `${errorCount} blocking ${errorCount === 1 ? 'error' : 'errors'} found — fix or delete highlighted rows.`}
                  </span>
                )}

                {warningCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#B45309]">
                    <AlertTriangle className="h-4 w-4" />
                    {warningCount} {warningCount === 1 ? 'warning' : 'warnings'} (duplicates or email format)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-sm border-[1.5px] border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0_#141414]">
            <div className="flex flex-col gap-3 border-b-[1.5px] border-[#141414]/15 bg-[#F3F1EA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search participants..."
                  aria-label="Search participants"
                  className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white pl-9 pr-3 py-1.5 text-sm text-[#141414] placeholder:text-[#71717A] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono-tabular text-xs text-[#52525B]">
                  Showing {pagedRows.length} of {filteredAndSortedRows.length}
                </span>
                <button
                  type="button"
                  onClick={() => addParticipant()}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-3 py-1.5 text-xs font-bold text-[#141414] hover:bg-[#f2b824] transition-colors whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add participant
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#141414]/20 bg-[#FBFBF8] text-xs font-bold text-[#52525B]">
                    <th className="px-3 py-3 w-12 font-mono-tabular">#</th>
                    {dataset.headers.map((header) => (
                      <th key={header} className="px-3 py-3 min-w-[160px]">
                        <button
                          type="button"
                          onClick={() => handleSort(header)}
                          className="inline-flex items-center gap-1.5 hover:text-[#141414] transition-colors"
                        >
                          <span>{header}</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-right w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/10">
                  {pagedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={dataset.headers.length + 2}
                        className="px-4 py-10 text-center text-sm text-[#52525B]"
                      >
                        No participants match &ldquo;{searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    pagedRows.map((row, idx) => {
                      const rowIssues = issuesByRow.get(row.id) ?? [];
                      const hasError = rowIssues.some((i) => i.severity === 'error');
                      const hasWarn = rowIssues.some((i) => i.severity === 'warning');
                      const globalIndex = (safePage - 1) * PAGE_SIZE + idx + 1;

                      return (
                        <tr
                          key={row.id}
                          className={
                            hasError
                              ? 'bg-[#FEF2F2]'
                              : hasWarn
                              ? 'bg-[#FFFBEB]'
                              : 'hover:bg-[#FBFBF8]'
                          }
                        >
                          <td className="px-3 py-2 font-mono-tabular text-xs text-[#52525B] align-top pt-3">
                            {globalIndex}
                          </td>
                          {dataset.headers.map((header) => {
                            const cellIssue = rowIssues.find(
                              (i) => i.field === header || i.field === 'Row'
                            );
                            return (
                              <td key={header} className="px-2 py-2 align-top">
                                <input
                                  type="text"
                                  aria-label={`${header} for row ${globalIndex}`}
                                  value={row.values[header] ?? ''}
                                  onChange={(e) => updateCell(row.id, header, e.target.value)}
                                  className={`w-full rounded-sm border px-2.5 py-1.5 text-sm text-[#141414] focus:outline-none ${
                                    cellIssue?.severity === 'error'
                                      ? 'border-[#DC2626] bg-white'
                                      : cellIssue?.severity === 'warning'
                                      ? 'border-[#D97706] bg-white'
                                      : 'border-transparent bg-transparent hover:border-[#141414]/25 focus:border-[#2563EB] focus:bg-white'
                                  }`}
                                />
                                {cellIssue && (
                                  <p
                                    className={`mt-1 px-1 text-[11px] font-medium ${
                                      cellIssue.severity === 'error'
                                        ? 'text-[#DC2626]'
                                        : 'text-[#B45309]'
                                    }`}
                                  >
                                    {cellIssue.message}
                                  </p>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-right align-top pt-2.5">
                            <button
                              type="button"
                              aria-label={`Delete participant row ${globalIndex}`}
                              onClick={() => deleteRow(row.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-[#52525B] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#141414]/15 bg-[#F3F1EA] px-4 py-3 text-xs">
                <span className="font-mono-tabular text-[#52525B]">
                  Page {safePage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 font-semibold text-[#141414] disabled:opacity-40 hover:bg-[#F6C33E] transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 font-semibold text-[#141414] disabled:opacity-40 hover:bg-[#F6C33E] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
