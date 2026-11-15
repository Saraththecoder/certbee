export const SITE_CONFIG = {
  name: 'CertBee',
  tagline: 'One design. Every certificate.',
  defaultTitle: 'Free Bulk Certificate Generator Online | CertBee',
  defaultDescription:
    'Create personalized certificates in bulk for free. Import participants from Excel, CSV or Google Sheets, customize your template, and download PDFs instantly. No server uploads.',
  githubUrl: 'https://github.com/Saraththecoder/certbee',
  contactEmail: 'sarathkumar86518@gmail.com',
  ogImagePath: '/images/certbee-og-preview.png',
  defaultProductionOrigin: 'https://certbee.vercel.app',
  contentLastModified: '2026-11-15',
} as const;

export function normalizeOrigin(raw?: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return '';
  return trimmed;
}

export function getSiteOrigin(): string {
  const configured = normalizeOrigin(
    typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SITE_URL : undefined
  );
  if (configured) return configured;

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeOrigin(window.location.origin) || SITE_CONFIG.defaultProductionOrigin;
  }

  return SITE_CONFIG.defaultProductionOrigin;
}

export function buildCanonicalUrl(path: string, origin = getSiteOrigin()): string {
  const cleanPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `${origin}${cleanPath}`;
}
