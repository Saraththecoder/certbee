import { FileSpreadsheet, Image as ImageIcon, ShieldCheck, Zap } from 'lucide-react';

const BENEFIT_CARDS = [
  {
    num: '01',
    title: 'Free & unlimited',
    detail: 'No fee per certificate, no watermark.',
    badgeBg: 'bg-[#C8EFE0] text-[#141414]',
    icon: ShieldCheck,
  },
  {
    num: '02',
    title: 'Your own artwork',
    detail: 'Upload any clean PNG, JPG, SVG, or PDF template.',
    badgeBg: 'bg-[#F6C33E] text-[#141414]',
    icon: ImageIcon,
  },
  {
    num: '03',
    title: 'Any list format',
    detail: 'Import Excel, CSV, pasted names, or Sheets.',
    badgeBg: 'bg-[#EC4899] text-white',
    icon: FileSpreadsheet,
  },
  {
    num: '04',
    title: 'Browser-native',
    detail: 'Names and PDFs never leave your device.',
    badgeBg: 'bg-[#2563EB] text-white',
    icon: Zap,
  },
] as const;

export function BenefitsSection() {
  return (
    <section id="benefits" aria-label="Key benefits" className="px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFIT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.num}
              data-benefit-card
              className="group rounded-sm border-[1.5px] border-[#141414] bg-white p-5 shadow-[3px_3px_0_#141414] flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[5px_5px_0_#141414]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#141414] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 ${card.badgeBg}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono-tabular text-[11px] font-bold text-[#52525B]">
                  {card.num}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-base font-extrabold tracking-tight text-[#141414]">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#52525B]">{card.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
