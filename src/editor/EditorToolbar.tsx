import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Redo2,
  Ruler,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { OverflowWarning } from '../types/editor';
import { ColumnMapping, ParticipantRow } from '../types/participant';

interface EditorToolbarProps {
  participants: ParticipantRow[];
  mapping: ColumnMapping;
  previewIndex: number;
  onPreviewIndexChange: (index: number) => void;
  zoom: number;
  fitZoom: number;
  onZoomChange: (zoom: number) => void;
  onZoomToFit: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  overflowWarnings: OverflowWarning[];
  onBack: () => void;
  onNext: () => void;
}

export function EditorToolbar({
  participants,
  mapping,
  previewIndex,
  onPreviewIndexChange,
  zoom,
  fitZoom,
  onZoomChange,
  onZoomToFit,
  showRulers,
  onToggleRulers,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  overflowWarnings,
  onBack,
  onNext,
}: EditorToolbarProps) {
  const total = participants.length;
  const safeIdx = total > 0 ? Math.min(previewIndex, total - 1) : 0;
  const zoomPct = Math.round(zoom * 100);
  const isAtFit = Math.abs(zoom - fitZoom) < 0.015;

  const getDisplayName = (row: ParticipantRow, idx: number) => {
    const val = mapping.name ? row.values[mapping.name] : '';
    return val?.trim() || `Participant ${idx + 1}`;
  };

  return (
    <div className="border-b-[1.5px] border-[#141414]/15 bg-white px-4 py-2.5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-3 py-1.5 text-xs font-semibold text-[#141414] hover:bg-[#F3F1EA] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Participants
          </button>

          <div className="flex items-center rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] p-0.5">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
              className="rounded-sm p-1.5 text-[#141414] disabled:opacity-35 hover:bg-[#F6C33E] transition-colors"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
              className="rounded-sm p-1.5 text-[#141414] disabled:opacity-35 hover:bg-[#F6C33E] transition-colors"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {total > 0 && (
          <div className="order-3 sm:order-2 flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#F3F1EA] px-2 py-1">
            <button
              type="button"
              aria-label="Previous participant"
              onClick={() => onPreviewIndexChange(safeIdx > 0 ? safeIdx - 1 : total - 1)}
              className="rounded-sm p-1 text-[#141414] hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <select
              aria-label="Select preview participant"
              value={safeIdx}
              onChange={(e) => onPreviewIndexChange(Number(e.target.value))}
              className="max-w-[170px] truncate rounded-sm bg-white px-2 py-1 text-xs font-semibold text-[#141414] border border-[#141414] focus:outline-none focus:border-[#2563EB]"
            >
              {participants.map((row, idx) => (
                <option key={row.id} value={idx}>
                  {getDisplayName(row, idx)}
                </option>
              ))}
            </select>

            <span className="font-mono-tabular text-xs text-[#52525B] px-1 whitespace-nowrap">
              {safeIdx + 1} of {total}
            </span>

            <button
              type="button"
              aria-label="Next participant"
              onClick={() => onPreviewIndexChange(safeIdx < total - 1 ? safeIdx + 1 : 0)}
              className="rounded-sm p-1 text-[#141414] hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="order-2 sm:order-3 flex flex-wrap items-center gap-2">
          {overflowWarnings.length > 0 && (
            <div
              title={overflowWarnings.map((w) => `${w.fieldLabel}: "${w.renderedText}"`).join(', ')}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-sm border border-[#D97706] bg-[#FFFBEB] px-2.5 py-1.5 text-xs font-semibold text-[#B45309]"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>
                {overflowWarnings.length} long text {overflowWarnings.length === 1 ? 'box' : 'boxes'}
              </span>
            </div>
          )}

          {/* Zoom Controls: Zoom Out + Manual Zoom Slider (10%-200%) + Zoom In + Zoom to Fit + Rulers */}
          <div className="flex items-center gap-1 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-1 py-0.5">
            <button
              type="button"
              disabled={zoom <= 0.1}
              onClick={() => onZoomChange(Math.max(0.1, Number((zoom - 0.1).toFixed(2))))}
              aria-label="Zoom out"
              title="Zoom out (Ctrl+-)"
              className="rounded-sm p-1 sm:p-1.5 text-[#141414] disabled:opacity-35 hover:bg-white"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <input
              type="range"
              aria-label="Canvas zoom percentage"
              min={10}
              max={200}
              step={5}
              value={zoomPct}
              onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
              className="w-16 sm:w-24 accent-[#2563EB] cursor-pointer"
            />

            <span className="w-9 sm:w-10 text-right font-mono-tabular text-[11px] sm:text-xs font-semibold text-[#141414] select-none">
              {zoomPct}%
            </span>

            <button
              type="button"
              disabled={zoom >= 2.0}
              onClick={() => onZoomChange(Math.min(2.0, Number((zoom + 0.1).toFixed(2))))}
              aria-label="Zoom in"
              title="Zoom in (Ctrl++)"
              className="rounded-sm p-1.5 text-[#141414] disabled:opacity-35 hover:bg-white"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onZoomToFit}
              title={`Zoom to fit (${Math.round(fitZoom * 100)}%) · Ctrl+0`}
              aria-label="Zoom to fit"
              className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 font-mono-tabular text-[11px] font-semibold transition-colors whitespace-nowrap ${
                isAtFit
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#141414] hover:bg-white'
              }`}
            >
              <Maximize2 className="h-3 w-3" />
              <span>Fit</span>
            </button>

            <button
              type="button"
              onClick={onToggleRulers}
              title="Toggle rulers"
              aria-label="Toggle rulers"
              className={`hidden sm:inline-flex rounded-sm p-1.5 transition-colors ${
                showRulers ? 'bg-[#F6C33E] text-[#141414]' : 'text-[#52525B] hover:bg-white'
              }`}
            >
              <Ruler className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-4 py-1.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors whitespace-nowrap shadow-[2px_2px_0_#2563EB]"
          >
            GENERATE PDFS
            <ArrowRight className="h-4 w-4 text-[#F6C33E]" />
          </button>
        </div>
      </div>
    </div>
  );
}
