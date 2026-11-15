import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import { buildCanonicalUrl, normalizeOrigin, SITE_CONFIG } from './src/config/site';
import { getAllIndexableRouteMetas, ResolvedRouteSeo, resolveRouteSeo } from './src/seo/routeMeta';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function injectRouteIntoHtml(baseHtml: string, meta: ResolvedRouteSeo, origin: string): string {
  const canonical = buildCanonicalUrl(meta.path, origin);
  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDesc = escapeHtmlAttr(meta.description);
  const safeUrl = escapeHtmlAttr(canonical);
  const safeImage = escapeHtmlAttr(meta.ogImage);
  const safeRobots = escapeHtmlAttr(meta.robots);
  const jsonLdStr =
    meta.jsonLd.length === 0
      ? ''
      : JSON.stringify(meta.jsonLd.length === 1 ? meta.jsonLd[0] : meta.jsonLd);

  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/i,
    `<meta name="description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"[\s\S]*?\/>/i,
    `<meta name="robots" content="${safeRobots}" />`
  );

  if (meta.indexable) {
    if (/<link\s+rel="canonical"[\s\S]*?\/>/i.test(html)) {
      html = html.replace(
        /<link\s+rel="canonical"[\s\S]*?\/>/i,
        `<link rel="canonical" href="${safeUrl}" />`
      );
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${safeUrl}" />\n  </head>`);
    }
  } else {
    html = html.replace(/<link\s+rel="canonical"[\s\S]*?\/>\s*/i, '');
  }

  html = html.replace(
    /<meta\s+property="og:type"[\s\S]*?\/>/i,
    `<meta property="og:type" content="${escapeHtmlAttr(meta.ogType)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    `<meta property="og:url" content="${safeUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"[\s\S]*?\/>/i,
    `<meta property="og:image" content="${safeImage}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"[\s\S]*?\/>/i,
    `<meta name="twitter:image" content="${safeImage}" />`
  );

  if (jsonLdStr) {
    html = html.replace(
      /<script id="certbee-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="certbee-structured-data" type="application/ld+json">${jsonLdStr}</script>`
    );
  } else {
    html = html.replace(
      /<script id="certbee-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>\s*/i,
      ''
    );
  }

  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    `<noscript><main style="max-width:720px;margin:48px auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6;"><h1>${escapeHtmlAttr(
      meta.noscriptTitle
    )}</h1><p>${escapeHtmlAttr(meta.noscriptSummary)}</p></main></noscript>`
  );

  return html;
}

function certbeeSeoPlugin(
  origin: string,
  verification: { gsc?: string; bing?: string }
): Plugin {
  return {
    name: 'certbee-seo-static-generator',
    transformIndexHtml(html) {
      let next = html.replace(
        new RegExp(SITE_CONFIG.defaultProductionOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        origin
      );
      if (verification.gsc && !/<meta\s+name="google-site-verification"/i.test(next)) {
        next = next.replace(
          '</head>',
          `    <meta name="google-site-verification" content="${escapeHtmlAttr(
            verification.gsc
          )}" />\n  </head>`
        );
      }
      if (verification.bing) {
        next = next.replace(
          '</head>',
          `    <meta name="msvalidate.01" content="${escapeHtmlAttr(
            verification.bing
          )}" />\n  </head>`
        );
      }
      return next;
    },
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const baseHtml = fs.readFileSync(indexPath, 'utf-8');
      const indexableMetas = getAllIndexableRouteMetas(origin);

      // Update dist/index.html with canonical Home SEO + full structured data (Organization, WebSite, SoftwareApplication, FAQPage)
      const homeMeta = indexableMetas.find((m) => m.path === '/') ?? resolveRouteSeo('home', { origin });
      fs.writeFileSync(indexPath, injectRouteIntoHtml(baseHtml, homeMeta, origin), 'utf-8');

      // Generate pre-rendered metadata HTML shells for all public routes
      for (const meta of indexableMetas) {
        if (meta.path === '/') continue;
        const routeDir = path.join(distDir, meta.path.replace(/^\/+/, ''));
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(
          path.join(routeDir, 'index.html'),
          injectRouteIntoHtml(baseHtml, meta, origin),
          'utf-8'
        );
      }

      // Generate noindex shells for /create and 404.html
      const createMeta = resolveRouteSeo('create', { origin });
      const createDir = path.join(distDir, 'create');
      fs.mkdirSync(createDir, { recursive: true });
      fs.writeFileSync(
        path.join(createDir, 'index.html'),
        injectRouteIntoHtml(baseHtml, createMeta, origin),
        'utf-8'
      );

      const notFoundMeta = resolveRouteSeo('not-found', { origin });
      fs.writeFileSync(
        path.join(distDir, '404.html'),
        injectRouteIntoHtml(baseHtml, notFoundMeta, origin),
        'utf-8'
      );

      // Emit fresh dist/sitemap.xml & dist/robots.txt matching the build origin
      const sitemapLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...indexableMetas.map((m) => {
          const loc = escapeXml(buildCanonicalUrl(m.path, origin));
          return [
            '  <url>',
            `    <loc>${loc}</loc>`,
            `    <lastmod>${m.lastmod || SITE_CONFIG.contentLastModified}</lastmod>`,
            `    <changefreq>${m.changefreq || 'monthly'}</changefreq>`,
            `    <priority>${m.priority || '0.7'}</priority>`,
            '  </url>',
          ].join('\n');
        }),
        '</urlset>',
      ];
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), `${sitemapLines.join('\n')}\n`, 'utf-8');

      const robotsTxt = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /create',
        'Disallow: /assets/aistudio/',
        'Disallow: /404',
        '',
        `Sitemap: ${origin}/sitemap.xml`,
        '',
      ].join('\n');
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const origin =
    normalizeOrigin(env.VITE_SITE_URL) || SITE_CONFIG.defaultProductionOrigin;

  return {
    plugins: [
      react(),
      tailwindcss(),
      certbeeSeoPlugin(origin, {
        gsc: env.VITE_GSC_VERIFICATION?.trim() || undefined,
        bing: env.VITE_BING_VERIFICATION?.trim() || undefined,
      }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/pdf-lib') ||
              id.includes('node_modules/@pdf-lib') ||
              id.includes('node_modules/pdfjs-dist')
            ) {
              return 'pdf-engine';
            }
            if (id.includes('node_modules/xlsx') || id.includes('node_modules/jszip')) {
              return 'excel-zip-engine';
            }
            if (id.includes('node_modules/papaparse')) {
              return 'csv-parser';
            }
            if (id.includes('node_modules/gsap')) {
              return 'gsap';
            }
            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
