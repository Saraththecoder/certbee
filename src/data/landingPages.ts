import { PageRoute } from '../types/certificate';

export type LandingRouteKey =
  | 'features'
  | 'how-it-works'
  | 'bulk-certificate-generator'
  | 'canva-certificate-generator'
  | 'certificate-generator-from-excel'
  | 'certificate-generator-from-google-sheets'
  | 'workshop-certificate-generator'
  | 'hackathon-certificate-generator'
  | 'student-certificate-generator';

export interface LandingSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface LandingFAQ {
  q: string;
  a: string;
}

export interface LandingPageData {
  route: LandingRouteKey;
  badge: string;
  badgeColor: string;
  badgeTextColor?: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  h1: string;
  intro: string;
  screenshot: string;
  screenshotAlt: string;
  screenshotCaption: string;
  highlights: Array<{ label: string; value: string }>;
  sections: LandingSection[];
  faqs: LandingFAQ[];
  relatedArticles: Array<{ slug: string; label: string }>;
  relatedPages: Array<{ route: Exclude<PageRoute, 'not-found' | 'blog-post'>; label: string }>;
}

export const LANDING_PAGES: Record<LandingRouteKey, LandingPageData> = {
  features: {
    route: 'features',
    badge: 'Features',
    badgeColor: '#2563EB',
    badgeTextColor: '#FFFFFF',
    seoTitle: 'Bulk PDF Certificate Generator Features | CertBee',
    metaDescription:
      'Upload PNG, JPG, SVG, or vector PDF templates, map CSV/Excel/Google Sheets rows, auto-fit long names, embed custom TTF/OTF fonts, and download ZIPs locally.',
    primaryKeyword: 'Bulk PDF certificate generator',
    secondaryKeywords: [
      'Free certificate generator without watermark',
      'Automatic certificate generator',
      'Browser-native PDF certificate maker',
    ],
    h1: 'Precision certificate automation without the backend overhead',
    intro:
      'Every feature in CertBee is built around one principle: bring your finished Canva, Figma, or Illustrator artwork, connect your attendee spreadsheet, and generate vector-sharp PDFs directly inside your browser.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee interactive design canvas displaying dynamic text fields, custom font menu, and live participant switcher',
    screenshotCaption: 'Step 03 Canvas Studio — exact coordinate placement, typography controls, and live row preview.',
    highlights: [
      { label: 'Templates', value: 'PNG · JPG · SVG · Vector PDF (up to 25 MB)' },
      { label: 'Spreadsheets', value: '.xlsx · .xls · .csv · Paste · Public Sheets' },
      { label: 'Typography', value: '5 built-in fonts + Custom .ttf / .otf + Auto-fit' },
      { label: 'Privacy', value: '100% browser memory + IndexedDB drafts' },
    ],
    sections: [
      {
        title: 'Template ingestion that preserves crisp geometry',
        body: 'Upload raster exports at 1920 × 1080 px (or 3508 × 2480 px at 300 DPI for print) or bring vector PDF and SVG templates directly from design tools. CertBee locks aspect ratios end-to-end from the editor canvas to every exported PDF.',
        bullets: [
          'Vector PDF backgrounds keep borders, seals, and fine rules sharp at any zoom level.',
          'SVG and high-DPI PNG backgrounds avoid JPEG compression halos.',
          'Built-in sample template ("Try with sample data") lets you inspect the editor immediately.',
        ],
      },
      {
        title: 'Dynamic field placement, Auto-fit, and multilingual scripts',
        body: 'Place dynamic Participant Name, Role / Distinction, Date, Signature Text, Signature Image, Email, or Static Text fields anywhere over your design.',
        bullets: [
          'Auto-fit proportionally shrinks extra-long names inside your text box boundaries.',
          'Full support for Hindi (Devanagari), Telugu, and complex non-ASCII Unicode names.',
          'Upload custom .ttf or .otf fonts—embedded directly into generated PDFs via fontkit.',
          'Center X / Center Y snap buttons, letter spacing, opacity, undo/redo, and zoom controls.',
        ],
      },
      {
        title: 'Zero-watermark local PDF & ZIP export',
        body: 'When your layout looks right across the participant switcher, Step 04 compiles one PDF per attendee using pdf-lib with sanitized filenames such as Certificate_Aarav_Kumar.pdf and packages them into a single ZIP via JSZip.',
      },
    ],
    faqs: [
      {
        q: 'Are any watermarks added to exported PDFs?',
        a: 'No. Every individual PDF and bundled ZIP archive exports completely watermark-free and contains only your template artwork and mapped fields.',
      },
      {
        q: 'Can I upload my university or organization brand font?',
        a: 'Yes. In Step 03, click "+ Upload TTF/OTF" inside the font selector to embed any TrueType (.ttf) or OpenType (.otf) font file directly into the PDF batch.',
      },
      {
        q: 'Does CertBee support transparent PNG signatures?',
        a: 'Yes. Choose the Signature image field in Step 03 to upload a transparent PNG signature scan and scale it cleanly over your signature line.',
      },
    ],
    relatedArticles: [
      { slug: 'create-personalized-pdf-certificates', label: 'How to Create Personalized PDF Certificates' },
      { slug: 'generate-certificates-without-uploading-data', label: 'How to Generate Certificates Without Uploading Data' },
    ],
    relatedPages: [
      { route: 'how-it-works', label: 'See the 4-step workflow' },
      { route: 'certificate-generator-from-excel', label: 'Excel (.xlsx) import guide' },
    ],
  },

  'how-it-works': {
    route: 'how-it-works',
    badge: 'Workflow',
    badgeColor: '#F6C844',
    badgeTextColor: '#12151E',
    seoTitle: 'How Bulk Certificate Generation Works in 4 Steps | CertBee',
    metaDescription:
      'Walk through CertBee’s 4-step browser workflow: upload a template, import participants from CSV/Excel/Sheets, position dynamic fields, and download your ZIP.',
    primaryKeyword: 'How to create multiple certificates using one template',
    secondaryKeywords: [
      'Bulk certificate creation online',
      'Batch certificate PDF generator',
      'Create certificates from a spreadsheet',
    ],
    h1: 'From one template and a spreadsheet to a finished ZIP in 4 steps',
    intro:
      'CertBee keeps template design and participant merging cleanly separated. You never fight brittle mail-merge templates or re-type attendee names manually.',
    screenshot: '/images/certbee-step-1-upload-certificate-template.webp',
    screenshotAlt:
      'CertBee Step 1 workspace displaying drag-and-drop template uploader for PNG, JPG, SVG, and PDF files',
    screenshotCaption: 'Step 01 — Drag and drop your clean certificate artwork without sample names.',
    highlights: [
      { label: 'Step 01', value: 'Upload PNG, JPG, SVG, or PDF background' },
      { label: 'Step 02', value: 'Import CSV, Excel, paste lines, or Sheets' },
      { label: 'Step 03', value: 'Drag dynamic boxes & preview live rows' },
      { label: 'Step 04', value: 'Render PDFs locally & download ZIP' },
    ],
    sections: [
      {
        title: 'Step 01 — Upload your blank certificate template',
        body: 'Export your finished frame from Canva, Figma, Illustrator, or PowerPoint without any sample recipient name. Drop the PNG, JPG, SVG, or vector PDF file into Step 01.',
      },
      {
        title: 'Step 02 — Import and validate your participant list',
        body: 'Upload an Excel workbook (.xlsx / .xls), UTF-8 CSV, paste names line by line (with optional default Role and Date), or paste a public Google Sheets link. Fix typos, map columns, and clear any empty rows inside the live preview table.',
      },
      {
        title: 'Step 03 — Place fields and verify long names',
        body: 'Insert Participant Name, Role, Date, Signature, or extra custom spreadsheet columns onto the canvas. Switch between multiple recipients—especially the longest name—with Auto-fit active before exporting.',
      },
      {
        title: 'Step 04 — Generate personalized PDFs and export ZIP',
        body: 'Verify the batch summary count and click Generate & Download ZIP. Individual PDFs compile right in your browser tab so you can grab the bundled ZIP or individual PDFs immediately.',
      },
    ],
    faqs: [
      {
        q: 'What if I refresh my browser halfway through positioning fields?',
        a: 'CertBee automatically saves your active batch draft—including your template, table, field coordinates, and custom fonts—to your browser IndexedDB so nothing is lost on refresh.',
      },
      {
        q: 'Can I switch back to fix a typo in Step 02 after placing fields?',
        a: 'Yes. The top step bar lets you jump back to Participants or Template anytime without erasing your canvas field placements.',
      },
    ],
    relatedArticles: [
      { slug: 'create-100-participation-certificates-automatically', label: 'How to Create 100 Participation Certificates Automatically' },
      { slug: 'design-professional-participation-certificate', label: 'Design a Professional Participation Certificate' },
    ],
    relatedPages: [
      { route: 'guide', label: 'Template & spreadsheet preparation guide' },
      { route: 'features', label: 'Explore full editor capabilities' },
    ],
  },

  'bulk-certificate-generator': {
    route: 'bulk-certificate-generator',
    badge: 'Bulk Generator',
    badgeColor: '#10B981',
    badgeTextColor: '#FFFFFF',
    seoTitle: 'Bulk Certificate Generator for Batches of PDFs | CertBee',
    metaDescription:
      'Generate dozens or hundreds of personalized PDF certificates in one ZIP archive locally in your browser. Free, no account, and no watermarks.',
    primaryKeyword: 'Bulk certificate generator',
    secondaryKeywords: [
      'Generate certificates in bulk',
      'Batch certificate PDF generator',
      'Certificate generator online',
    ],
    h1: 'Generate an entire certificate batch cleanly without per-certificate limits',
    intro:
      'Designed for events issuing 20 to 300+ certificates per batch. Map your participant columns once, validate every row before rendering, and export organized, named PDFs packaged into a ready-to-distribute ZIP.',
    screenshot: '/images/certbee-step-4-generate-download-zip.webp',
    screenshotAlt:
      'CertBee Step 4 batch generation dashboard validating participants and packaging local ZIP archive',
    screenshotCaption: 'Step 04 Batch Validation — confirms participant count, field count, and local ZIP output.',
    highlights: [
      { label: 'Recommended Batch', value: 'Up to ~200–300 PDFs per ZIP' },
      { label: 'File Naming', value: 'Auto-sanitized Certificate_<Name>.pdf' },
      { label: 'Paywall / Credit Caps', value: 'None — completely free' },
      { label: 'Large Events (500+)', value: 'Split CSVs into ~200-row runs' },
    ],
    sections: [
      {
        title: 'Built-in validation catches blank names before export',
        body: 'Nothing ruins a batch run like discovering blank certificates at row 74. Step 02 flags missing required names, duplicate entries, and suspicious email formats inline so every row in Step 04 renders cleanly.',
      },
      {
        title: 'Practical memory guidance for large batches',
        body: 'Because CertBee compiles every PDF directly in browser RAM rather than queueing jobs on remote servers, typical laptops package 200 to 300 certificates cleanly in one pass. Running a 600-person summit? Export three ~200-row batches in back-to-back runs using the same saved template and layout.',
      },
    ],
    faqs: [
      {
        q: 'Can I download a single corrected PDF without re-downloading the whole batch?',
        a: 'Yes. After generation completes in Step 04, individual participant rows list clickable "Download PDF" buttons right below the ZIP button.',
      },
      {
        q: 'Can I cancel a running batch midway?',
        a: 'Yes. Click "Cancel generation" at any point during Step 04 to stop the local PDF loop cleanly.',
      },
    ],
    relatedArticles: [
      { slug: 'create-100-participation-certificates-automatically', label: 'How to Create 100 Participation Certificates Automatically' },
      { slug: 'generate-certificates-without-uploading-data', label: 'Generate Certificates Without Uploading Data' },
    ],
    relatedPages: [
      { route: 'certificate-generator-from-excel', label: 'Certificate generator from Excel' },
      { route: 'hackathon-certificate-generator', label: 'Hackathon certificate workflow' },
    ],
  },

  'certificate-generator-from-excel': {
    route: 'certificate-generator-from-excel',
    badge: 'Excel & CSV',
    badgeColor: '#2563EB',
    badgeTextColor: '#FFFFFF',
    seoTitle: 'Certificate Generator from Excel (.xlsx) & CSV | CertBee',
    metaDescription:
      'Turn Excel (.xlsx, .xls) or CSV spreadsheets into personalized PDF certificates for free. Auto-map Name, Role, Date, and Email locally in browser.',
    primaryKeyword: 'Certificate generator from Excel',
    secondaryKeywords: [
      'Certificate generator from CSV',
      'Create certificates from a spreadsheet',
      'How to generate 100 certificates from Excel',
    ],
    h1: 'Generate personalized PDF certificates straight from Excel (.xlsx) or CSV',
    intro:
      'Skip fragile Word mail-merge wizards and VBA macros. Drop your .xlsx, .xls, or UTF-8 .csv file straight into CertBee and map your columns to visual fields on your certificate.',
    screenshot: '/images/certbee-step-2-import-participants-spreadsheet.webp',
    screenshotAlt:
      'CertBee Step 2 spreadsheet uploader supporting Excel .xlsx workbooks and CSV rosters',
    screenshotCaption: 'Step 02 Spreadsheet Importer — drag and drop .xlsx, .xls, or .csv files locally.',
    highlights: [
      { label: 'Excel Workbooks', value: '.xlsx and .xls parsed locally via SheetJS' },
      { label: 'CSV Support', value: 'UTF-8 CSV parsed via PapaParse' },
      { label: 'Column Mapping', value: 'Auto-detects Name, Role, Date, Email' },
      { label: 'Custom Fields', value: 'Every extra column usable on canvas' },
    ],
    sections: [
      {
        title: 'Map any column header without renaming your sheet',
        body: 'Whether your Excel column is titled "Full Name", "Student_Name", or "Attendee", CertBee auto-suggests mappings and lets you reassign Name, Email, Role / Award, Date, and Signature with five simple dropdowns.',
      },
      {
        title: 'Inline spreadsheet editing & search before rendering',
        body: 'Spot a misspelled surname or lowercase title after importing? Edit any cell directly in Step 02, search across rows, sort columns alphabetically, or remove test entries without re-uploading your file.',
      },
    ],
    faqs: [
      {
        q: 'Which worksheet tab does CertBee read from multi-sheet Excel workbooks?',
        a: 'CertBee reads the primary worksheet tab from your uploaded .xlsx or .xls workbook. Keep your finalized attendee table on the first tab for fastest import.',
      },
      {
        q: 'Does UTF-8 CSV preserve Hindi, Telugu, or accented names?',
        a: 'Yes. Save your spreadsheet as UTF-8 CSV (or upload .xlsx directly) and characters in Devanagari, Telugu, or accented Latin scripts import accurately.',
      },
    ],
    relatedArticles: [
      { slug: 'generate-certificates-bulk-excel-free', label: 'How to Generate Certificates in Bulk Using Excel for Free' },
      { slug: 'create-100-participation-certificates-automatically', label: 'Create 100 Participation Certificates Automatically' },
    ],
    relatedPages: [
      { route: 'certificate-generator-from-google-sheets', label: 'Use Google Sheets instead' },
      { route: 'guide', label: 'Spreadsheet formatting checklist' },
    ],
  },

  'certificate-generator-from-google-sheets': {
    route: 'certificate-generator-from-google-sheets',
    badge: 'Google Sheets',
    badgeColor: '#10B981',
    badgeTextColor: '#FFFFFF',
    seoTitle: 'Google Sheets Certificate Generator Online | CertBee',
    metaDescription:
      'Import a public Google Sheets link directly in your browser to generate bulk personalized PDF certificates without Workspace add-ons or OAuth.',
    primaryKeyword: 'Google Sheets certificate generator',
    secondaryKeywords: [
      'How to generate certificates from Google Sheets',
      'Bulk certificate creation online',
      'Create certificates from a spreadsheet',
    ],
    h1: 'Import a public Google Sheet directly—no Workspace add-on required',
    intro:
      'Running registrations through Google Forms and Google Sheets? Paste your sheet URL (including a specific tab #gid) directly into Step 02 to fetch rows client-side and generate your certificate batch.',
    screenshot: '/images/certbee-step-2-import-participants-spreadsheet.webp',
    screenshotAlt:
      'CertBee Step 2 import panel featuring the Google Sheets URL tab alongside CSV and Excel options',
    screenshotCaption: 'Paste any Google Sheets link set to "Anyone with the link can view" into Step 02.',
    highlights: [
      { label: 'No Add-ons', value: 'Zero Google Workspace Marketplace installs' },
      { label: 'Tab Targeting', value: 'Honors #gid=... tab IDs in your URL' },
      { label: 'No OAuth Tokens', value: 'Browser fetches public CSV endpoint directly' },
      { label: 'Private Alternative', value: 'Export Sheet as .csv/.xlsx & drop locally' },
    ],
    sections: [
      {
        title: 'Two-click sharing setup for direct import',
        body: 'In Google Sheets, click Share → General access → Anyone with the link (Viewer). Copy the spreadsheet URL—keeping the #gid= parameter if you need a secondary tab—and paste it into CertBee’s Google Sheets URL tab.',
      },
      {
        title: 'Lock permissions back right after loading',
        body: 'As soon as CertBee loads your rows into the editable Step 02 table, you can immediately switch your Google Sheet back to Restricted sharing while continuing to design and export locally.',
      },
    ],
    faqs: [
      {
        q: 'Why not support private Google Sheets via OAuth?',
        a: 'Requiring Drive OAuth adds account friction and third-party permission prompts. Public read-only links (or quick File → Download → CSV/XLSX) keep CertBee zero-login and zero-backend.',
      },
      {
        q: 'What if Google Sheets returns an HTML error or CORS block?',
        a: 'That usually means the sheet is still Restricted. Either set link access to Viewer temporarily, or download the tab via File → Download → CSV and drop it into Step 02.',
      },
    ],
    relatedArticles: [
      { slug: 'generate-certificates-using-google-sheets', label: 'How to Generate Certificates Using Google Sheets' },
      { slug: 'generate-certificates-without-uploading-data', label: 'Generate Certificates Without Uploading Data' },
    ],
    relatedPages: [
      { route: 'certificate-generator-from-excel', label: 'Prefer local CSV or Excel files?' },
      { route: 'workshop-certificate-generator', label: 'Workshop attendance certificate guide' },
    ],
  },

  'workshop-certificate-generator': {
    route: 'workshop-certificate-generator',
    badge: 'Workshops',
    badgeColor: '#F6C844',
    badgeTextColor: '#12151E',
    seoTitle: 'Certificate Generator for Workshops & Bootcamps | CertBee',
    metaDescription:
      'Create personalized workshop participation and completion certificates in bulk from attendance lists, CSVs, or Google Sheets—free and watermark-free.',
    primaryKeyword: 'Certificate generator for workshops',
    secondaryKeywords: [
      'How to create workshop participation certificates in bulk',
      'Free certificate maker',
      'Generate certificates in bulk',
    ],
    h1: 'Issue workshop & study jam certificates right after your session ends',
    intro:
      'Whether you only collected a plain text list of attendee names or a full check-in spreadsheet, CertBee lets instructors, Google Student Ambassadors, and trainers deliver signed certificates fast.',
    screenshot: '/images/certbee-sample-certificate-preview.webp',
    screenshotAlt:
      'Completed colorful certificate specimen showing clean name placement for a workshop attendee',
    screenshotCaption: 'Clean recipient framing rendered over static Canva or Figma certificate artwork.',
    highlights: [
      { label: 'Quick Paste Mode', value: 'Paste raw attendee names, 1 per line' },
      { label: 'Batch Defaults', value: 'Apply 1 Role & Issue Date to all pasted rows' },
      { label: 'Instructor Sign-off', value: 'Transparent PNG or typed script signature' },
      { label: 'Print & LinkedIn', value: ' Crisp PDF exports ready to share' },
    ],
    sections: [
      {
        title: 'No formatted spreadsheet? Just paste attendee names',
        body: 'In Step 02, open the "Paste names" tab, drop your list one name per line, and optionally set a default Role (like "Workshop Participant") and Date once—no need to open Excel first.',
      },
      {
        title: 'Add instructor signatures cleanly',
        body: 'Include your instructor name as a script font field or upload a crisp transparent PNG scan of their handwritten signature in Step 03.',
      },
    ],
    faqs: [
      {
        q: 'Can I preview every workshop attendee before exporting?',
        a: 'Yes. Step 03 includes an interactive dropdown and next/previous arrows to flip through real participant records rendered live over your template.',
      },
    ],
    relatedArticles: [
      { slug: 'create-workshop-certificates-for-students', label: 'How to Create Workshop Certificates for Students' },
      { slug: 'design-professional-participation-certificate', label: 'Design a Professional Participation Certificate' },
    ],
    relatedPages: [
      { route: 'hackathon-certificate-generator', label: 'Running a hackathon instead?' },
      { route: 'student-certificate-generator', label: 'Campus clubs & student events' },
    ],
  },

  'hackathon-certificate-generator': {
    route: 'hackathon-certificate-generator',
    badge: 'Hackathons',
    badgeColor: '#12151E',
    badgeTextColor: '#F6C844',
    seoTitle: 'Hackathon Certificate Generator in Bulk | CertBee',
    metaDescription:
      'Generate Winner, Finalist, Mentor, Judge, and Participant hackathon certificates from one template and a multi-role spreadsheet locally in browser.',
    primaryKeyword: 'Certificate generator for hackathons',
    secondaryKeywords: [
      'Bulk certificate generator',
      'Personalized certificate generator',
      'Free bulk certificate generator',
    ],
    h1: 'One hackathon template for winners, finalists, mentors, and participants',
    intro:
      'Stop duplicating artboards across separate roles after judging ends. Drive Winner, Track Award, Mentor, Judge, and Participant labels dynamically straight from your master registration sheet.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee Step 3 studio placing dynamic hackathon name and role placeholders on a certificate template',
    screenshotCaption: 'Built with campus & community hackathon workflows in mind—map Role/Track fields dynamically.',
    highlights: [
      { label: 'Dynamic Roles', value: 'Map Winner, Mentor, Finalist per row' },
      { label: 'Extra Columns', value: 'Display Team Name or Track fields' },
      { label: 'Multilingual Names', value: 'Supports Hindi, Telugu & non-ASCII glyphs' },
      { label: 'Zero Bottlenecks', value: 'Local browser rendering without queues' },
    ],
    sections: [
      {
        title: 'Drive distinctions directly from your spreadsheet',
        body: 'Add a Role column alongside Name in your CSV or Excel roster. CertBee places {{role}} dynamically so winners, track runners-up, mentors, and hackers all merge cleanly from a single approved certificate template.',
      },
      {
        title: 'Auto-fit handles team names and double-barrel surnames',
        body: 'Keeping Auto-fit enabled ensures long participant names and multi-word hackathon track titles stay neatly centered inside your decorative seal margins.',
      },
    ],
    faqs: [
      {
        q: 'Can I load a built-in hackathon example to test the editor?',
        a: 'Yes. Click "Try with sample data" on the homepage to load a ready-made Campus Hackathon SVG template with sample winners, mentors, and Hindi/Telugu names directly in Step 03.',
      },
    ],
    relatedArticles: [
      { slug: 'generate-hackathon-certificates-in-bulk', label: 'How to Generate Hackathon Certificates in Bulk' },
      { slug: 'create-personalized-pdf-certificates', label: 'How to Create Personalized PDF Certificates' },
    ],
    relatedPages: [
      { route: 'workshop-certificate-generator', label: 'Workshop & bootcamp certificates' },
      { route: 'bulk-certificate-generator', label: 'Scaling larger batches (~200–300 PDFs)' },
    ],
  },

  'student-certificate-generator': {
    route: 'student-certificate-generator',
    badge: 'Students & Clubs',
    badgeColor: '#2563EB',
    badgeTextColor: '#FFFFFF',
    seoTitle: 'Certificate Generator for Students & Campus Clubs | CertBee',
    metaDescription:
      'Free, privacy-first bulk certificate generator built by a Google Student Ambassador for college clubs, ambassador programs, and student societies.',
    primaryKeyword: 'Certificate generator for students',
    secondaryKeywords: [
      'How to create certificates in bulk for students',
      'Free bulk certificate generator',
      'Free certificate generator without watermark',
    ],
    h1: 'Built for campus clubs, student ambassadors, and academic events',
    intro:
      'Student committees shouldn’t have to pay per-certificate fees or compromise student data privacy just to issue appreciation certificates. CertBee runs free inside your browser—made by a Google Student Ambassador.',
    screenshot: '/images/certbee-step-4-generate-download-zip.webp',
    screenshotAlt:
      'CertBee export view packaging student club PDF certificates cleanly inside the browser',
    screenshotCaption: 'Zero paywalls, zero watermarks, and zero server storage of student rosters.',
    highlights: [
      { label: 'Student Privacy', value: 'Names & college emails stay on your device' },
      { label: 'Regional Scripts', value: 'Devanagari, Telugu & international UTF-8' },
      { label: 'Cost', value: '100% free for clubs & student organizers' },
      { label: 'Open Source', value: 'Public source available on GitHub' },
    ],
    sections: [
      {
        title: 'Respects student email & attendance privacy by architecture',
        body: 'Because spreadsheet parsing, coordinate mapping, and pdf-lib rendering occur entirely inside browser memory, student names and institutional email addresses never hit external collection servers.',
      },
      {
        title: 'From ambassador cohorts to annual cultural fests',
        body: 'Reuse your department or club crest template year-round: drop in your clean background, load each event’s Google Sheet or Excel attendance export, and download sanitized PDFs in minutes.',
      },
    ],
    faqs: [
      {
        q: 'Do student club coordinators need to create accounts?',
        a: 'No accounts or logins are required. Any coordinator can open CertBee, import a roster, and export finished certificates right away.',
      },
    ],
    relatedArticles: [
      { slug: 'create-workshop-certificates-for-students', label: 'How to Create Workshop Certificates for Students' },
      { slug: 'generate-certificates-without-uploading-data', label: 'Why Local Processing Protects Student Data' },
    ],
      relatedPages: [
        { route: 'privacy', label: 'Read how local processing works' },
        { route: 'about', label: 'Why a Google Student Ambassador built CertBee' },
      ],
    },

  'canva-certificate-generator': {
    route: 'canva-certificate-generator',
    badge: 'Canva Workflow',
    badgeColor: '#F6C33E',
    seoTitle: 'Free Bulk Certificate Generator for Canva Designs | CertBee',
    metaDescription:
      'Designed your certificate in Canva Free? Export a blank PNG or PDF template, import Excel, CSV, or Google Sheets, and bulk-generate watermark-free PDFs locally.',
    primaryKeyword: 'Bulk certificate generator Canva',
    secondaryKeywords: [
      'Free bulk certificate generator for Canva',
      'Canva certificate bulk create alternative free',
      'Bulk PDF certificate maker from Canva template',
    ],
    h1: 'Bulk-fill Canva certificate designs for free—without paywalls',
    intro:
      'Design your certificate layout in Canva Free, remove the placeholder recipient name, export once, and let CertBee generate hundreds of personalized PDFs from Excel, CSV, or Google Sheets inside your browser.',
    screenshot: '/images/certbee-step-3-design-certificate-fields.webp',
    screenshotAlt:
      'CertBee design canvas displaying a Canva-exported certificate template with dynamic participant fields',
    screenshotCaption: 'Keep your exact Canva borders, logos, and typography layout while merging names in bulk.',
    highlights: [
      { label: 'Best Canva Export', value: 'PDF Print (vector) or PNG at 3508 × 2480 px' },
      { label: 'Canva Pro Needed?', value: 'No — works with Canva Free exports' },
      { label: 'Data Sources', value: 'Excel (.xlsx) · CSV · Paste · Google Sheets' },
      { label: 'Watermark', value: 'None — clean PDF & ZIP download' },
    ],
    sections: [
      {
        title: 'How to export your Canva certificate cleanly',
        body: 'Before exporting from Canva, delete only the sample recipient name (and any dynamic role/date text you want filled per row). Keep borders, event logos, seals, and static copy intact on the page.',
        bullets: [
          'Choose Share → Download → PDF Print for crisp vector borders and logos, or PNG (2x / 3508 × 2480 px) for raster artwork.',
          'Check that your signature line or badge area leaves enough horizontal width for 30+ character names.',
          'Upload your matching .ttf or .otf font in Step 03 if you want Canva typography matched cleanly.',
        ],
      },
      {
        title: 'Merge names, roles, and dates locally in four steps',
        body: 'Upload your Canva export in Step 01, load your participant spreadsheet or Google Sheet in Step 02, enable Auto-fit on the Participant Name box in Step 03, and download named PDFs as a single ZIP in Step 04.',
      },
    ],
    faqs: [
      {
        q: 'Do I need Canva Pro to bulk-generate certificates with CertBee?',
        a: 'No. Export a clean certificate background from Canva Free (PNG or PDF Standard/Print) without recipient names, then merge your spreadsheet rows locally in CertBee for free.',
      },
      {
        q: 'Should I export PNG or PDF Print from Canva?',
        a: 'Export PDF Print when possible so logos, borders, and lines remain vector-sharp inside every generated certificate. If your Canva design includes heavy raster effects, export high-resolution PNG.',
      },
    ],
    relatedArticles: [
      { slug: 'design-professional-participation-certificate', label: 'How to Design a Clean Certificate Template' },
      { slug: 'generate-certificates-bulk-excel-free', label: 'How to Generate Bulk Certificates from Excel' },
    ],
    relatedPages: [
      { route: 'certificate-generator-from-excel', label: 'From Excel & CSV spreadsheets' },
      { route: 'certificate-generator-from-google-sheets', label: 'From Google Sheets' },
    ],
  },
};
