import { AlertTriangle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '../editor/Canvas';
import { EditorToolbar } from '../editor/EditorToolbar';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { OverflowWarning } from '../types/editor';
import { clamp } from '../utils/coordinateUtils';
import { FieldProperties } from './FieldProperties';
import { FieldToolbar } from './FieldToolbar';

export function CertificateCanvas() {
  const { certificate, participants, editor, customFonts, addCustomFont, removeCustomFont, setStep } =
    useBatchWorkspace();
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showRulers, setShowRulers] = useState(true);
  const [fitZoom, setFitZoom] = useState(1);
  const [overflowWarnings, setOverflowWarnings] = useState<OverflowWarning[]>([]);
  const [mobilePanel, setMobilePanel] = useState<'canvas' | 'fields' | 'properties'>('canvas');
  const didInitialFitRef = useRef(false);

  const template = certificate.template;
  const dataset = participants.dataset;
  const rows = dataset?.rows ?? [];
  const activeParticipant = rows[previewIndex] ?? null;

  useEffect(() => {
    if (rows.length > 0 && previewIndex >= rows.length) {
      setPreviewIndex(rows.length - 1);
    }
  }, [rows.length, previewIndex]);

  useEffect(() => {
    didInitialFitRef.current = false;
  }, [template?.id]);

  const handleFitZoomChange = useCallback(
    (nextFit: number) => {
      setFitZoom(nextFit);
      if (!didInitialFitRef.current && nextFit < 1) {
        editor.setZoom(nextFit);
        didInitialFitRef.current = true;
      }
    },
    [editor]
  );

  const handleZoomToFit = useCallback(() => {
    editor.setZoom(fitZoom);
  }, [editor, fitZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditingInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');
      if (isEditingInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        handleZoomToFit();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        editor.setZoom(Math.min(2.0, Number((editor.zoom + 0.1).toFixed(2))));
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        editor.setZoom(Math.max(0.1, Number((editor.zoom - 0.1).toFixed(2))));
        return;
      }

      if (!editor.selectedField) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        editor.deleteField(editor.selectedField.id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        editor.updateField(editor.selectedField.id, {
          xPct: clamp(editor.selectedField.xPct - 0.5, 0, 100 - editor.selectedField.widthPct),
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        editor.updateField(editor.selectedField.id, {
          xPct: clamp(editor.selectedField.xPct + 0.5, 0, 100 - editor.selectedField.widthPct),
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        editor.updateField(editor.selectedField.id, {
          yPct: clamp(editor.selectedField.yPct - 0.5, 0, 96),
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        editor.updateField(editor.selectedField.id, {
          yPct: clamp(editor.selectedField.yPct + 0.5, 0, 96),
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, handleZoomToFit]);

  if (!template) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center space-y-4">
        <p className="font-display text-xl font-bold text-[#141414]">
          No certificate template loaded
        </p>
        <p className="text-sm text-[#52525B]">
          Upload a template in Step 01 before opening the visual editor.
        </p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-5 py-2.5 text-sm font-bold text-[#141414]"
        >
          Go to Step 01
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-132px)] bg-[#FBFBF8]">
      <EditorToolbar
        participants={rows}
        mapping={
          dataset?.mapping ?? {
            name: '',
            email: '',
            role: '',
            date: '',
            signature: '',
          }
        }
        previewIndex={previewIndex}
        onPreviewIndexChange={setPreviewIndex}
        zoom={editor.zoom}
        fitZoom={fitZoom}
        onZoomChange={editor.setZoom}
        onZoomToFit={handleZoomToFit}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers((r) => !r)}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onUndo={editor.undo}
        onRedo={editor.redo}
        overflowWarnings={overflowWarnings}
        onBack={() => setStep(2)}
        onNext={() => setStep(4)}
      />

      <div className="flex lg:hidden border-b border-[#141414]/15 bg-[#F3F1EA] px-4 py-2 gap-2">
        {(
          [
            { id: 'canvas', label: 'Canvas' },
            { id: 'properties', label: 'Properties' },
            { id: 'fields', label: `Fields (${editor.fields.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobilePanel(tab.id)}
            className={`flex-1 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors ${
              mobilePanel === tab.id
                ? 'border-[#141414] bg-[#F6C33E] text-[#141414]'
                : 'border-[#141414]/25 bg-white text-[#52525B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {overflowWarnings.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-[#D97706]/40 bg-[#FFFBEB] px-4 py-2 text-xs text-[#B45309] sm:px-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Long text detected for{' '}
              <strong>{overflowWarnings.map((w) => w.fieldLabel).join(', ')}</strong> on this participant.{' '}
              {editor.fields.some((f) =>
                overflowWarnings.some((w) => w.fieldId === f.id && f.autoFit)
              )
                ? 'Auto-fit is shrinking the font to stay inside the box.'
                : 'Enable Auto-fit or widen the field box so text does not clip.'}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div
          className={`${
            mobilePanel === 'canvas' ? 'flex' : 'hidden'
          } lg:flex flex-1 flex-col overflow-hidden`}
        >
          <Canvas
            template={template}
            fields={editor.fields}
            customFonts={customFonts}
            selectedFieldId={editor.selectedFieldId}
            activeParticipant={activeParticipant}
            mapping={
              dataset?.mapping ?? {
                name: '',
                email: '',
                role: '',
                date: '',
                signature: '',
              }
            }
            zoom={editor.zoom}
            showRulers={showRulers}
            onSelectField={editor.setSelectedFieldId}
            onUpdateField={editor.updateField}
            onSnapshotHistory={editor.snapshotHistory}
            onOverflowChange={setOverflowWarnings}
            onFitZoomChange={handleFitZoomChange}
            onZoomChange={editor.setZoom}
          />
        </div>

        <div className={`${mobilePanel === 'properties' ? 'block' : 'hidden'} lg:block`}>
          <FieldProperties
            field={editor.selectedField}
            templateAspectRatio={template.widthPx / template.heightPx}
            customFonts={customFonts}
            onUploadCustomFont={addCustomFont}
            onRemoveCustomFont={removeCustomFont}
            onUpdate={editor.updateField}
            onDuplicate={editor.duplicateField}
            onDelete={editor.deleteField}
          />
        </div>

        <div className={`${mobilePanel === 'fields' ? 'block' : 'hidden'} lg:block`}>
          <FieldToolbar
            dataset={dataset}
            fields={editor.fields}
            selectedFieldId={editor.selectedFieldId}
            onSelectField={(id) => {
              editor.setSelectedFieldId(id);
              setMobilePanel('properties');
            }}
            onAddField={(partial) => {
              editor.addField(partial);
              setMobilePanel('canvas');
            }}
            onDuplicateField={editor.duplicateField}
            onDeleteField={editor.deleteField}
          />
        </div>
      </div>
    </div>
  );
}
