import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getBlogPostBySlug } from '../data/blogPosts';
import { STATIC_ROUTE_TO_PATH } from '../seo/routeMeta';
import {
  clearWorkspaceState,
  loadWorkspaceState,
  saveWorkspaceState,
} from '../services/storageService';
import { PageRoute, WorkflowStep } from '../types/certificate';
import { CustomFontAsset } from '../types/editor';
import { trackEvent } from '../utils/analytics';
import { loadCustomFontFile, registerAllCustomFonts } from '../utils/fontUtils';
import { buildSampleWorkspacePayload } from '../utils/sampleData';
import { useCertificate } from './useCertificate';
import { useEditor } from './useEditor';
import { useParticipants } from './useParticipants';
import { useSeo } from './useSeo';

export type NavTarget = Exclude<PageRoute, 'not-found' | 'blog-post'>;

export function getRoutePath(route: NavTarget, hash?: string): string {
  const base = STATIC_ROUTE_TO_PATH[route] ?? '/';
  return hash ? `${base}#${hash.replace(/^#/, '')}` : base;
}

export function getBlogPostPath(slug: string): string {
  return `/blog/${slug}`;
}

export function parseLocationToRoute(pathname: string): {
  route: PageRoute;
  blogSlug: string | null;
} {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized.startsWith('/blog/')) {
    const slug = normalized.slice('/blog/'.length);
    if (slug && getBlogPostBySlug(slug)) {
      return { route: 'blog-post', blogSlug: slug };
    }
    return { route: 'not-found', blogSlug: null };
  }

  const match = (
    Object.entries(STATIC_ROUTE_TO_PATH) as Array<[NavTarget, string]>
  ).find(([, path]) => path === normalized);

  return match ? { route: match[0], blogSlug: null } : { route: 'not-found', blogSlug: null };
}

interface BatchWorkspaceContextValue {
  route: PageRoute;
  blogSlug: string | null;
  navigate: (route: NavTarget, hash?: string) => void;
  navigateBlogPost: (slug: string) => void;
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
  const [locationState, setLocationState] = useState<{
    route: PageRoute;
    blogSlug: string | null;
  }>(() => {
    if (typeof window === 'undefined') return { route: 'home', blogSlug: null };
    return parseLocationToRoute(window.location.pathname);
  });

  const { route, blogSlug } = locationState;
  const [step, setStep] = useState<WorkflowStep>(1);
  const [customFonts, setCustomFonts] = useState<CustomFontAsset[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const certificate = useCertificate(null);
  const participants = useParticipants(null);
  const editor = useEditor([]);

  useSeo(route, blogSlug);

  // Listen to browser Back/Forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      const next = parseLocationToRoute(window.location.pathname);
      setLocationState(next);
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

  const navigate = useCallback((nextRoute: NavTarget, hash?: string) => {
    const targetUrl = getRoutePath(nextRoute, hash);
    const currentFull = `${window.location.pathname}${window.location.hash}`;
    if (currentFull !== targetUrl) {
      window.history.pushState({ route: nextRoute }, '', targetUrl);
    }
    setLocationState({ route: nextRoute, blogSlug: null });

    if (hash) {
      window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateBlogPost = useCallback((slug: string) => {
    const targetUrl = getBlogPostPath(slug);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ route: 'blog-post', slug }, '', targetUrl);
    }
    setLocationState({ route: 'blog-post', blogSlug: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startEmptyBatch = useCallback(() => {
    trackEvent('generator_started', { source: 'empty' });
    navigate('create');
    setStep(1);
  }, [navigate]);

  const loadSampleBatch = useCallback(() => {
    trackEvent('generator_started', { source: 'sample' });
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
        blogSlug,
        navigate,
        navigateBlogPost,
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
