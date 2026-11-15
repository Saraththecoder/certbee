import {
  AlertCircle,
  Archive,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  StopCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { generateCertificateBatch } from '../services/pdfService';
import { createStreamingZipSession } from '../services/zipService';
import { GeneratedCert, GenerationJobState } from '../types/editor';
import { getBatchSizeBucket, trackEvent } from '../utils/analytics';
import { downloadBlob, sanitizeFilename } from '../utils/fileUtils';

export function GenerationProgress() {
  const { certificate, participants, editor, customFonts, setStep } = useBatchWorkspace();
  const template = certificate.template;
  const dataset = participants.dataset;

  const cancelRef = useRef(false);
  const [zipProgressPct, setZipProgressPct] = useState<number | null>(null);
  const [job, setJob] = useState<GenerationJobState>({
    status: 'idle',
    total: dataset?.rows.length ?? 0,
    completed: 0,
    failed: 0,
    errors: [],
    results: [],
    zipBlob: null,
  });

  if (!template || !dataset) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center space-y-4">
        <p className="font-display text-xl font-bold text-[#141414]">
          Batch setup incomplete
        </p>
        <p className="text-sm text-[#52525B]">
          Ensure both a template and valid participant list are loaded before generating certificates.
        </p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-5 py-2.5 text-sm font-bold text-[#141414]"
        >
          Return to Step 01
        </button>
      </div>
    );
  }

  const totalCount = dataset.rows.length;
  const isValid = !participants.hasBlockingErrors && editor.fields.length > 0;
  const progressPct = job.total > 0 ? Math.round((job.completed / job.total) * 100) : 0;

  const handleGenerateAndDownloadZip = async () => {
    if (!isValid) return;
    cancelRef.current = false;
    setZipProgressPct(null);

    setJob({
      status: 'running',
      total: totalCount,
      completed: 0,
      failed: 0,
      errors: [],
      results: [],
      zipBlob: null,
    });

    const collected: GeneratedCert[] = [];
    const errors: Array<{ participantName: string; reason: string }> = [];
    const zipFolderName = `${sanitizeFilename(template.name.replace(/\.[^.]+$/, ''), 'CertBee')}_Certificates`;
    const zipSession = createStreamingZipSession(zipFolderName);

    try {
      await generateCertificateBatch(
        template,
        editor.fields,
        dataset.rows,
        dataset.mapping,
        {
          onPdfBytes: (filename, pdfBytes) => {
            zipSession.addPdf(filename, pdfBytes);
          },
          onProgress: (completed, total, cert) => {
            if (cert) collected.push(cert);
            // Update smoothly while avoiding unnecessary array copies on large 500-1000+ batches
            if (completed === total || completed <= 20 || completed % 5 === 0) {
              setJob((prev) => ({
                ...prev,
                total,
                completed,
              }));
            }
          },
          onError: (participantName, reason) => {
            errors.push({ participantName, reason });
            setJob((prev) => ({
              ...prev,
              failed: errors.length,
              errors: [...errors],
            }));
          },
          shouldCancel: () => cancelRef.current,
        },
        customFonts
      );

      if (cancelRef.current) {
        setJob((prev) => ({ ...prev, status: 'cancelled', results: collected }));
        return;
      }

      if (collected.length === 0) {
        setJob((prev) => ({ ...prev, status: 'error' }));
        return;
      }

      setZipProgressPct(0);
      const zipBlob = await zipSession.finalize((pct) => {
        setZipProgressPct(pct);
      });
      setZipProgressPct(null);

      setJob((prev) => ({
        ...prev,
        status: 'completed',
        completed: totalCount,
        results: collected,
        zipBlob,
      }));

      const zipName = `${zipFolderName}.zip`;
      trackEvent('design_completed', { field_count: editor.fields.length });
      trackEvent('batch_generated', { batch_size_bucket: getBatchSizeBucket(collected.length) });
      trackEvent('zip_downloaded', { batch_size_bucket: getBatchSizeBucket(collected.length) });
      downloadBlob(zipBlob, zipName);
    } catch (err) {
      setZipProgressPct(null);
      errors.push({
        participantName: 'ZIP Archive',
        reason: err instanceof Error ? err.message : 'Unexpected batch failure',
      });
      setJob((prev) => ({
        ...prev,
        status: 'error',
        results: collected,
        failed: errors.length,
        errors: [...errors],
      }));
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  const handleDownloadExistingZip = () => {
    if (!job.zipBlob) return;
    const zipName = `${sanitizeFilename(template.name.replace(/\.[^.]+$/, ''), 'CertBee')}_Certificates.zip`;
    downloadBlob(job.zipBlob, zipName);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-sm border border-[#141414] bg-[#2563EB] px-2 py-0.5 font-mono-tabular text-[11px] font-bold text-white">
            STEP 04
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414]">
            Generate &amp; download certificates
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Review your batch configuration, render every personalized PDF directly in your browser, and download them together as a ZIP.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={job.status === 'running'}
          className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-2.5 text-sm font-semibold text-[#141414] hover:bg-[#F3F1EA] disabled:opacity-50 transition-colors self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Design
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-4 space-y-1 shadow-[3px_3px_0_#141414]">
          <p className="text-xs font-semibold text-[#52525B]">Template</p>
          <p className="truncate text-sm font-bold text-[#141414]">{template.name}</p>
          <p className="font-mono-tabular text-xs text-[#2563EB]">
            {template.widthPx} × {template.heightPx} px
          </p>
        </div>

        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-4 space-y-1 shadow-[3px_3px_0_#141414]">
          <p className="text-xs font-semibold text-[#52525B]">Participants</p>
          <p className="font-mono-tabular text-2xl font-extrabold text-[#141414]">{totalCount}</p>
          <p className="text-xs text-[#52525B]">Named PDFs to build</p>
        </div>

        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-4 space-y-1 shadow-[3px_3px_0_#141414]">
          <p className="text-xs font-semibold text-[#52525B]">Dynamic fields</p>
          <p className="font-mono-tabular text-2xl font-extrabold text-[#141414]">
            {editor.fields.length}
          </p>
          <p className="text-xs text-[#52525B]">Placed on canvas</p>
        </div>

        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-4 space-y-1 shadow-[3px_3px_0_#141414]">
          <p className="text-xs font-semibold text-[#52525B]">Validation</p>
          {isValid ? (
            <>
              <p className="inline-flex items-center gap-1 text-sm font-bold text-[#1FA971]">
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </p>
              <p className="text-xs text-[#52525B]">0 blocking issues</p>
            </>
          ) : (
            <>
              <p className="inline-flex items-center gap-1 text-sm font-bold text-[#DC2626]">
                <AlertCircle className="h-4 w-4" />
                Action needed
              </p>
              <p className="text-xs text-[#52525B]">
                {editor.fields.length === 0 ? 'Add at least 1 field' : 'Fix participant errors'}
              </p>
            </>
          )}
        </div>

        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-4 space-y-1 shadow-[3px_3px_0_#141414]">
          <p className="text-xs font-semibold text-[#52525B]">Output format</p>
          <p className="text-sm font-bold text-[#141414]">PDF + ZIP</p>
          <p className="text-xs text-[#52525B]">Local browser render</p>
        </div>
      </div>

      <div className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 space-y-5 shadow-[4px_4px_0_#141414]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-[#141414]">
                Local Batch ZIP Export
              </h2>
              <p className="text-sm text-[#52525B]">
                Renders {totalCount} individual PDFs locally using pdf-lib and bundles them into a single ZIP file with sanitized participant filenames.
              </p>
            </div>
            <Archive className="h-5 w-5 text-[#2563EB] shrink-0" />
          </div>

          {job.status === 'running' && (
            <div className="space-y-2 rounded-sm border border-[#141414]/20 bg-[#FBFBF8] p-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-2 text-[#141414]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                  {zipProgressPct !== null
                    ? 'Packaging ZIP archive...'
                    : 'Generating vector PDFs locally...'}
                </span>
                <span className="font-mono-tabular text-[#141414]">
                  {zipProgressPct !== null
                    ? `${zipProgressPct}%`
                    : `${job.completed} / ${job.total} (${progressPct}%)`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-[#141414] bg-white">
                <div
                  className="h-full bg-[#2563EB] transition-all duration-150"
                  style={{ width: `${zipProgressPct ?? progressPct}%` }}
                />
              </div>
              <div className="flex justify-between font-mono-tabular text-xs text-[#52525B]">
                <span>Completed: {job.completed}</span>
                <span>Remaining: {Math.max(0, job.total - job.completed)}</span>
              </div>
            </div>
          )}

          {job.status === 'completed' && (
            <div className="flex items-start gap-3 rounded-sm border-[1.5px] border-[#1FA971] bg-[#ECFDF5] p-4 text-sm text-[#065F46]">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#1FA971]" />
              <div>
                <p className="font-bold text-[#141414]">
                  Generated {job.results.length} personalized PDF certificates
                </p>
                <p className="text-xs mt-0.5 text-[#52525B]">
                  Your ZIP download started automatically. You can re-download the archive or grab individual PDFs below.
                </p>
              </div>
            </div>
          )}

          {job.errors.length > 0 && (
            <div className="rounded-sm border border-[#DC2626] bg-[#FEF2F2] p-4 text-xs text-[#B91C1C] space-y-1">
              <p className="font-bold">
                {job.errors.length} {job.errors.length === 1 ? 'error' : 'errors'} occurred:
              </p>
              {job.errors.slice(0, 5).map((e, idx) => (
                <p key={idx}>
                  {e.participantName}: {e.reason}
                </p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {job.status === 'running' ? (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#DC2626] bg-[#FEF2F2] px-5 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                <StopCircle className="h-4 w-4" />
                Cancel generation
              </button>
            ) : (
              <button
                type="button"
                disabled={!isValid}
                onClick={handleGenerateAndDownloadZip}
                className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] disabled:bg-[#E4E4E7] disabled:text-[#71717A] disabled:border-[#A1A1AA] disabled:cursor-not-allowed transition-colors shadow-[3px_3px_0_#2563EB]"
              >
                <Download className="h-4 w-4 text-[#F6C33E]" />
                {job.status === 'completed' ? 'REGENERATE & DOWNLOAD ZIP' : 'GENERATE & DOWNLOAD ZIP'}
              </button>
            )}

            {job.zipBlob && job.status === 'completed' && (
              <button
                type="button"
                onClick={handleDownloadExistingZip}
                className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-4 py-2.5 text-sm font-bold text-[#141414] hover:bg-[#f2b824]"
              >
                <Archive className="h-4 w-4" />
                Download ZIP again
              </button>
            )}
          </div>
      </div>

      {job.results.length > 0 && (
        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white overflow-hidden shadow-[4px_4px_0_#141414]">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#141414]/15 bg-[#F3F1EA] px-5 py-3">
            <h3 className="font-display text-sm font-bold text-[#141414]">
              Individual certificates ({job.results.length})
            </h3>
            <span className="text-xs text-[#52525B]">
              Click any row to download a single PDF
            </span>
          </div>

          <ul className="divide-y divide-[#141414]/10 max-h-96 overflow-y-auto">
            {job.results.map((cert) => (
              <li
                key={cert.participantId}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-[#FBFBF8]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-[#2563EB] shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#141414]">
                      {cert.participantName}
                    </p>
                    <p className="truncate font-mono-tabular text-xs text-[#52525B]">
                      {cert.filename}
                      {cert.email ? ` · ${cert.email}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadBlob(cert.blob, cert.filename)}
                  className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors shrink-0"
                >
                  <Download className="h-3.5 w-3.5 text-[#2563EB]" />
                  Download PDF
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
