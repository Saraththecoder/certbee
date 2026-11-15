import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { PageRoute } from '../types/certificate';
import { CertBeeLogo } from './CertBeeLogo';

type NavTarget = Exclude<PageRoute, 'not-found'>;

export function Footer() {
  const { navigate, startEmptyBatch } = useBatchWorkspace();

  const handleNav = (e: React.MouseEvent, target: NavTarget, hash?: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(target, hash);
  };

  return (
    <footer className="border-t-[1.5px] border-[#141414]/20 px-4 py-10 sm:px-6 lg:px-8 text-[#141414]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-3">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleNav(e, 'home')}
              aria-label="CertBee Home"
              className="inline-flex items-center hover:opacity-90 transition-opacity"
            >
              <CertBeeLogo size="sm" />
            </a>
            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#52525B]">
              One design. Every certificate. Free bulk PDF generation processed locally inside your browser.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Navigate
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href={getRoutePath('home', 'workflow')}
                  onClick={(e) => handleNav(e, 'home', 'workflow')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('home', 'capabilities')}
                  onClick={(e) => handleNav(e, 'home', 'capabilities')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Import formats
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('home', 'faq')}
                  onClick={(e) => handleNav(e, 'home', 'faq')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('create')}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    startEmptyBatch();
                  }}
                  className="font-semibold text-[#2563EB] hover:underline underline-offset-4"
                >
                  Open Certificate Tool
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h3 className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Resources &amp; Legal
            </h3>
            <ul className="grid grid-cols-2 gap-1.5 text-sm">
              <li>
                <a
                  href={getRoutePath('about')}
                  onClick={(e) => handleNav(e, 'about')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('guide')}
                  onClick={(e) => handleNav(e, 'guide')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Guide
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('blog')}
                  onClick={(e) => handleNav(e, 'blog')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('contact')}
                  onClick={(e) => handleNav(e, 'contact')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('privacy')}
                  onClick={(e) => handleNav(e, 'privacy')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('terms')}
                  onClick={(e) => handleNav(e, 'terms')}
                  className="text-[#141414] hover:text-[#2563EB] transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#141414]/15 pt-5 text-xs text-[#52525B] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-tabular">© {new Date().getFullYear()} CertBee.</p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1FA971]" />
            <span>Processed locally on your device.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
