import { useCallback, useState } from 'react';
import { DynamicField } from '../types/editor';
import { createId } from '../utils/fileUtils';

const MAX_HISTORY = 40;

export function useEditor(initialFields: DynamicField[] = []) {
  const [fields, setFields] = useState<DynamicField[]>(initialFields);
  const [past, setPast] = useState<DynamicField[][]>([]);
  const [future, setFuture] = useState<DynamicField[][]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    initialFields[0]?.id ?? null
  );
  const [zoom, setZoom] = useState<number>(1);

  const commitFields = useCallback(
    (updater: (current: DynamicField[]) => DynamicField[], recordHistory = true) => {
      setFields((current) => {
        const next = updater(current);
        if (recordHistory) {
          setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), current]);
          setFuture([]);
        }
        return next;
      });
    },
    []
  );

  const replaceFieldsFresh = useCallback((nextFields: DynamicField[]) => {
    setFields(nextFields);
    setPast([]);
    setFuture([]);
    setSelectedFieldId(nextFields[0]?.id ?? null);
  }, []);

  const addField = useCallback(
    (partial: Omit<DynamicField, 'id'>) => {
      const id = createId('fld');
      const created: DynamicField = { ...partial, id };
      commitFields((curr) => [...curr, created]);
      setSelectedFieldId(id);
      return created;
    },
    [commitFields]
  );

  const updateField = useCallback(
    (id: string, patch: Partial<DynamicField>, recordHistory = true) => {
      commitFields(
        (curr) => curr.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        recordHistory
      );
    },
    [commitFields]
  );

  const snapshotHistory = useCallback(() => {
    setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), fields]);
    setFuture([]);
  }, [fields]);

  const duplicateField = useCallback(
    (id: string) => {
      const source = fields.find((f) => f.id === id);
      if (!source) return;
      const newId = createId('fld');
      const copy: DynamicField = {
        ...source,
        id: newId,
        label: `${source.label} Copy`,
        xPct: Math.min(source.xPct + 3, 100 - source.widthPct),
        yPct: Math.min(source.yPct + 4, 92),
      };
      commitFields((curr) => [...curr, copy]);
      setSelectedFieldId(newId);
    },
    [commitFields, fields]
  );

  const deleteField = useCallback(
    (id: string) => {
      commitFields((curr) => curr.filter((f) => f.id !== id));
      setSelectedFieldId((prev) => (prev === id ? null : prev));
    },
    [commitFields]
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setFuture((f) => [fields, ...f]);
      setFields(previous);
      return p.slice(0, -1);
    });
  }, [fields]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, fields]);
      setFields(next);
      return f.slice(1);
    });
  }, [fields]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  return {
    fields,
    setFields: replaceFieldsFresh,
    selectedFieldId,
    setSelectedFieldId,
    selectedField,
    zoom,
    setZoom,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    addField,
    updateField,
    snapshotHistory,
    duplicateField,
    deleteField,
    undo,
    redo,
  };
}
