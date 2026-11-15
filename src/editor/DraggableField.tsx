import React from 'react';
import { CustomFontAsset, DynamicField } from '../types/editor';
import { getFontCssString } from '../utils/coordinateUtils';

interface DraggableFieldProps {
  field: DynamicField;
  customFonts?: CustomFontAsset[];
  renderedText: string;
  effectiveFontSizePt: number;
  overflows: boolean;
  canvasWidthPx: number;
  canvasHeightPx: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStartDrag: (e: React.PointerEvent, field: DynamicField) => void;
  onStartResize: (e: React.PointerEvent, field: DynamicField, edge: 'left' | 'right') => void;
}

export function DraggableField({
  field,
  customFonts,
  renderedText,
  effectiveFontSizePt,
  overflows,
  canvasHeightPx,
  isSelected,
  onSelect,
  onStartDrag,
  onStartResize,
}: DraggableFieldProps) {
  const scale = canvasHeightPx / 1000;
  const fontSizePx = Math.max(8, effectiveFontSizePt * scale);
  const letterSpacingEm = field.letterSpacing / 100;

  const isImageField = field.fieldType === 'image' && Boolean(field.imageDataUrl);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${field.label} field${isImageField ? ' (image)' : `: ${renderedText}`}`}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(field.id);
        onStartDrag(e, field);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(field.id);
        }
      }}
      style={{
        left: `${field.xPct}%`,
        top: `${field.yPct}%`,
        width: `${field.widthPct}%`,
        transform: field.rotation !== 0 ? `rotate(${field.rotation}deg)` : undefined,
        transformOrigin: 'center center',
        touchAction: 'none',
      }}
      className={`group absolute select-none cursor-move rounded-[3px] transition-shadow ${
        isSelected
          ? overflows && !field.autoFit
            ? 'ring-2 ring-[#F59E0B] bg-[#F59E0B]/15 z-20'
            : 'ring-2 ring-[#2563EB] bg-[#2563EB]/10 z-20'
          : overflows && !field.autoFit
          ? 'ring-1 ring-dashed ring-[#F59E0B]/80 hover:ring-[#F59E0B] z-10'
          : 'ring-1 ring-transparent hover:ring-[#2563EB]/60 hover:bg-[#2563EB]/10 z-10'
      }`}
    >
      {isImageField ? (
        <img
          src={field.imageDataUrl}
          alt={field.label}
          draggable={false}
          style={{ opacity: field.opacity }}
          className="block w-full h-auto select-none pointer-events-none object-contain"
        />
      ) : (
        <div
          style={{
            font: getFontCssString(
              field.fontFamily,
              field.fontWeight,
              fontSizePx,
              customFonts,
              field.customFontId
            ),
            lineHeight: 1.2,
            color: field.color,
            opacity: field.opacity,
            textAlign: field.align,
            letterSpacing: `${letterSpacingEm}em`,
          }}
          className={`w-full px-1 py-0.5 ${
            field.autoFit ? 'whitespace-nowrap overflow-hidden' : 'break-words'
          }`}
        >
          {renderedText || ' '}
        </div>
      )}

      {isSelected && (
        <>
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              onStartResize(e, field, 'left');
            }}
            title="Resize left edge"
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-4 w-2.5 cursor-ew-resize rounded-sm border border-[#141414] bg-[#F6C33E] shadow-xs"
          />
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              onStartResize(e, field, 'right');
            }}
            title="Resize right edge"
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-4 w-2.5 cursor-ew-resize rounded-sm border border-[#141414] bg-[#F6C33E] shadow-xs"
          />
          <span className="pointer-events-none absolute -top-5 left-0 rounded-sm bg-[#2563EB] px-1.5 py-0.5 font-mono-tabular text-[10px] font-semibold text-white whitespace-nowrap shadow-xs">
            {isImageField
              ? 'IMAGE SIGN'
              : field.key === '__custom_text__'
              ? field.label
              : `{{${field.key}}}`}
          </span>
        </>
      )}
    </div>
  );
}
