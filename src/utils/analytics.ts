export type CertBeeAnalyticsEvent =
  | 'generator_started'
  | 'template_uploaded'
  | 'participants_imported'
  | 'design_completed'
  | 'batch_generated'
  | 'zip_downloaded';

export interface SafeAnalyticsParams {
  source?: 'csv' | 'excel' | 'paste' | 'sheets' | 'sample' | 'empty';
  format?: 'png' | 'jpg' | 'svg' | 'pdf';
  batch_size_bucket?: '1-10' | '11-50' | '51-150' | '151-300' | '300+';
  field_count?: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __CERTBEE_ANALYTICS_OPT_OUT__?: boolean;
  }
}

let initialized = false;

function getMeasurementId(): string {
  if (typeof import.meta === 'undefined') return '';
  const raw = import.meta.env?.VITE_GA_MEASUREMENT_ID;
  return typeof raw === 'string' && /^G-[A-Z0-9]+$/i.test(raw.trim()) ? raw.trim() : '';
}

function isAnalyticsPermitted(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (window.__CERTBEE_ANALYTICS_OPT_OUT__) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl === true || navigator.doNotTrack === '1') return false;
  const requireConsent =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANALYTICS_REQUIRE_CONSENT === 'true';
  if (requireConsent) {
    try {
      return window.localStorage.getItem('certbee_analytics_consent') === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

export function initAnalytics(): void {
  if (initialized) return;
  const id = getMeasurementId();
  if (!id || !isAnalyticsPermitted()) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
  });

  const existing = document.querySelector(`script[data-certbee-ga="${id}"]`);
  if (!existing) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.setAttribute('data-certbee-ga', id);
    document.head.appendChild(script);
  }
}

export function getBatchSizeBucket(count: number): SafeAnalyticsParams['batch_size_bucket'] {
  if (count <= 10) return '1-10';
  if (count <= 50) return '11-50';
  if (count <= 150) return '51-150';
  if (count <= 300) return '151-300';
  return '300+';
}

export function trackPageView(path: string, title: string): void {
  if (!getMeasurementId() || !isAnalyticsPermitted()) return;
  initAnalytics();
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

/**
 * Emits strictly aggregate, non-PII product funnel events.
 * Participant names, emails, URLs, and uploaded file names are never sent.
 */
export function trackEvent(
  eventName: CertBeeAnalyticsEvent,
  params: SafeAnalyticsParams = {}
): void {
  if (!getMeasurementId() || !isAnalyticsPermitted()) return;
  initAnalytics();
  if (typeof window.gtag !== 'function') return;

  const safePayload: Record<string, string | number> = {};
  if (params.source) safePayload.source = params.source;
  if (params.format) safePayload.format = params.format;
  if (params.batch_size_bucket) safePayload.batch_size_bucket = params.batch_size_bucket;
  if (typeof params.field_count === 'number' && Number.isFinite(params.field_count)) {
    safePayload.field_count = Math.max(0, Math.round(params.field_count));
  }

  window.gtag('event', eventName, safePayload);
}
