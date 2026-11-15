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
    <footer className="border-t-[1.5px] border-[#12151E] bg-[#FAF9F5] px-4 py-12 sm:px-6 lg:px-8 text-[#12151E]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 space-y-3">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleNav(e, 'home')}
              aria-label="CertBee Home"
              className="inline-flex items-center transition-opacity duration-150 hover:opacity-85"
            >
              <CertBeeLogo size="sm" />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-[#4B5263]">
              One design. Every certificate. Free bulk PDF generation processed locally inside your browser.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono-tabular text-xs font-semibold text-[#6B7280]">Tool</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={getRoutePath('create')}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    startEmptyBatch();
                  }}
                  className="font-semibold text-[#2563EB] hover:text-[#12151E] transition-colors duration-150"
                >
                  Start a batch →
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('home', 'workflow')}
                  onClick={(e) => handleNav(e, 'home', 'workflow')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('home', 'faq')}
                  onClick={(e) => handleNav(e, 'home', 'faq')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-mono-tabular text-xs font-semibold text-[#6B7280]">Resources</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <a
                  href={getRoutePath('guide')}
                  onClick={(e) => handleNav(e, 'guide')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Guide
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('blog')}
                  onClick={(e) => handleNav(e, 'blog')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('about')}
                  onClick={(e) => handleNav(e, 'about')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('contact')}
                  onClick={(e) => handleNav(e, 'contact')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('privacy')}
                  onClick={(e) => handleNav(e, 'privacy')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('terms')}
                  onClick={(e) => handleNav(e, 'terms')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#12151E]/15 pt-6 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono-tabular tabular-nums">© {new Date().getFullYear()} CertBee</p>
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span>Participant lists never leave your device</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
