import {
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  Copy,
  ImagePlus,
  RotateCcw,
  Trash2,
  Type,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { CustomFontAsset, DynamicField, FontFamilyOption } from '../types/editor';
import { clamp } from '../utils/coordinateUtils';
import { getImageDimensions, readFileAsDataUrl } from '../utils/fileUtils';

interface FieldPropertiesProps {
  field: DynamicField | null;
  templateAspectRatio?: number;
  customFonts?: CustomFontAsset[];
  onUploadCustomFont?: (file: File) => Promise<CustomFontAsset>;
  onRemoveCustomFont?: (fontId: string) => void;
  onUpdate: (id: string, patch: Partial<DynamicField>, recordHistory?: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const FONT_OPTIONS: Array<{ label: string; value: FontFamilyOption }> = [
  { label: 'Fraunces (Editorial Serif)', value: 'Fraunces' },
  { label: 'Plus Jakarta Sans (Display)', value: 'Plus Jakarta Sans' },
  { label: 'DM Sans (Clean Sans)', value: 'DM Sans' },
  { label: 'Georgia (Classic Serif)', value: 'Georgia' },
  { label: 'JetBrains Mono (Monospace)', value: 'JetBrains Mono' },
];

const COLOR_SWATCHES = ['#18181B', '#0C4137', '#2563EB', '#EA580C', '#7C2D12', '#FBFBF8'];
const MAX_SIGN_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_SIGN_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);

export function FieldProperties({
  field,
  templateAspectRatio = 16 / 9,
  customFonts = [],
  onUploadCustomFont,
  onRemoveCustomFont,
  onUpdate,
  onDuplicate,
  onDelete,
}: FieldPropertiesProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fontInputRef = useRef<HTMLInputElement | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fontError, setFontError] = useState<string | null>(null);
  const [fontUploading, setFontUploading] = useState(false);

  if (!field) {
    return (
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l-[1.5px] border-[#141414]/15 bg-[#FBFBF8] p-6 flex flex-col justify-center text-center">
        <p className="font-display text-sm font-bold text-[#141414]">No field selected</p>
        <p className="mt-1 text-xs leading-relaxed text-[#52525B]">
          Click any dynamic field on the certificate canvas or in the placed layers list to customize typography, color, signature image, and coordinates.
        </p>
      </aside>
    );
  }

  const isImageField = field.fieldType === 'image' && Boolean(field.imageDataUrl);
  const supportsImageSignature = isImageField || field.key.toLowerCase() === 'signature';

  const handleUploadImageForField = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImageError(null);

    if (!ALLOWED_SIGN_MIMES.has(file.type)) {
      setImageError('Supported formats: PNG (transparent recommended), JPG, WebP, or SVG.');
      return;
    }

    if (file.size > MAX_SIGN_IMAGE_BYTES) {
      setImageError('Image file must be 5 MB or smaller.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const dims = await getImageDimensions(dataUrl);
      const aspectRatio = dims.width > 0 && dims.height > 0 ? dims.width / dims.height : 2.5;

      onUpdate(field.id, {
        fieldType: 'image',
        imageDataUrl: dataUrl,
        imageAspectRatio: aspectRatio,
        widthPct: isImageField ? field.widthPct : Math.min(26, field.widthPct),
        autoFit: false,
      });
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to load signature image.');
    }
  };

  const handleUploadCustomFont = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUploadCustomFont) return;

    setFontError(null);
    setFontUploading(true);
    try {
      const asset = await onUploadCustomFont(file);
      onUpdate(field.id, { customFontId: asset.id });
    } catch (err) {
      setFontError(err instanceof Error ? err.message : 'Failed to load custom font.');
    } finally {
      setFontUploading(false);
    }
  };

  const handleCenterHorizontally = () => {
    const nextX = clamp(50 - field.widthPct / 2, 0, Math.max(0, 100 - field.widthPct));
    onUpdate(field.id, { xPct: Number(nextX.toFixed(2)) });
  };

  const handleCenterVertically = () => {
    let estHeightPct = (field.fontSizePt * 1.2) / 10;
    if (isImageField) {
      const imgRatio = field.imageAspectRatio && field.imageAspectRatio > 0 ? field.imageAspectRatio : 2.5;
      estHeightPct = (field.widthPct / imgRatio) * templateAspectRatio;
    }
    const nextY = clamp(50 - estHeightPct / 2, 0, 95);
    onUpdate(field.id, { yPct: Number(nextY.toFixed(2)) });
  };

  const activeCustomFont = field.customFontId
    ? customFonts.find((f) => f.id === field.customFontId) ?? null
    : null;
  const selectFontValue = activeCustomFont ? `custom:${activeCustomFont.id}` : field.fontFamily;

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l-[1.5px] border-[#141414]/15 bg-[#FBFBF8] overflow-y-auto">
      <div className="p-4 space-y-5">
        <div className="flex items-center justify-between border-b border-[#141414]/15 pb-3">
          <div className="min-w-0">
            <p className="font-mono-tabular text-[11px] font-bold text-[#2563EB]">
              {isImageField
                ? 'SIGNATURE IMAGE'
                : field.key === '__custom_text__'
                ? 'STATIC TEXT'
                : `{{${field.key}}}`}
            </p>
            <h2 className="truncate font-display text-sm font-bold text-[#141414]">
              {field.label}
            </h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              title="Duplicate field"
              aria-label="Duplicate field"
              onClick={() => onDuplicate(field.id)}
              className="rounded-sm border border-[#141414] bg-white p-1.5 text-[#141414] hover:bg-[#F6C33E]"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Delete field"
              aria-label="Delete field"
              onClick={() => onDelete(field.id)}
              className="rounded-sm border border-[#141414] bg-white p-1.5 text-[#DC2626] hover:bg-[#FEF2F2]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {supportsImageSignature && (
          <div className="space-y-2.5 rounded-sm border-[1.5px] border-[#141414] bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#141414]">
                Signature image
              </span>
              {isImageField && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(field.id, {
                      fieldType: 'text',
                      imageDataUrl: undefined,
                      imageAspectRatio: undefined,
                      sampleFallback:
                        field.sampleFallback && !field.sampleFallback.includes('.')
                          ? field.sampleFallback
                          : 'Dr. Kavita Rao',
                    })
                  }
                  className="inline-flex items-center gap-1 font-mono-tabular text-[10px] font-semibold text-[#52525B] hover:text-[#141414]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Use typed text</span>
                </button>
              )}
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleUploadImageForField}
              className="hidden"
            />

            {isImageField && field.imageDataUrl ? (
              <div className="space-y-2">
                <div className="flex h-20 items-center justify-center rounded-sm border border-dashed border-[#141414]/25 bg-[#FBFBF8] p-2">
                  <img
                    src={field.imageDataUrl}
                    alt={field.label}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-3 py-1.5 text-xs font-bold text-[#141414] hover:bg-[#e5b332]"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span>Replace signature image</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-[#2563EB] bg-[#2563EB]/5 px-3 py-2.5 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
              >
                <ImagePlus className="h-4 w-4 shrink-0" />
                <span>Upload handwritten sign (PNG/JPG)</span>
              </button>
            )}

            {imageError && (
              <p role="alert" className="text-[11px] font-medium text-[#DC2626]">
                {imageError}
              </p>
            )}
          </div>
        )}

        {!isImageField && (
          <>
            <div className="space-y-2">
              <label htmlFor="prop-text" className="block text-xs font-semibold text-[#52525B]">
                {field.key === '__custom_text__' ? 'Text content' : 'Fallback / sample text'}
              </label>
              <input
                id="prop-text"
                type="text"
                value={field.sampleFallback}
                onChange={(e) => onUpdate(field.id, { sampleFallback: e.target.value })}
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 text-sm text-[#141414] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="space-y-3 border-t border-[#141414]/15 pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="prop-font" className="block text-xs font-semibold text-[#52525B]">
                    Font family
                  </label>
                  {onUploadCustomFont && (
                    <button
                      type="button"
                      disabled={fontUploading}
                      onClick={() => fontInputRef.current?.click()}
                      className="inline-flex items-center gap-1 font-mono-tabular text-[10px] font-semibold text-[#2563EB] hover:underline disabled:opacity-50"
                    >
                      <Type className="h-3 w-3" />
                      <span>{fontUploading ? 'Loading...' : '+ Upload TTF/OTF'}</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fontInputRef}
                  type="file"
                  accept=".ttf,.otf,font/ttf,font/otf,application/x-font-ttf,application/x-font-opentype"
                  onChange={handleUploadCustomFont}
                  className="hidden"
                />

                <div className="flex items-center gap-1.5">
                  <select
                    id="prop-font"
                    value={selectFontValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.startsWith('custom:')) {
                        onUpdate(field.id, { customFontId: val.slice(7) });
                      } else {
                        onUpdate(field.id, {
                          fontFamily: val as FontFamilyOption,
                          customFontId: undefined,
                        });
                      }
                    }}
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-2 text-xs font-semibold text-[#141414] focus:border-[#2563EB] focus:outline-none"
                  >
                    <optgroup label="Built-in fonts">
                      {FONT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    {customFonts.length > 0 && (
                      <optgroup label="Uploaded fonts (.ttf / .otf)">
                        {customFonts.map((cf) => (
                          <option key={cf.id} value={`custom:${cf.id}`}>
                            {cf.name} (Custom)
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>

                  {activeCustomFont && onRemoveCustomFont && (
                    <button
                      type="button"
                      title={`Remove ${activeCustomFont.name}`}
                      aria-label={`Remove custom font ${activeCustomFont.name}`}
                      onClick={() => onRemoveCustomFont(activeCustomFont.id)}
                      className="shrink-0 rounded-sm border-[1.5px] border-[#141414] bg-white p-2 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {fontError && (
                  <p role="alert" className="text-[11px] font-medium text-[#DC2626]">
                    {fontError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="prop-size" className="block text-xs font-semibold text-[#52525B]">
                    Size (pt)
                  </label>
                  <input
                    id="prop-size"
                    type="number"
                    min={10}
                    max={140}
                    value={field.fontSizePt}
                    onChange={(e) =>
                      onUpdate(field.id, { fontSizePt: Math.max(10, Number(e.target.value) || 12) })
                    }
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 font-mono-tabular text-xs text-[#141414] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="prop-weight" className="block text-xs font-semibold text-[#52525B]">
                    Weight
                  </label>
                  <select
                    id="prop-weight"
                    value={field.fontWeight}
                    onChange={(e) =>
                      onUpdate(field.id, {
                        fontWeight: Number(e.target.value) as DynamicField['fontWeight'],
                      })
                    }
                    className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#141414] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value={400}>Regular (400)</option>
                    <option value={500}>Medium (500)</option>
                    <option value={600}>SemiBold (600)</option>
                    <option value={700}>Bold (700)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-[#141414]/15 pt-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-[#52525B]">Color</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={`Color ${hex}`}
                      onClick={() => onUpdate(field.id, { color: hex })}
                      className={`h-7 w-7 rounded-sm border transition-transform ${
                        field.color.toLowerCase() === hex.toLowerCase()
                          ? 'ring-2 ring-[#2563EB] ring-offset-1 ring-offset-[#FBFBF8] border-[#141414]'
                          : 'border-[#141414]/40'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                  <input
                    type="color"
                    aria-label="Custom ink color"
                    value={field.color}
                    onChange={(e) => onUpdate(field.id, { color: e.target.value })}
                    className="h-7 w-9 cursor-pointer rounded-sm border border-[#141414] bg-white p-0.5"
                  />
                  <span className="font-mono-tabular text-xs text-[#52525B] ml-1 uppercase">
                    {field.color}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-[#52525B]">Text alignment</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { value: 'left', icon: AlignLeft, label: 'Align left' },
                      { value: 'center', icon: AlignCenter, label: 'Align center' },
                      { value: 'right', icon: AlignRight, label: 'Align right' },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    const active = field.align === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-label={item.label}
                        onClick={() => onUpdate(field.id, { align: item.value })}
                        className={`flex items-center justify-center rounded-sm border-[1.5px] py-1.5 transition-colors ${
                          active
                            ? 'border-[#141414] bg-[#F6C33E] text-[#141414]'
                            : 'border-[#141414]/30 bg-white text-[#52525B] hover:text-[#141414]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="space-y-3 border-t border-[#141414]/15 pt-4">
          {!isImageField && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#52525B]">Letter spacing</span>
                <span className="font-mono-tabular text-[#141414]">
                  {(field.letterSpacing / 100).toFixed(2)}em
                </span>
              </div>
              <input
                type="range"
                aria-label="Letter spacing"
                min={-5}
                max={20}
                step={1}
                value={field.letterSpacing}
                onChange={(e) => onUpdate(field.id, { letterSpacing: Number(e.target.value) })}
                className="w-full accent-[#141414]"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#52525B]">Opacity</span>
              <span className="font-mono-tabular text-[#141414]">
                {Math.round(field.opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Field opacity"
              min={15}
              max={100}
              step={5}
              value={Math.round(field.opacity * 100)}
              onChange={(e) => onUpdate(field.id, { opacity: Number(e.target.value) / 100 })}
              className="w-full accent-[#141414]"
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-[#141414]/15 pt-4">
          <p className="text-xs font-semibold text-[#52525B]">Position &amp; box (%)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCenterHorizontally}
              className="inline-flex items-center justify-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <AlignHorizontalJustifyCenter className="h-3.5 w-3.5" />
              <span>Center X</span>
            </button>
            <button
              type="button"
              onClick={handleCenterVertically}
              className="inline-flex items-center justify-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors"
            >
              <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
              <span>Center Y</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label htmlFor="prop-x" className="block text-[11px] text-[#52525B]">
                X (%)
              </label>
              <input
                id="prop-x"
                type="number"
                step={0.5}
                min={0}
                max={95}
                value={Number(field.xPct.toFixed(1))}
                onChange={(e) =>
                  onUpdate(field.id, { xPct: Math.max(0, Math.min(95, Number(e.target.value) || 0)) })
                }
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 font-mono-tabular text-xs text-[#141414]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prop-y" className="block text-[11px] text-[#52525B]">
                Y (%)
              </label>
              <input
                id="prop-y"
                type="number"
                step={0.5}
                min={0}
                max={95}
                value={Number(field.yPct.toFixed(1))}
                onChange={(e) =>
                  onUpdate(field.id, { yPct: Math.max(0, Math.min(95, Number(e.target.value) || 0)) })
                }
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 font-mono-tabular text-xs text-[#141414]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prop-width" className="block text-[11px] text-[#52525B]">
                Width (%)
              </label>
              <input
                id="prop-width"
                type="number"
                step={1}
                min={8}
                max={100 - field.xPct}
                value={Number(field.widthPct.toFixed(1))}
                onChange={(e) =>
                  onUpdate(field.id, {
                    widthPct: Math.max(8, Math.min(100 - field.xPct, Number(e.target.value) || 20)),
                  })
                }
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 font-mono-tabular text-xs text-[#141414]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prop-rot" className="block text-[11px] text-[#52525B]">
                Rotation (°)
              </label>
              <input
                id="prop-rot"
                type="number"
                step={1}
                min={-45}
                max={45}
                value={field.rotation}
                onChange={(e) =>
                  onUpdate(field.id, {
                    rotation: Math.max(-45, Math.min(45, Number(e.target.value) || 0)),
                  })
                }
                className="w-full rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1.5 font-mono-tabular text-xs text-[#141414]"
              />
            </div>
          </div>

          {isImageField ? (
            <p className="rounded-sm border border-[#141414]/20 bg-white p-2.5 text-[11px] leading-relaxed text-[#52525B]">
              Drag the yellow side handles on the canvas or change <strong className="text-[#141414]">Width (%)</strong> to resize the signature proportionally.
            </p>
          ) : (
            <label className="flex items-start gap-2.5 rounded-sm border-[1.5px] border-[#141414] bg-white p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={field.autoFit}
                onChange={(e) => onUpdate(field.id, { autoFit: e.target.checked })}
                className="mt-0.5 accent-[#2563EB]"
              />
              <span className="text-xs leading-snug text-[#141414]">
                <strong className="font-bold">Auto-fit long names</strong>
                <span className="block text-[#52525B]">
                  Automatically scales down text size when a long name exceeds the box width.
                </span>
              </span>
            </label>
          )}
        </div>
      </div>
    </aside>
  );
}
