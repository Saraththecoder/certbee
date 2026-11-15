import { AlertCircle, ArrowRight, CheckCircle2, RefreshCw, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { trackEvent } from '../utils/analytics';
import { formatBytes } from '../utils/fileUtils';

export function UploadZone() {
  const { certificate, setStep } = useBatchWorkspace();
  const { template, isUploading, uploadProgress, uploadError, uploadTemplateFile, clearTemplate } =
    certificate;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ok = await uploadTemplateFile(file);
    if (ok) {
      const ext = file.name.toLowerCase();
      const format =
        file.type === 'application/pdf' || ext.endsWith('.pdf')
          ? 'pdf'
          : file.type === 'image/svg+xml' || ext.endsWith('.svg')
          ? 'svg'
          : file.type === 'image/jpeg' || ext.endsWith('.jpg') || ext.endsWith('.jpeg')
          ? 'jpg'
          : 'png';
      trackEvent('template_uploaded', { format });
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-block rounded-sm border border-[#141414] bg-[#F6C33E] px-2 py-0.5 font-mono-tabular text-[11px] font-bold text-[#141414]">
            STEP 01
          </span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141414]">
            Upload your certificate template
          </h1>
          <p className="mt-1 text-sm text-[#52525B]">
            Upload a clean PNG, JPG, SVG, or PDF certificate background without recipient names.
          </p>
        </div>

        {template && (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center justify-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors whitespace-nowrap shrink-0 shadow-[3px_3px_0_#2563EB]"
          >
            CONTINUE TO PARTICIPANTS
            <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,application/pdf,.png,.jpg,.jpeg,.svg,.pdf"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {uploadError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-sm border-[1.5px] border-[#DC2626] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to load template</p>
            <p className="mt-0.5">{uploadError}</p>
          </div>
        </div>
      )}

      {!template ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-sm border-2 border-dashed p-8 sm:p-14 text-center transition-colors shadow-[5px_5px_0_#141414] ${
            isDragging
              ? 'border-[#2563EB] bg-[#EFF6FF]'
              : 'border-[#141414] bg-white hover:bg-[#FBFBF8]'
          }`}
        >
          <div className="mx-auto flex max-w-md flex-col items-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border-[1.5px] border-[#141414] bg-[#C8EFE0] shadow-[2px_2px_0_#141414]">
              <Upload className="h-5 w-5 text-[#141414]" />
            </div>

            <div className="space-y-1">
              <p className="font-display text-lg font-bold text-[#141414]">
                Drag and drop your PNG, JPG, SVG, or PDF certificate
              </p>
              <p className="text-sm text-[#52525B]">
                Vector PDFs preserve artwork sharpness. For raster exports, use 1920 × 1080 px or 300 DPI A4 (up to 25 MB).
              </p>
            </div>

            {isUploading ? (
              <div className="w-full max-w-xs space-y-2 pt-2">
                <div className="h-2 w-full overflow-hidden rounded-full border border-[#141414] bg-[#F3F1EA]">
                  <div
                    className="h-full bg-[#2563EB] transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="font-mono-tabular text-xs text-[#52525B]">
                  Reading template... {uploadProgress}%
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-5 py-2.5 font-mono-tabular text-xs font-bold tracking-wider text-[#141414] hover:bg-[#f2b824] transition-colors shadow-[3px_3px_0_#141414]"
              >
                BROWSE FILES
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-sm border-[1.5px] border-[#141414] bg-white overflow-hidden shadow-[5px_5px_0_#141414]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-[1.5px] border-[#141414]/20 bg-[#F3F1EA] px-5 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <CheckCircle2 className="h-5 w-5 text-[#1FA971] shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#141414]">{template.name}</p>
                <p className="font-mono-tabular text-xs text-[#52525B]">
                  {template.widthPx} × {template.heightPx} px · {formatBytes(template.fileSize)} ·{' '}
                  {template.mimeType === 'application/pdf'
                    ? 'PDF (Vector)'
                    : template.mimeType === 'image/svg+xml'
                    ? 'SVG'
                    : template.mimeType === 'image/png'
                    ? 'PNG'
                    : 'JPG'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace template
              </button>
              <button
                type="button"
                onClick={clearTemplate}
                className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>

          <div className="studio-grid-bg p-6 sm:p-10 flex justify-center">
            <img
              src={template.previewDataUrl || template.dataUrl}
              alt={`Uploaded certificate template: ${template.name}`}
              className="max-h-[460px] w-auto rounded-sm border border-[#141414]/40 shadow-lg object-contain"
            />
          </div>

          <div className="flex flex-col gap-3 border-t-[1.5px] border-[#141414]/20 bg-[#FBFBF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#52525B]">
              Aspect ratio ({(template.widthPx / template.heightPx).toFixed(2)}:1) will be preserved across the editor and exported PDFs.
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center justify-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors whitespace-nowrap shadow-[3px_3px_0_#2563EB]"
            >
              CONTINUE TO PARTICIPANTS
              <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
