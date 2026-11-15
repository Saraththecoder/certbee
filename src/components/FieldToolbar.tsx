import {
  Award,
  Calendar,
  Copy,
  ImagePlus,
  Mail,
  PenTool,
  Plus,
  Trash2,
  Type,
  User,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DynamicField } from '../types/editor';
import { ParticipantDataset } from '../types/participant';
import { getImageDimensions, readFileAsDataUrl } from '../utils/fileUtils';

interface FieldToolbarProps {
  dataset: ParticipantDataset | null;
  fields: DynamicField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onAddField: (partial: Omit<DynamicField, 'id'>) => void;
  onDuplicateField: (id: string) => void;
  onDeleteField: (id: string) => void;
}

const MAX_SIGN_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_SIGN_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);

export function FieldToolbar({
  dataset,
  fields,
  selectedFieldId,
  onSelectField,
  onAddField,
  onDuplicateField,
  onDeleteField,
}: FieldToolbarProps) {
  const signFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const firstRow = dataset?.rows[0]?.values ?? {};

  const addPreset = (
    key: string,
    label: string,
    fallback: string,
    fontSizePt = 28,
    fontFamily: DynamicField['fontFamily'] = 'DM Sans',
    yPct = 48
  ) => {
    const mappedCol =
      dataset?.mapping && key in dataset.mapping
        ? dataset.mapping[key as keyof typeof dataset.mapping]
        : '';
    const sampleVal =
      (mappedCol && firstRow[mappedCol]) || firstRow[key] || fallback;

    onAddField({
      key,
      label,
      sampleFallback: sampleVal,
      xPct: 20,
      yPct,
      widthPct: 60,
      rotation: 0,
      fontFamily,
      fontSizePt,
      fontWeight: key === 'name' ? 600 : 500,
      color: '#18181B',
      align: 'center',
      letterSpacing: 0,
      opacity: 1,
      autoFit: true,
    });
  };

  const handleSignatureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);

    if (!ALLOWED_SIGN_MIMES.has(file.type)) {
      setUploadError('Use PNG (transparent recommended), JPG, WebP, or SVG for signature images.');
      return;
    }

    if (file.size > MAX_SIGN_IMAGE_BYTES) {
      setUploadError('Signature image must be 5 MB or smaller.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const dims = await getImageDimensions(dataUrl);
      const aspectRatio = dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 2.5;

      onAddField({
        key: 'signature',
        label: 'Signature Image',
        sampleFallback: file.name,
        fieldType: 'image',
        imageDataUrl: dataUrl,
        imageAspectRatio: aspectRatio,
        xPct: 38,
        yPct: 72,
        widthPct: 22,
        rotation: 0,
        fontFamily: 'Fraunces',
        fontSizePt: 24,
        fontWeight: 500,
        color: '#18181B',
        align: 'center',
        letterSpacing: 0,
        opacity: 1,
        autoFit: false,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to load signature image.');
    }
  };

  const extraHeaders = (dataset?.headers ?? []).filter(
    (h) =>
      !Object.values(dataset?.mapping ?? {}).includes(h) &&
      !['name', 'email', 'role', 'date', 'signature'].includes(h.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 border-t lg:border-t-0 lg:border-l-[1.5px] border-[#141414]/15 bg-[#FBFBF8] flex flex-col overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="space-y-2.5">
          <h2 className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
            Add certificate fields
          </h2>

          <input
            ref={signFileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleSignatureImageUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => addPreset('name', 'Participant Name', 'Aarav Kumar', 56, 'Fraunces', 43)}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-[#2563EB]" />
                Participant name
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() => addPreset('role', 'Role / Award', 'First Place Winner', 26, 'Plus Jakarta Sans', 56)}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-[#1FA971]" />
                Role / distinction
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() => addPreset('date', 'Issue Date', '14 Nov 2026', 22, 'DM Sans', 75)}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#EC4899]" />
                Date
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() => addPreset('signature', 'Signature', 'Dr. Kavita Rao', 26, 'Fraunces', 75)}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <PenTool className="h-3.5 w-3.5 text-[#EA580C]" />
                Signature text
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() => signFileInputRef.current?.click()}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <ImagePlus className="h-3.5 w-3.5 text-[#2563EB]" />
                Signature image
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() => addPreset('email', 'Email', 'participant@example.com', 18, 'JetBrains Mono', 84)}
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                Email address
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>

            <button
              type="button"
              onClick={() =>
                addPreset('__custom_text__', 'Custom Label', 'Issued with distinction', 24, 'DM Sans', 34)
              }
              className="flex items-center justify-between rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-2 text-left text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors col-span-2 lg:col-span-1"
            >
              <span className="inline-flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-[#141414]" />
                Static custom text
              </span>
              <Plus className="h-3.5 w-3.5 text-[#52525B]" />
            </button>
          </div>

          {uploadError && (
            <p
              role="alert"
              className="rounded-sm border border-[#DC2626] bg-[#FEF2F2] px-2.5 py-2 text-xs text-[#B91C1C]"
            >
              {uploadError}
            </p>
          )}
        </div>

        {extraHeaders.length > 0 && (
          <div className="space-y-2 border-t border-[#141414]/15 pt-4">
            <h2 className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Custom spreadsheet columns
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {extraHeaders.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => addPreset(col, col, firstRow[col] || col, 24, 'DM Sans', 64)}
                  className="inline-flex items-center gap-1 rounded-sm border border-[#141414] bg-white px-2.5 py-1 text-xs font-semibold text-[#141414] hover:bg-[#F6C33E]"
                >
                  <Plus className="h-3 w-3 text-[#2563EB]" />
                  {col}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 border-t border-[#141414]/15 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Placed fields ({fields.length})
            </h2>
          </div>

          {fields.length === 0 ? (
            <p className="rounded-sm border border-dashed border-[#141414]/35 p-3 text-xs text-[#52525B]">
              Add a field above to place it onto your certificate.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {fields.map((field) => {
                const selected = field.id === selectedFieldId;
                const isImage = field.fieldType === 'image' && Boolean(field.imageDataUrl);
                return (
                  <li
                    key={field.id}
                    className={`flex items-center justify-between rounded-sm border-[1.5px] px-2.5 py-2 text-xs transition-colors ${
                      selected
                        ? 'border-[#141414] bg-[#F6C33E] shadow-[2px_2px_0_#141414]'
                        : 'border-[#141414]/25 bg-white hover:border-[#141414]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectField(field.id)}
                      className="flex-1 text-left min-w-0 pr-2"
                    >
                      <p className="font-bold text-[#141414] truncate">{field.label}</p>
                      <p className="font-mono-tabular text-[11px] text-[#52525B] truncate">
                        {isImage
                          ? 'Uploaded image'
                          : field.key === '__custom_text__'
                          ? field.sampleFallback
                          : `{{${field.key}}}`}
                      </p>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label={`Duplicate ${field.label}`}
                        onClick={() => onDuplicateField(field.id)}
                        className="rounded-sm p-1 text-[#52525B] hover:bg-black/10 hover:text-[#141414]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${field.label}`}
                        onClick={() => onDeleteField(field.id)}
                        className="rounded-sm p-1 text-[#52525B] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
