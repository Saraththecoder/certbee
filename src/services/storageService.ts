import { TemplateAsset, WorkflowStep } from '../types/certificate';
import { CustomFontAsset, DynamicField } from '../types/editor';
import { ParticipantDataset } from '../types/participant';

export interface PersistedWorkspaceState {
  step: WorkflowStep;
  template: TemplateAsset | null;
  dataset: ParticipantDataset | null;
  fields: DynamicField[];
  customFonts?: CustomFontAsset[];
  updatedAt: number;
}

const DB_NAME = 'certly_workspace_db';
const DB_VERSION = 1;
const STORE_NAME = 'workspace';
const STATE_KEY = 'active_batch';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
  });
}

export async function saveWorkspaceState(state: PersistedWorkspaceState): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(state, STATE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'));
    });
    db.close();
  } catch {
    // Graceful no-op in restricted browser contexts
  }
}

export async function loadWorkspaceState(): Promise<PersistedWorkspaceState | null> {
  try {
    const db = await openDb();
    const result = await new Promise<PersistedWorkspaceState | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STATE_KEY);
      req.onsuccess = () => resolve((req.result as PersistedWorkspaceState) ?? null);
      req.onerror = () => reject(req.error ?? new Error('IndexedDB read failed'));
    });
    db.close();
    return result;
  } catch {
    return null;
  }
}

export async function clearWorkspaceState(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(STATE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB clear failed'));
    });
    db.close();
  } catch {
    // Graceful no-op
  }
}
