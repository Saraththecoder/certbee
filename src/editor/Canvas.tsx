import React, { useEffect, useRef, useState } from 'react';
import { TemplateAsset } from '../types/certificate';
import { CustomFontAsset, DynamicField, OverflowWarning } from '../types/editor';
import { ColumnMapping, ParticipantRow } from '../types/participant';
import {
  calculateSnapPosition,
  clamp,
  measureAndFitField,
  resolveFieldText,
} from '../utils/coordinateUtils';
import { DraggableField } from './DraggableField';

interface CanvasProps {
  template: TemplateAsset;
  fields: DynamicField[];
  customFonts?: CustomFontAsset[];
  selectedFieldId: string | null;
  activeParticipant: ParticipantRow | null;
  mapping: ColumnMapping;
  zoom: number;
  showRulers: boolean;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, patch: Partial<DynamicField>, recordHistory?: boolean) => void;
  onSnapshotHistory: () => void;
  onOverflowChange?: (warnings: OverflowWarning[]) => void;
  onFitZoomChange?: (fitZoom: number) => void;
  onZoomChange?: (zoom: number) => void;
}

export function Canvas({
  template,
  fields,
  customFonts,
  selectedFieldId,
  activeParticipant,
  mapping,
  zoom,
  showRulers,
  onSelectField,
  onUpdateField,
  onSnapshotHistory,
  onOverflowChange,
  onFitZoomChange,
  onZoomChange,
}: CanvasProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [baseWidth, setBaseWidth] = useState(760);
  const [snapGuideX, setSnapGuideX] = useState<number | null>(null);
  const [snapGuideY, setSnapGuideY] = useState<number | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      const isNarrow = el.clientWidth < 520;
      const horizPad = isNarrow ? (showRulers ? 56 : 32) : showRulers ? 96 : 64;
      const vertPad = isNarrow ? (showRulers ? 64 : 40) : showRulers ? 100 : 72;
      const availWidth = Math.max(220, el.clientWidth - horizPad);
      const availHeight = Math.max(220, el.clientHeight - vertPad);
      const nextBaseWidth = Math.min(860, availWidth);
      setBaseWidth(nextBaseWidth);

      if (onFitZoomChange && nextBaseWidth > 0) {
        const aspect = template.heightPx / template.widthPx;
        const baseHeight = nextBaseWidth * aspect;
        const fitByWidth = availWidth / nextBaseWidth;
        const fitByHeight = baseHeight > 0 ? availHeight / baseHeight : 1;
        const rawFit = Math.min(fitByWidth, fitByHeight);
        const clampedFit = clamp(Number(rawFit.toFixed(2)), 0.1, 2.0);
        onFitZoomChange(clampedFit);
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showRulers, template.widthPx, template.heightPx, onFitZoomChange]);

  const safeZoom = clamp(zoom, 0.1, 2.0);
  const canvasWidthPx = Math.round(baseWidth * safeZoom);
  const canvasHeightPx = Math.round(canvasWidthPx * (template.heightPx / template.widthPx));

  const measuredFields = fields.map((field) => {
    const renderedText = resolveFieldText(field, activeParticipant, mapping);
    const metrics = measureAndFitField(
      field,
      renderedText,
      canvasWidthPx,
      canvasHeightPx,
      customFonts
    );
    return { field, renderedText, metrics };
  });

  useEffect(() => {
    if (!onOverflowChange) return;
    const warnings = measuredFields
      .map((m) => m.metrics.warning)
      .filter((w): w is OverflowWarning => Boolean(w));
    onOverflowChange(warnings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, customFonts, activeParticipant, canvasWidthPx, canvasHeightPx]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!onZoomChange || (!e.ctrlKey && !e.metaKey)) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    onZoomChange(clamp(Number((safeZoom + delta).toFixed(2)), 0.1, 2.0));
  };

  const handleStartDrag = (e: React.PointerEvent, field: DynamicField) => {
    const stage = stageRef.current;
    if (!stage) return;

    onSnapshotHistory();
    const rect = stage.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialXPct = field.xPct;
    const initialYPct = field.yPct;

    const handleMove = (moveEvt: PointerEvent) => {
      const dxPct = ((moveEvt.clientX - startX) / rect.width) * 100;
      const dyPct = ((moveEvt.clientY - startY) / rect.height) * 100;
      const snap = calculateSnapPosition(
        field,
        initialXPct + dxPct,
        initialYPct + dyPct,
        fields
      );
      setSnapGuideX(snap.snapXGuide);
      setSnapGuideY(snap.snapYGuide);
      onUpdateField(
        field.id,
        {
          xPct: Number(snap.xPct.toFixed(2)),
          yPct: Number(snap.yPct.toFixed(2)),
        },
        false
      );
    };

    const handleUp = () => {
      setSnapGuideX(null);
      setSnapGuideY(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleStartResize = (
    e: React.PointerEvent,
    field: DynamicField,
    edge: 'left' | 'right'
  ) => {
    const stage = stageRef.current;
    if (!stage) return;

    onSnapshotHistory();
    const rect = stage.getBoundingClientRect();
    const startX = e.clientX;
    const initialXPct = field.xPct;
    const initialWidthPct = field.widthPct;

    const handleMove = (moveEvt: PointerEvent) => {
      const dxPct = ((moveEvt.clientX - startX) / rect.width) * 100;
      if (edge === 'right') {
        const nextWidth = clamp(initialWidthPct + dxPct, 8, 100 - initialXPct);
        onUpdateField(field.id, { widthPct: Number(nextWidth.toFixed(2)) }, false);
      } else {
        const rightEdge = initialXPct + initialWidthPct;
        const nextX = clamp(initialXPct + dxPct, 0, rightEdge - 8);
        const nextWidth = rightEdge - nextX;
        onUpdateField(
          field.id,
          {
            xPct: Number(nextX.toFixed(2)),
            widthPct: Number(nextWidth.toFixed(2)),
          },
          false
        );
      }
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div
      ref={viewportRef}
      onClick={() => onSelectField(null)}
      onWheel={handleWheel}
      className="relative flex-1 overflow-auto studio-grid-light-bg p-4 sm:p-8 flex items-start justify-center min-h-[420px]"
    >
      <div className="relative inline-flex flex-col">
        {showRulers && (
          <div
            style={{ width: canvasWidthPx, marginLeft: 24 }}
            className="mb-1 flex justify-between border-b border-[#141414]/20 pb-0.5 font-mono-tabular text-[10px] text-[#52525B] select-none"
          >
            {[0, 25, 50, 75, 100].map((tick) => (
              <span key={tick}>{tick}%</span>
            ))}
          </div>
        )}

        <div className="flex">
          {showRulers && (
            <div
              style={{ height: canvasHeightPx }}
              className="mr-1 flex w-5 flex-col justify-between border-r border-[#141414]/20 pr-1 font-mono-tabular text-[10px] text-[#52525B] select-none"
            >
              {[0, 25, 50, 75, 100].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
          )}

          <div
            ref={stageRef}
            onClick={(e) => e.stopPropagation()}
            style={{ width: canvasWidthPx, height: canvasHeightPx }}
            className="relative shrink-0 overflow-hidden rounded-sm border border-[#141414]/25 bg-white shadow-[0_8px_24px_rgba(20,20,20,0.08)]"
          >
            <img
              src={template.previewDataUrl || template.dataUrl}
              alt={template.name}
              draggable={false}
              className="pointer-events-none h-full w-full select-none object-fill"
            />

            {snapGuideX !== null && (
              <div
                style={{ left: `${snapGuideX}%` }}
                className="pointer-events-none absolute top-0 bottom-0 z-30 w-px border-l border-dashed border-[#2563EB]"
              />
            )}
            {snapGuideY !== null && (
              <div
                style={{ top: `${snapGuideY}%` }}
                className="pointer-events-none absolute left-0 right-0 z-30 h-px border-t border-dashed border-[#2563EB]"
              />
            )}

            {measuredFields.map(({ field, renderedText, metrics }) => (
              <DraggableField
                key={field.id}
                field={field}
                customFonts={customFonts}
                renderedText={renderedText}
                effectiveFontSizePt={metrics.effectiveFontSizePt}
                overflows={metrics.overflows}
                canvasWidthPx={canvasWidthPx}
                canvasHeightPx={canvasHeightPx}
                isSelected={field.id === selectedFieldId}
                onSelect={(id) => onSelectField(id)}
                onStartDrag={handleStartDrag}
                onStartResize={handleStartResize}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
