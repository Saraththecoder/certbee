import { PageRoute } from '../types/certificate';

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
  callout?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  topic: string;
  publishedDate: string;
  modifiedDate: string;
  displayDate: string;
  readTime: string;
  summary: string;
  screenshot: string;
  screenshotAlt: string;
  screenshotWidth: number;
  screenshotHeight: number;
  sections: BlogArticleSection[];
  relatedSlugs: string[];
  relatedRoute: {
    route: Exclude<PageRoute, 'not-found' | 'blog-post'>;
    label: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'generate-certificates-bulk-excel-free',
    title: 'How to Generate Certificates in Bulk Using Excel for Free',
    seoTitle: 'How to Generate Certificates in Bulk Using Excel | CertBee',
    metaDescription:
      'Step-by-step workflow to convert an Excel (.xlsx or .xls) participant roster into personalized PDF certificates for free inside your browser.',
    primaryKeyword: 'How to generate 100 certificates from Excel',
    secondaryKeywords: [
      'Certificate generator from Excel',
      'Create certificates from a spreadsheet',
      'Bulk PDF certificate generator',
    ],
    topic: 'Excel Workflow',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '4 min read',
    summary:
      'Turn any .xlsx workbook into ready-to-send personalized PDF certificates without mail-merge macros, paid SaaS credits, or server uploads.',
    screenshot: '/images/certbee-step-2-import-participants-spreadsheet.webp',
    screenshotAlt:
      'CertBee Step 2 participant import interface supporting Excel (.xlsx), CSV, and pasted names',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: '1. Clean up your Excel columns before importing',
        paragraphs: [
          'Most certificate generation headaches start in row 1 of the spreadsheet. Before opening CertBee, make sure the very first row of your Excel sheet contains simple header names such as Name, Role, Date, and Email.',
          'Avoid merged title banners above the table headers, empty spacer columns, or extra notes below the final participant row. CertBee reads the active sheet locally using SheetJS and automatically guesses common header names so you can verify them immediately.',
        ],
        callout:
          'Tip: Keep full names in one combined column rather than splitting First Name and Last Name when designing a single centered name box.',
      },
      {
        heading: '2. Export a blank certificate template from Figma or Canva',
        paragraphs: [
          'Open your certificate design in Canva, Figma, or PowerPoint and delete the placeholder recipient name, role label, and date text that vary per person. Keep your borders, organizer logo, seal, and event title intact.',
          'Export the artwork as a PNG at 1920 × 1080 px (or 3508 × 2480 px at 300 DPI for print), or export a vector PDF if your tool supports it.',
        ],
      },
      {
        heading: '3. Map columns and preview long names live',
        paragraphs: [
          'Upload your blank template in Step 01, drop your .xlsx or .xls workbook into Step 02, and map the Name column alongside optional Role, Date, or Email fields. Fix any empty rows or typos inline right inside the editable participant table.',
          'In Step 03, position your dynamic text boxes over the template, enable Auto-fit so long surnames never collide with borders, and click through multiple participants in the top switcher before exporting.',
        ],
      },
      {
        heading: '4. Export sanitized PDFs as a local ZIP archive',
        paragraphs: [
          'Proceed to Step 04 and click Generate & Download ZIP. Your browser renders each certificate directly into an individual PDF file named after the participant (for example, Certificate_Aarav_Kumar.pdf) and bundles them into a single ZIP without sending spreadsheet rows to an external server.',
        ],
      },
    ],
    relatedSlugs: [
      'create-100-participation-certificates-automatically',
      'generate-certificates-using-google-sheets',
    ],
    relatedRoute: {
      route: 'certificate-generator-from-excel',
      label: 'Explore the Excel certificate workflow',
    },
  },
  {
    slug: 'create-100-participation-certificates-automatically',
    title: 'How to Create 100 Participation Certificates Automatically',
    seoTitle: 'Create 100 Participation Certificates Automatically | CertBee',
    metaDescription:
      'Generate 100+ personalized participation certificates from one template and a CSV or Excel list in minutes without typing names manually.',
    primaryKeyword: 'Generate certificates in bulk',
    secondaryKeywords: [
      'Create certificates in bulk',
      'Batch certificate PDF generator',
      'Automatic certificate generator',
    ],
    topic: 'Batch Automation',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '4 min read',
    summary:
      'Duplicate-and-export loops break down past 15 attendees. Here is how to run a verified 100-person batch from one clean design.',
    screenshot: '/images/certbee-step-4-generate-download-zip.webp',
    screenshotAlt:
      'CertBee Step 4 batch generation summary showing participant count and local ZIP export controls',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'Why manual duplication fails at 100 attendees',
        paragraphs: [
          'Editing a slide deck or Canva page 100 separate times introduces silent errors: skipped rows, mismatched font sizes for longer names, and generic output filenames like copy-of-certificate-42.pdf.',
          'A single master template paired with a structured CSV or pasted attendance list separates design from data so every certificate shares identical typography, margins, and seals.',
        ],
      },
      {
        heading: 'Designing a resilient layout for 100+ names',
        paragraphs: [
          'When generating a batch of 100 certificates, give the dynamic Participant Name box generous horizontal width—roughly 65% to 75% of your certificate width—and leave Auto-fit enabled.',
          'Before clicking export, use the participant switcher in Step 03 to preview your longest full name alongside a short name, plus any Hindi, Telugu, or non-ASCII names in your roster.',
        ],
        callout:
          'Batch size tip: Standard laptops comfortably package 200–300 PDFs in a single ZIP archive inside browser memory. For 500+ attendees, split the CSV into groups of ~200 rows.',
      },
      {
        heading: 'Downloading predictable PDF filenames',
        paragraphs: [
          'Every file generated in Step 04 receives a clean, sanitized filename tied to the participant row so mailing scripts or manual distribution folders stay organized.',
        ],
      },
    ],
    relatedSlugs: [
      'generate-certificates-bulk-excel-free',
      'handling-long-names' in {} ? '' : 'create-personalized-pdf-certificates',
    ].filter(Boolean),
    relatedRoute: {
      route: 'bulk-certificate-generator',
      label: 'See the bulk certificate generator',
    },
  },
  {
    slug: 'generate-certificates-using-google-sheets',
    title: 'How to Generate Certificates Using Google Sheets',
    seoTitle: 'How to Generate Certificates from Google Sheets | CertBee',
    metaDescription:
      'Turn a public Google Sheets attendance tab into bulk personalized PDF certificates directly in your browser without Google account OAuth.',
    primaryKeyword: 'How to generate certificates from Google Sheets',
    secondaryKeywords: [
      'Google Sheets certificate generator',
      'Bulk certificate creation online',
      'Create certificates from a spreadsheet',
    ],
    topic: 'Google Sheets',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '3 min read',
    summary:
      'Connect a Google Form response sheet or registration tab straight into CertBee by setting read-only link sharing—no add-ons required.',
    screenshot: '/images/certbee-step-2-import-participants-spreadsheet.webp',
    screenshotAlt:
      'CertBee Step 2 showing the Google Sheets URL tab for importing public spreadsheet tabs',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'How direct browser import from Google Sheets works',
        paragraphs: [
          'Instead of installing Workspace add-ons with broad Drive permissions, CertBee fetches your spreadsheet tab straight from your browser using Google Sheets read-only CSV export URLs.',
          'Because the request goes directly from your browser tab to Google, CertBee never requests OAuth tokens or sees private spreadsheets.',
        ],
      },
      {
        heading: 'Sharing settings you need for import',
        paragraphs: [
          'Open your Google Sheet, click Share in the top right, and switch General access to "Anyone with the link" as Viewer. Copy the full browser URL—including the `#gid=...` tab parameter if you want a specific worksheet tab rather than the first tab.',
          'Once imported into Step 02, you can immediately switch the Google Sheet back to Restricted sharing if the event roster contains sensitive student emails.',
        ],
        callout:
          'Prefer keeping a private workbook? Simply use File → Download → Comma Separated Values (.csv) or Excel (.xlsx) in Google Sheets and drop the file locally into Step 02.',
      },
      {
        heading: 'Mapping Google Form columns',
        paragraphs: [
          'Form response sheets often carry long question headers like "What is your full name (for certificates)?". Use the five mapping dropdowns at the top of Step 02 to link those headers cleanly to Name, Email, Role, Date, or Signature.',
        ],
      },
    ],
    relatedSlugs: [
      'generate-certificates-bulk-excel-free',
      'generate-certificates-without-uploading-data',
    ],
    relatedRoute: {
      route: 'certificate-generator-from-google-sheets',
      label: 'Google Sheets workflow details',
    },
  },
  {
    slug: 'create-workshop-certificates-for-students',
    title: 'How to Create Workshop Certificates for Students',
    seoTitle: 'Create Workshop Certificates for Students in Bulk | CertBee',
    metaDescription:
      'Practical guide for college clubs, instructors, and Google Student Ambassadors to prepare attendance lists, signatures, and bulk workshop certificates.',
    primaryKeyword: 'How to create workshop participation certificates in bulk',
    secondaryKeywords: [
      'Certificate generator for workshops',
      'Certificate generator for students',
      'Free certificate maker',
    ],
    topic: 'Workshops & Clubs',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '4 min read',
    summary:
      'From campus study jams to weekend coding bootcamps, issue clean attendance certificates with instructor signatures in minutes.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee Step 3 canvas editor showing dynamic participant name placement, font controls, and field list',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'Start from an attendance check-in export or plain list',
        paragraphs: [
          'After a workshop wraps up, organizers usually have either a CSV export from a registration form or a plain attendance column copied from a doc. If you only have names, switch Step 02 to the "Paste names" tab.',
          'You can enter an optional Default Role (such as "Workshop Participant") and Default Issue Date once for every pasted attendee so you do not have to edit a CSV first.',
        ],
      },
      {
        heading: 'Adding faculty or club lead signatures',
        paragraphs: [
          'CertBee supports both typed script signatures (using Great Vibes or a custom .ttf font) and uploaded transparent PNG signature images.',
          'Upload a clean black-ink scan on a transparent background in Step 03 and place it neatly above your Printed Name & Title footer.',
        ],
      },
      {
        heading: 'Supporting regional and multilingual student names',
        paragraphs: [
          'Student rosters frequently include names written in Devanagari, Telugu, or accented Latin characters. CertBee handles standard Unicode scripts cleanly with native shaping, and lets you upload custom .ttf or .otf fonts if your college uses a dedicated brand typeface.',
        ],
      },
    ],
    relatedSlugs: [
      'generate-hackathon-certificates-in-bulk',
      'design-professional-participation-certificate',
    ],
    relatedRoute: {
      route: 'workshop-certificate-generator',
      label: 'Open workshop certificate workflow',
    },
  },
  {
    slug: 'generate-hackathon-certificates-in-bulk',
    title: 'How to Generate Hackathon Certificates in Bulk',
    seoTitle: 'How to Generate Hackathon Certificates in Bulk | CertBee',
    metaDescription:
      'Generate Winner, Finalist, Mentor, Judge, and Participant hackathon certificates from one shared template and a multi-role spreadsheet.',
    primaryKeyword: 'Certificate generator for hackathons',
    secondaryKeywords: [
      'Bulk certificate generator',
      'Personalized certificate generator',
      'Free certificate generator without watermark',
    ],
    topic: 'Hackathons',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '4 min read',
    summary:
      'Avoid exporting separate templates for winners, mentors, and hackers by driving the Role / Distinction field straight from your spreadsheet.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee design canvas displaying dynamic Participant Name and Role placeholders over certificate artwork',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'One base template, multiple hackathon distinctions',
        paragraphs: [
          'Instead of maintaining five separate Illustrator or Figma artboards for "1st Place — AI Track", "Finalist", "Mentor", and "Participant", add a Role column to your master spreadsheet and place the {{role}} field directly below {{name}}.',
          'Turn on Auto-fit for both Name and Role so longer track titles like "Winner · Cloud & AI Track" scale cleanly to fit.',
        ],
      },
      {
        heading: 'Using extra spreadsheet columns as custom fields',
        paragraphs: [
          'Need to include a Team Name or Project Track alongside the participant name? Any additional columns in your CSV or Excel file remain accessible inside the Step 03 field builder so you can stamp team credentials accurately.',
        ],
      },
      {
        heading: 'Fast turnaround after closing ceremonies',
        paragraphs: [
          'Because PDF rendering runs inside your browser with zero queues or paywalls, organizing committees can import the final verified attendance sheet right after judging and export the complete ZIP archive the same evening.',
        ],
      },
    ],
    relatedSlugs: [
      'create-workshop-certificates-for-students',
      'create-100-participation-certificates-automatically',
    ],
    relatedRoute: {
      route: 'hackathon-certificate-generator',
      label: 'See hackathon certificate workflow',
    },
  },
  {
    slug: 'create-personalized-pdf-certificates',
    title: 'How to Create Personalized PDF Certificates',
    seoTitle: 'How to Create Personalized PDF Certificates | CertBee',
    metaDescription:
      'Learn how to configure Auto-fit typography, custom TTF/OTF fonts, transparent signatures, and crisp PDF coordinates for personalized certificates.',
    primaryKeyword: 'How to make personalized certificates automatically',
    secondaryKeywords: [
      'Personalized certificate generator',
      'Bulk PDF certificate generator',
      'How to create multiple certificates using one template',
    ],
    topic: 'Typography & PDF',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '4 min read',
    summary:
      'Fix clipping on 32-character names, match your brand typeface with custom TTF/OTF uploads, and preserve vector sharpness inside exported PDFs.',
    screenshot: '/images/certbee-sample-certificate-preview.webp',
    screenshotAlt:
      'Sample personalized completion certificate preview with sharp borders and centered recipient name typography',
    screenshotWidth: 900,
    screenshotHeight: 636,
    sections: [
      {
        heading: '1. Stretch the bounding box wider than your sample name',
        paragraphs: [
          'When placing {{name}} on your design, never size the box tightly around a short sample like "Priya Sharma". Drag the horizontal edges out to 65%–75% of the certificate width while keeping alignment centered.',
          'With Auto-fit active in Step 03, standard names stay at your full chosen point size while extra-long names scale down proportionally inside the box margins.',
        ],
      },
      {
        heading: '2. Pair built-in editorial fonts or upload your own .ttf/.otf',
        paragraphs: [
          'CertBee includes Fraunces, Playfair Display, Plus Jakarta Sans, JetBrains Mono, and Great Vibes out of the box. For strict institutional branding, upload your club or university .ttf or .otf font file directly in Step 03.',
          'Custom font binaries are embedded cleanly via fontkit inside every generated PDF so recipients see the exact typeface on any PDF viewer.',
        ],
      },
      {
        heading: '3. Fine-tune spacing, opacity, and percentage coordinates',
        paragraphs: [
          'Use the Center X button and exact coordinate controls in the right properties panel to lock text lines dead-center over decorative horizontal rules.',
        ],
      },
    ],
    relatedSlugs: [
      'design-professional-participation-certificate',
      'generate-certificates-without-uploading-data',
    ],
    relatedRoute: {
      route: 'features',
      label: 'Explore all editor typography controls',
    },
  },
  {
    slug: 'design-professional-participation-certificate',
    title: 'How to Design a Professional Participation Certificate',
    seoTitle: 'Design a Professional Participation Certificate | CertBee',
    metaDescription:
      'Export checklist for Canva, Figma, and Illustrator: resolution specs (300 DPI vs 1920x1080), border safe zones, PNG vs PDF backgrounds.',
    primaryKeyword: 'Certificate template export checklist',
    secondaryKeywords: [
      'Free certificate maker',
      'Certificate generator online',
      'Bulk certificate generator',
    ],
    topic: 'Template Craft',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '3 min read',
    summary:
      'Small compression halos around borders and seals stand out once vector-sharp names sit over them. Follow these export dimensions before batch merging.',
    screenshot: '/images/certbee-step-1-upload-certificate-template.webp',
    screenshotAlt:
      'CertBee Step 1 template upload dropzone showing supported PNG, JPG, SVG, and vector PDF formats',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'Vector PDF & SVG vs 300 DPI PNG',
        paragraphs: [
          'Whenever your design tool exports clean vector PDFs (such as Figma or Illustrator), upload that PDF directly. Vector borders, QR graphics, and seals remain razor-sharp at every zoom level.',
          'If your template includes rich gradients, photography, or textures exported as a raster image, choose lossless PNG over JPEG. Export at 1920 × 1080 px for LinkedIn/email sharing or 3508 × 2480 px (A4 landscape at 300 DPI) for physical printing.',
        ],
        callout:
          'Avoid lossy JPEGs around thin dark ink borders—even high-quality JPEG compression leaves faint halos near crisp serif name overlays.',
      },
      {
        heading: 'Leave breathing room around the recipient zone',
        paragraphs: [
          'Before exporting your blank template, remove the sample recipient name and keep at least 15% horizontal margin on both sides of the signature and name lines so long names never collide with corner ornaments.',
        ],
      },
    ],
    relatedSlugs: [
      'create-personalized-pdf-certificates',
      'create-workshop-certificates-for-students',
    ],
    relatedRoute: {
      route: 'guide',
      label: 'Read the full preparation guide',
    },
  },
  {
    slug: 'generate-certificates-without-uploading-data',
    title: 'How to Generate Certificates Without Uploading Participant Data',
    seoTitle: 'Generate Certificates Without Uploading Data | CertBee',
    metaDescription:
      'Understand how CertBee parses spreadsheets, renders vector PDFs, embeds custom fonts, and packages ZIP archives completely inside your browser.',
    primaryKeyword: 'How to generate PDF certificates without uploading data',
    secondaryKeywords: [
      'Local browser certificate generator',
      'Private bulk certificate generator',
      'Browser-native PDF generator',
    ],
    topic: 'Local-First Privacy',
    publishedDate: '2026-11-15',
    modifiedDate: '2026-11-15',
    displayDate: 'Nov 15, 2026',
    readTime: '3 min read',
    summary:
      'Student rosters carry personal names and emails. Here is how client-side PDF and ZIP libraries let you keep 100% of participant data on your device.',
    screenshot: '/images/certbee-step-4-generate-download-zip.webp',
    screenshotAlt:
      'CertBee Step 4 local generation panel executing pdf-lib rendering and ZIP compression in browser',
    screenshotWidth: 1280,
    screenshotHeight: 585,
    sections: [
      {
        heading: 'Why browser-native PDF generation matters',
        paragraphs: [
          'Event spreadsheets routinely contain full student names, personal email addresses, and distinction ranks. Uploading an attendee CSV to a remote server just to stamp text onto a certificate introduces unnecessary third-party exposure.',
          'Modern browsers provide all the primitives needed to parse spreadsheets, shape Unicode fonts, compose multi-layered PDFs, and stream ZIP downloads locally in memory.',
        ],
      },
      {
        heading: 'What stays on your device vs external requests',
        paragraphs: [
          'CertBee parses CSV and Excel files locally with PapaParse and SheetJS, renders each PDF with pdf-lib and fontkit, bundles the archive with JSZip, and saves your active draft only in your browser IndexedDB storage.',
          'The only external network requests occur if you explicitly paste a public Google Sheets link (fetched read-only directly by your browser from Google) or when loading stylesheet fonts.',
        ],
        callout:
          'You can erase all saved local draft templates, spreadsheets, and fonts at any time using the "New batch" reset control.',
      },
    ],
    relatedSlugs: [
      'generate-certificates-using-google-sheets',
      'generate-certificates-bulk-excel-free',
    ],
    relatedRoute: {
      route: 'privacy',
      label: 'Read our verifiable Privacy Policy',
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
