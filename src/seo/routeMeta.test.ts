import { describe, expect, it } from 'vitest';
import { BLOG_POSTS } from '../data/blogPosts';
import { parseLocationToRoute } from '../hooks/useBatchWorkspace';
import { getAllIndexableRouteMetas, resolveRouteSeo } from './routeMeta';

describe('SEO routeMeta registry', () => {
  it('assigns unique titles, descriptions, and canonical paths across all indexable routes', () => {
    const metas = getAllIndexableRouteMetas('https://certbee.example');
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const paths = new Set<string>();

    expect(metas.length).toBeGreaterThanOrEqual(20);

    for (const meta of metas) {
      expect(meta.indexable).toBe(true);
      expect(meta.robots).toBe('index, follow');
      expect(meta.title.trim().length).toBeGreaterThanOrEqual(20);
      expect(meta.description.trim().length).toBeGreaterThanOrEqual(80);
      expect(meta.jsonLd.length).toBeGreaterThan(0);

      expect(titles.has(meta.title)).toBe(false);
      expect(descriptions.has(meta.description)).toBe(false);
      expect(paths.has(meta.path)).toBe(false);

      titles.add(meta.title);
      descriptions.add(meta.description);
      paths.add(meta.path);
    }
  });

  it('marks /create workspace and 404 routes as non-indexable with noindex directives', () => {
    const createMeta = resolveRouteSeo('create', { origin: 'https://certbee.example' });
    const notFoundMeta = resolveRouteSeo('not-found', { origin: 'https://certbee.example' });

    expect(createMeta.indexable).toBe(false);
    expect(createMeta.robots).toBe('noindex, nofollow');

    expect(notFoundMeta.indexable).toBe(false);
    expect(notFoundMeta.robots).toBe('noindex, nofollow');
  });

  it('resolves all blog post URLs cleanly via parseLocationToRoute', () => {
    for (const post of BLOG_POSTS) {
      const parsed = parseLocationToRoute(`/blog/${post.slug}`);
      expect(parsed.route).toBe('blog-post');
      expect(parsed.blogSlug).toBe(post.slug);

      const meta = resolveRouteSeo(parsed.route, {
        slug: parsed.blogSlug,
        origin: 'https://certbee.example',
      });
      expect(meta.ogType).toBe('article');
      expect(meta.path).toBe(`/blog/${post.slug}`);
    }

    expect(parseLocationToRoute('/nonexistent-route').route).toBe('not-found');
    expect(parseLocationToRoute('/blog/unknown-post').route).toBe('not-found');
  });

  it('keeps homepage exact requested title and H1-aligned SoftwareApplication schema without fake ratings', () => {
    const homeMeta = resolveRouteSeo('home', { origin: 'https://certbee.example' });
    expect(homeMeta.title).toBe('Free Bulk Certificate Generator Online | CertBee');
    expect(homeMeta.description).toBe(
      'Create personalized certificates in bulk for free. Import participants from Excel, CSV or Google Sheets, customize your template, and download PDFs instantly. No server uploads.'
    );
    const serialized = JSON.stringify(homeMeta.jsonLd);
    expect(serialized).toContain('SoftwareApplication');
    expect(serialized).toContain('FAQPage');
    expect(serialized).not.toContain('aggregateRating');
    expect(serialized).not.toContain('reviewCount');
  });
});
