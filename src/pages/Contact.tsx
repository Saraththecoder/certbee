import { Check, Copy, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import { usePageReveal } from '../hooks/usePageReveal';

const CONTACT_EMAIL = 'sarathkumar86518@gmail.com';

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
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16 space-y-8">
        <div data-page-reveal className="space-y-3">
          <p className="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Contact
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414]"
            style={{ textWrap: 'balance' }}
          >
            Questions, bug reports, or feedback
          </h1>
          <p className="text-base leading-relaxed text-[#52525B]">
            Running an institutional event or spotted a rendering edge case? Write directly at any time—no contact forms required.
          </p>
        </div>

        <div data-page-reveal className="rounded-sm border-[1.5px] border-[#141414] bg-white p-6 sm:p-8 shadow-[5px_5px_0_#141414] space-y-5">
          <div className="space-y-1.5">
            <p className="font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
              Direct email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block font-display text-xl sm:text-2xl font-bold text-[#141414] hover:text-[#2563EB] transition-colors break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <p className="text-sm leading-relaxed text-[#52525B]">
            Available for template compatibility questions, batch workflow feedback, and general support inquiries.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CertBee Inquiry')}`}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[3px_3px_0_#2563EB] whitespace-nowrap shrink-0"
            >
              <Mail className="h-4 w-4 text-[#F6C33E]" />
              <span>Send email</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#FBFBF8] px-4 py-2.5 font-mono-tabular text-xs font-semibold text-[#141414] hover:bg-[#F6C33E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#1FA971]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copied ? 'Email copied' : 'Copy address'}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
