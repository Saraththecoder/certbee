export interface FAQItem {
  q: string;
  a: string;
}

export const HOME_FAQ_ITEMS: FAQItem[] = [
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
    q: 'Why is it free, and what is the catch?',
    a: 'None. It was built by a Google Student Ambassador for ambassador programs, student clubs, and campus events. Because all PDF and ZIP generation runs inside your browser tab instead of backend servers, there are no accounts, no watermarks, and participant lists never reach our servers (optional Google Sheets links fetch directly from Google in your browser).',
  },
  {
    q: 'How many certificates can I export in one batch?',
    a: 'Because processing runs inside browser memory, dozens up to ~200–300 PDFs bundle smoothly into one ZIP archive. For 500 or more participants, split your CSV into batches of ~200 rows.',
  },
];
