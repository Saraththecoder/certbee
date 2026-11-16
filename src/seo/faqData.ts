export interface FAQItem {
  q: string;
  a: string;
}

export const HOME_FAQ_ITEMS: FAQItem[] = [
  {
    q: 'How does the bulk certificate generator work?',
    a: 'Upload your blank certificate template (PNG, JPG, SVG, or PDF), import participant names from Excel, CSV, pasted text, or a public Google Sheet, drag dynamic text or signature fields onto the live canvas, and export all personalized PDFs individually or inside one ZIP archive.',
  },
  {
    q: 'Can I customize fonts, layout, and Canva certificate templates?',
    a: 'Yes. Export any blank certificate design from Canva, Figma, or Illustrator without names, upload it into Step 01, and customize field placement, colors, letter spacing, Auto-fit sizing, transparent PNG signatures, or your own .ttf/.otf brand font.',
  },
  {
    q: 'Does it handle long names?',
    a: 'Yes. Turn on Auto-fit in Step 03 and drag the text box wide across your template. Any name that exceeds the box scales down proportionally to stay inside your margins, and you can preview the longest name in your sheet before exporting.',
  },
  {
    q: 'Does it support Telugu, Hindi, or other non-English names?',
    a: 'Yes. Standard PDF fonts only cover English ASCII glyphs, so CertBee renders Telugu, Hindi (Devanagari), and other complex scripts with native browser shaping so ligatures and matras stay intact. You can also upload custom .ttf or .otf fonts in Step 03.',
  },
  {
    q: 'What is the print quality?',
    a: 'Vector PDF and SVG templates keep borders, logos, and typed names sharp at any print size. For PNG or JPG artwork, export at 3508 × 2480 px (300 DPI for A4) and CertBee embeds that full resolution into each PDF.',
  },
  {
    q: 'How much does it cost, and is there any catch?',
    a: 'Nothing—it is 100% free with zero watermarks and no account required. Built by a Google Student Ambassador for campus events and workshops, all PDF and ZIP rendering runs inside your browser tab instead of backend servers.',
  },
  {
    q: 'How many certificates can I export in one batch?',
    a: 'Because processing runs inside browser memory, dozens up to ~200–300 PDFs bundle smoothly into one ZIP archive. For 500 or more participants, split your CSV into batches of ~200 rows.',
  },
];
