import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  clearWorkspaceState,
  loadWorkspaceState,
  saveWorkspaceState,
} from '../services/storageService';
import { PageRoute, WorkflowStep } from '../types/certificate';
import { CustomFontAsset } from '../types/editor';
import { loadCustomFontFile, registerAllCustomFonts } from '../utils/fontUtils';
import { buildSampleWorkspacePayload } from '../utils/sampleData';
import { useCertificate } from './useCertificate';
import { useEditor } from './useEditor';
import { useParticipants } from './useParticipants';

const ROUTE_TO_PATH: Record<Exclude<PageRoute, 'not-found'>, string> = {
  home: '/',
  create: '/create',
  about: '/about',
  guide: '/guide',
  blog: '/blog',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'CertBee — One design. Every certificate.',
  create: 'Batch Workspace — CertBee',
  about: 'About — CertBee',
  guide: 'Preparation Guide — CertBee',
  blog: 'Journal — CertBee',
  contact: 'Contact — CertBee',
  privacy: 'Privacy Policy — CertBee',
  terms: 'Terms of Use — CertBee',
  'not-found': 'Page Not Found — CertBee',
};

export function getRoutePath(route: Exclude<PageRoute, 'not-found'>, hash?: string): string {
  const base = ROUTE_TO_PATH[route] ?? '/';
  return hash ? `${base}#${hash.replace(/^#/, '')}` : base;
}

export function parsePathToRoute(pathname: string): PageRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(ROUTE_TO_PATH) as Array<[Exclude<PageRoute, 'not-found'>, string]>).find(
    ([, path]) => path === normalized
  );
  return match ? match[0] : 'not-found';
}

interface BatchWorkspaceContextValue {
  route: PageRoute;
  navigate: (route: Exclude<PageRoute, 'not-found'>, hash?: string) => void;
  step: WorkflowStep;
  setStep: (step: WorkflowStep) => void;
  certificate: ReturnType<typeof useCertificate>;
  participants: ReturnType<typeof useParticipants>;
  editor: ReturnType<typeof useEditor>;
  customFonts: CustomFontAsset[];
  addCustomFont: (file: File) => Promise<CustomFontAsset>;
  removeCustomFont: (fontId: string) => void;
  isHydrated: boolean;
  startEmptyBatch: () => void;
  loadSampleBatch: () => void;
  resetAllWorkspace: () => Promise<void>;
}

const BatchWorkspaceContext = createContext<BatchWorkspaceContextValue | null>(null);

export function BatchWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<PageRoute>(() => {
    if (typeof window === 'undefined') return 'home';
    return parsePathToRoute(window.location.pathname);
  });
  const [step, setStep] = useState<WorkflowStep>(1);
  const [customFonts, setCustomFonts] = useState<CustomFontAsset[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const certificate = useCertificate(null);
  const participants = useParticipants(null);
  const editor = useEditor([]);

  // Sync document.title with active route
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = ROUTE_TITLES[route] ?? ROUTE_TITLES.home;
    }
  }, [route]);

  // Listen to browser Back/Forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = parsePathToRoute(window.location.pathname);
      setRoute(nextRoute);
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      } else {
        window.scrollTo({ top: 0 });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to initial hash fragment if landed via deep link like /#workflow
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, []);

  // Hydrate persisted batch from IndexedDB on boot
  useEffect(() => {
    let active = true;
    loadWorkspaceState().then(async (saved) => {
      if (!active) return;
      if (saved) {
        if (saved.customFonts?.length) {
          await registerAllCustomFonts(saved.customFonts);
          if (!active) return;
          setCustomFonts(saved.customFonts);
        }
        if (saved.template) certificate.setTemplate(saved.template);
        if (saved.dataset && saved.dataset.rows.length > 0) {
          participants.setDataset(saved.dataset);
        }
        if (saved.fields?.length) editor.setFields(saved.fields);
        if (saved.step) setStep(saved.step);
      }
      setIsHydrated(true);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist changes back to IndexedDB (debounced)
  useEffect(() => {
    if (!isHydrated) return;
    const timer = window.setTimeout(() => {
      saveWorkspaceState({
        step,
        template: certificate.template,
        dataset: participants.dataset,
        fields: editor.fields,
        customFonts,
        updatedAt: Date.now(),
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isHydrated, step, certificate.template, participants.dataset, editor.fields, customFonts]);

  const navigate = useCallback((nextRoute: Exclude<PageRoute, 'not-found'>, hash?: string) => {
    const targetUrl = getRoutePath(nextRoute, hash);
    const currentFull = `${window.location.pathname}${window.location.hash}`;
    if (currentFull !== targetUrl) {
      window.history.pushState({ route: nextRoute }, '', targetUrl);
    }
    setRoute(nextRoute);

    if (hash) {
      window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const startEmptyBatch = useCallback(() => {
    navigate('create');
    setStep(1);
  }, [navigate]);

  const loadSampleBatch = useCallback(() => {
    const sample = buildSampleWorkspacePayload();
    certificate.setTemplate(sample.template);
    participants.setDataset(sample.dataset);
    editor.setFields(sample.fields);
    setStep(3);
    navigate('create');
  }, [certificate, editor, navigate, participants]);

  const addCustomFont = useCallback(async (file: File): Promise<CustomFontAsset> => {
    const asset = await loadCustomFontFile(file);
    setCustomFonts((prev) => [...prev, asset]);
    return asset;
  }, []);

  const removeCustomFont = useCallback(
    (fontId: string) => {
      setCustomFonts((prev) => prev.filter((f) => f.id !== fontId));
      editor.fields.forEach((f) => {
        if (f.customFontId === fontId) {
          editor.updateField(f.id, { customFontId: undefined });
        }
      });
    },
    [editor]
  );

  const resetAllWorkspace = useCallback(async () => {
    certificate.clearTemplate();
    participants.clearDataset();
    editor.setFields([]);
    setCustomFonts([]);
    setStep(1);
    await clearWorkspaceState();
  }, [certificate, editor, participants]);

  return (
    <BatchWorkspaceContext.Provider
      value={{
        route,
        navigate,
        step,
        setStep,
        certificate,
        participants,
        editor,
        customFonts,
        addCustomFont,
        removeCustomFont,
        isHydrated,
        startEmptyBatch,
        loadSampleBatch,
        resetAllWorkspace,
      }}
    >
      {children}
    </BatchWorkspaceContext.Provider>
  );
}

export function useBatchWorkspace(): BatchWorkspaceContextValue {
  const ctx = useContext(BatchWorkspaceContext);
  if (!ctx) {
    throw new Error('useBatchWorkspace must be used inside BatchWorkspaceProvider');
  }
  return ctx;
}
