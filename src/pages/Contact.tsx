import { Check, Copy, ExternalLink, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import { SITE_CONFIG } from '../config/site';
import { usePageReveal } from '../hooks/usePageReveal';

const CONTACT_EMAIL = SITE_CONFIG.contactEmail;

export function Contact() {
  const [copied, setCopied] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  usePageReveal(mainRef);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8 sm:py-16 space-y-8">
        <div data-page-reveal className="space-y-3">
          <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#F6C844] px-3 py-1 font-mono-tabular text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]">
            Contact
          </span>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]"
            style={{ textWrap: 'balance' }}
          >
            Questions, bug reports, or feedback
          </h1>
          <p className="text-base leading-relaxed text-[#4B5263]">
            Running an institutional event or spotted a rendering edge case? Write directly or open an issue on GitHub—no contact forms required.
          </p>
        </div>

        <div
          data-page-reveal
          className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 shadow-[4px_4px_0_#12151E] space-y-5"
        >
          <div className="space-y-1.5">
            <p className="font-mono-tabular text-xs font-semibold text-[#525866]">
              Direct email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block font-display text-xl sm:text-2xl font-bold text-[#12151E] hover:text-[#2563EB] transition-colors duration-150 break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <p className="text-sm leading-relaxed text-[#4B5263]">
            Available for template compatibility questions, batch workflow feedback, privacy inquiries, or copyright/trademark and legal notices.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CertBee Inquiry')}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-5 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <Mail className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} aria-hidden="true" />
              <span>Send email</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex h-10 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:bg-[#F3F1EA] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#10B981]" strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-[#4B5263]" strokeWidth={1.75} aria-hidden="true" />
              )}
              <span>{copied ? 'Email copied' : 'Copy address'}</span>
            </button>

            <a
              href={`${SITE_CONFIG.githubUrl}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border-[1.5px] border-[#12151E] bg-[#FAF9F5] px-4 text-xs sm:text-sm font-semibold text-[#12151E] hover:bg-[#FFF4CC] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <span>GitHub Issues</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
