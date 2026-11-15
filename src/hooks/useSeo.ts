import { useEffect } from 'react';
import { buildCanonicalUrl, getSiteOrigin, SITE_CONFIG } from '../config/site';
import { resolveRouteSeo } from '../seo/routeMeta';
import { PageRoute } from '../types/certificate';
import { trackPageView } from '../utils/analytics';

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (el.getAttribute('content') !== content) {
    el.setAttribute('content', content);
  }
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href);
  }
}

function upsertStructuredData(schemas: Record<string, unknown>[]): void {
  const existing = document.head.querySelector<HTMLScriptElement>(
    'script#certbee-structured-data[type="application/ld+json"]'
  );
  if (schemas.length === 0) {
    existing?.remove();
    return;
  }

  const payload = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  if (existing) {
    if (existing.textContent !== payload) {
      existing.textContent = payload;
    }
  } else {
    const script = document.createElement('script');
    script.id = 'certbee-structured-data';
    script.type = 'application/ld+json';
    script.textContent = payload;
    document.head.appendChild(script);
  }
}

export function useSeo(route: PageRoute, blogSlug: string | null): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const origin = getSiteOrigin();
    const meta = resolveRouteSeo(route, { slug: blogSlug, origin });
    const canonical =
      route === 'not-found'
        ? buildCanonicalUrl(window.location.pathname || '/404', origin)
        : buildCanonicalUrl(meta.path, origin);

    document.title = meta.title;

    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', meta.robots);

    // OpenGraph
    upsertMeta('property', 'og:type', meta.ogType);
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:site_name', SITE_CONFIG.name);
    upsertMeta('property', 'og:image', meta.ogImage);
    upsertMeta('property', 'og:image:alt', 'CertBee certificate editor and bulk PDF workspace preview');

    // Twitter / X
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', meta.ogImage);

    // Canonical
    if (meta.indexable) {
      upsertCanonicalLink(canonical);
    } else {
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
    }

    // Structured Data
    upsertStructuredData(meta.jsonLd);

    // Optional privacy-safe page view analytics (tracks path & title only, no PII)
    if (meta.indexable || route === 'create') {
      trackPageView(meta.path, meta.title);
    }
  }, [route, blogSlug]);
}
