import { buildCanonicalUrl, SITE_CONFIG } from '../config/site';
import { BLOG_POSTS, getBlogPostBySlug } from '../data/blogPosts';
import { LANDING_PAGES, LandingRouteKey } from '../data/landingPages';
import { PageRoute } from '../types/certificate';
import { HOME_FAQ_ITEMS } from './faqData';

export interface ResolvedRouteSeo {
  path: string;
  title: string;
  description: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType: 'website' | 'article';
  ogImage: string;
  indexable: boolean;
  priority?: string;
  changefreq?: 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
  noscriptTitle: string;
  noscriptSummary: string;
  jsonLd: Record<string, unknown>[];
}

export const STATIC_ROUTE_TO_PATH: Record<
  Exclude<PageRoute, 'not-found' | 'blog-post'>,
  string
> = {
  home: '/',
  create: '/create',
  features: '/features',
  'how-it-works': '/how-it-works',
  'bulk-certificate-generator': '/bulk-certificate-generator',
  'certificate-generator-from-excel': '/certificate-generator-from-excel',
  'certificate-generator-from-google-sheets': '/certificate-generator-from-google-sheets',
  'workshop-certificate-generator': '/workshop-certificate-generator',
  'hackathon-certificate-generator': '/hackathon-certificate-generator',
  'student-certificate-generator': '/student-certificate-generator',
  about: '/about',
  guide: '/guide',
  blog: '/blog',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

function makeOrganizationEntity(origin: string): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: SITE_CONFIG.name,
    url: `${origin}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/favicon.svg`,
    },
    sameAs: [SITE_CONFIG.githubUrl],
  };
}

function makeWebSiteEntity(origin: string): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: SITE_CONFIG.name,
    url: `${origin}/`,
    description: SITE_CONFIG.defaultDescription,
    publisher: { '@id': `${origin}/#organization` },
  };
}

function makeSoftwareApplicationEntity(origin: string): Record<string, unknown> {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${origin}/#software`,
    name: SITE_CONFIG.name,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript and IndexedDB support in a modern web browser.',
    url: `${origin}/`,
    description: SITE_CONFIG.defaultDescription,
    featureList: [
      'Upload PNG, JPG, SVG, and vector PDF certificate templates',
      'Import participants from CSV, Excel (.xlsx/.xls), pasted names, or public Google Sheets',
      'Visual coordinate placement for dynamic fields, custom TTF/OTF fonts, and signature images',
      'Auto-fit sizing and native shaping for Hindi (Devanagari), Telugu, and multilingual scripts',
      'Local browser PDF generation and bundled ZIP export with zero server uploads',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': `${origin}/#organization` },
  };
}

function makeBreadcrumbList(
  origin: string,
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path, origin),
    })),
  };
}

function makeFaqEntity(items: Array<{ q: string; a: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

function isLandingRoute(route: PageRoute): route is LandingRouteKey {
  return route in LANDING_PAGES;
}

export function resolveRouteSeo(
  route: PageRoute,
  options: { slug?: string | null; origin?: string } = {}
): ResolvedRouteSeo {
  const origin = options.origin || SITE_CONFIG.defaultProductionOrigin;
  const ogImage = `${origin}${SITE_CONFIG.ogImagePath}`;

  if (route === 'blog-post' && options.slug) {
    const post = getBlogPostBySlug(options.slug);
    if (post) {
      const path = `/blog/${post.slug}`;
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: post.seoTitle,
        description: post.metaDescription,
        robots: 'index, follow',
        ogType: 'article',
        ogImage,
        indexable: true,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: post.modifiedDate,
        noscriptTitle: post.title,
        noscriptSummary: post.summary,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@graph': [
              makeOrganizationEntity(origin),
              {
                '@type': 'Article',
                headline: post.title,
                description: post.metaDescription,
                datePublished: post.publishedDate,
                dateModified: post.modifiedDate,
                image: [`${origin}${post.screenshot}`],
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': canonical,
                },
                author: {
                  '@type': 'Organization',
                  name: SITE_CONFIG.name,
                  url: `${origin}/about`,
                },
                publisher: { '@id': `${origin}/#organization` },
              },
            ],
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
        ],
      };
    }
  }

  if (isLandingRoute(route)) {
    const data = LANDING_PAGES[route];
    const path = STATIC_ROUTE_TO_PATH[route];
    const canonical = buildCanonicalUrl(path, origin);
    const schemas: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@graph': [
          makeOrganizationEntity(origin),
          makeWebSiteEntity(origin),
          {
            '@type': 'WebPage',
            '@id': canonical,
            url: canonical,
            name: data.seoTitle,
            description: data.metaDescription,
            isPartOf: { '@id': `${origin}/#website` },
            about: { '@id': `${origin}/#software` },
          },
          makeSoftwareApplicationEntity(origin),
        ],
      },
      makeBreadcrumbList(origin, [
        { name: 'Home', path: '/' },
        { name: data.badge, path },
      ]),
    ];

    if (data.faqs.length > 0) {
      schemas.push(makeFaqEntity(data.faqs));
    }

    return {
      path,
      title: data.seoTitle,
      description: data.metaDescription,
      robots: 'index, follow',
      ogType: 'website',
      ogImage,
      indexable: true,
      priority: route === 'features' || route === 'how-it-works' ? '0.9' : '0.8',
      changefreq: 'monthly',
      lastmod: SITE_CONFIG.contentLastModified,
      noscriptTitle: data.h1,
      noscriptSummary: data.intro,
      jsonLd: schemas,
    };
  }

  switch (route) {
    case 'home': {
      const canonical = buildCanonicalUrl('/', origin);
      return {
        path: '/',
        title: SITE_CONFIG.defaultTitle,
        description: SITE_CONFIG.defaultDescription,
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '1.0',
        changefreq: 'weekly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'One design. Every certificate.',
        noscriptSummary:
          'Upload your certificate template, import a CSV, Excel, or public Google Sheet, place dynamic fields visually, and export personalized PDFs bundled as a ZIP locally in your browser.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@graph': [
              makeOrganizationEntity(origin),
              makeWebSiteEntity(origin),
              makeSoftwareApplicationEntity(origin),
              {
                '@type': 'WebPage',
                '@id': canonical,
                url: canonical,
                name: SITE_CONFIG.defaultTitle,
                description: SITE_CONFIG.defaultDescription,
                isPartOf: { '@id': `${origin}/#website` },
                mainEntity: { '@id': `${origin}/#software` },
              },
            ],
          },
          makeFaqEntity(HOME_FAQ_ITEMS),
        ],
      };
    }

    case 'create': {
      return {
        path: '/create',
        title: 'Batch Certificate Workspace | CertBee',
        description:
          'Interactive browser workspace to upload templates, import participants, position fields, and export personalized certificate PDFs locally.',
        robots: 'noindex, nofollow',
        ogType: 'website',
        ogImage,
        indexable: false,
        noscriptTitle: 'CertBee Certificate Workspace',
        noscriptSummary:
          'Enable JavaScript in a modern browser to upload templates, map participant rows, and generate personalized PDFs locally.',
        jsonLd: [],
      };
    }

    case 'guide': {
      const path = '/guide';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'Template & Spreadsheet Preparation Guide | CertBee',
        description:
          'Prepare PNG, SVG, or PDF certificate artwork and format CSV, Excel (.xlsx), or Google Sheets rosters cleanly before bulk PDF generation.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'How to prepare templates and spreadsheets',
        noscriptSummary:
          'Export blank certificate backgrounds at 1920x1080 or 300 DPI, format first-row headers cleanly, verify long names with Auto-fit, and export locally.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': canonical,
            url: canonical,
            name: 'Template & Spreadsheet Preparation Guide | CertBee',
            description:
              'Prepare PNG, SVG, or PDF certificate artwork and format CSV, Excel (.xlsx), or Google Sheets rosters cleanly before bulk PDF generation.',
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Preparation Guide', path },
          ]),
        ],
      };
    }

    case 'blog': {
      const path = '/blog';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'Bulk Certificate Guides & Journal | CertBee',
        description:
          'Practical guides on generating certificates from Excel, Google Sheets, hackathon rosters, workshops, typography rules, and browser-native PDF privacy.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'Notes & Guides on Certificate Craft',
        noscriptSummary:
          'Practical tutorials covering Excel, Google Sheets, workshops, hackathons, print DPI settings, Auto-fit long names, and local browser PDF generation.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': canonical,
            url: canonical,
            name: 'CertBee Journal & Guides',
            description:
              'Practical guides on bulk certificate creation from Excel, CSV, and Google Sheets.',
            publisher: makeOrganizationEntity(origin),
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Blog', path },
          ]),
        ],
      };
    }

    case 'about': {
      const path = '/about';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'About CertBee — Local-First Certificate Maker | CertBee',
        description:
          'Built by a Google Student Ambassador for ambassador programs, student clubs, and hackathons. Learn why CertBee runs 100% locally inside your browser.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'Built so one design can serve an entire room',
        noscriptSummary:
          'CertBee was created by a Google Student Ambassador so organizers keep their own designs while automating recipient PDFs locally inside the browser.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@graph': [
              makeOrganizationEntity(origin),
              {
                '@type': 'AboutPage',
                '@id': canonical,
                url: canonical,
                name: 'About CertBee',
                mainEntity: { '@id': `${origin}/#organization` },
              },
            ],
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'About', path },
          ]),
        ],
      };
    }

    case 'contact': {
      const path = '/contact';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'Contact CertBee Support & Feedback | CertBee',
        description:
          'Report template rendering issues, ask questions about bulk certificate workflows, or open issues on GitHub.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.5',
        changefreq: 'yearly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'Contact CertBee',
        noscriptSummary: `Direct email: ${SITE_CONFIG.contactEmail} · GitHub: ${SITE_CONFIG.githubUrl}`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': canonical,
            url: canonical,
            name: 'Contact CertBee',
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Contact', path },
          ]),
        ],
      };
    }

    case 'privacy': {
      const path = '/privacy';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'Privacy Policy — Zero Server Uploads | CertBee',
        description:
          'Verify how CertBee processes templates, participant rosters, IndexedDB drafts, Google Sheets links, and optional aggregate analytics locally in your browser.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.4',
        changefreq: 'yearly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'Privacy Policy',
        noscriptSummary:
          'Templates, spreadsheets, custom fonts, and generated PDFs run locally in your browser and persist only in IndexedDB until cleared.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': canonical,
            url: canonical,
            name: 'Privacy Policy | CertBee',
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path },
          ]),
        ],
      };
    }

    case 'terms': {
      const path = '/terms';
      const canonical = buildCanonicalUrl(path, origin);
      return {
        path,
        title: 'Terms of Use | CertBee',
        description:
          'Terms covering permitted certificate creation, uploaded template and font licensing responsibility, and batch verification guidelines.',
        robots: 'index, follow',
        ogType: 'website',
        ogImage,
        indexable: true,
        priority: '0.4',
        changefreq: 'yearly',
        lastmod: SITE_CONFIG.contentLastModified,
        noscriptTitle: 'Terms of Use',
        noscriptSummary:
          'Users retain full ownership of uploaded certificate artwork, participant lists, and exported PDF certificates.',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': canonical,
            url: canonical,
            name: 'Terms of Use | CertBee',
          },
          makeBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Terms of Use', path },
          ]),
        ],
      };
    }

    default: {
      return {
        path: '/404',
        title: 'Page Not Found | CertBee',
        description:
          'The requested CertBee page does not exist. Return to the homepage or open the bulk certificate studio.',
        robots: 'noindex, nofollow',
        ogType: 'website',
        ogImage,
        indexable: false,
        noscriptTitle: 'Page Not Found',
        noscriptSummary: 'Return to CertBee homepage to start a bulk certificate batch.',
        jsonLd: [],
      };
    }
  }
}

export function getAllIndexableRouteMetas(origin?: string): ResolvedRouteSeo[] {
  const staticPublicRoutes: Array<Exclude<PageRoute, 'not-found' | 'blog-post' | 'create'>> = [
    'home',
    'features',
    'how-it-works',
    'bulk-certificate-generator',
    'certificate-generator-from-excel',
    'certificate-generator-from-google-sheets',
    'workshop-certificate-generator',
    'hackathon-certificate-generator',
    'student-certificate-generator',
    'guide',
    'blog',
    'about',
    'contact',
    'privacy',
    'terms',
  ];

  const resolved: ResolvedRouteSeo[] = staticPublicRoutes.map((route) =>
    resolveRouteSeo(route, { origin })
  );

  for (const post of BLOG_POSTS) {
    resolved.push(resolveRouteSeo('blog-post', { slug: post.slug, origin }));
  }

  return resolved;
}
