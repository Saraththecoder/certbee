import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { SITE_CONFIG } from '../config/site';
import { getRoutePath, NavTarget, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { CertBeeLogo } from './CertBeeLogo';

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
          <div className="md:col-span-4 space-y-3">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleNav(e, 'home')}
              aria-label="CertBee Home"
              className="inline-flex items-center transition-opacity duration-150 hover:opacity-85 rounded"
            >
              <CertBeeLogo size="sm" />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-[#4B5263]">
              One design. Every certificate. Free bulk PDF generation processed locally inside your browser.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h2 className="font-mono-tabular text-xs font-semibold text-[#525866]">Product</h2>
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
                  href={getRoutePath('features')}
                  onClick={(e) => handleNav(e, 'features')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('how-it-works')}
                  onClick={(e) => handleNav(e, 'how-it-works')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('guide')}
                  onClick={(e) => handleNav(e, 'guide')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Preparation guide
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="font-mono-tabular text-xs font-semibold text-[#525866]">Workflows</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={getRoutePath('bulk-certificate-generator')}
                  onClick={(e) => handleNav(e, 'bulk-certificate-generator')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Bulk certificate batches
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('canva-certificate-generator')}
                  onClick={(e) => handleNav(e, 'canva-certificate-generator')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  From Canva designs
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('certificate-generator-from-excel')}
                  onClick={(e) => handleNav(e, 'certificate-generator-from-excel')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  From Excel &amp; CSV
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('certificate-generator-from-google-sheets')}
                  onClick={(e) => handleNav(e, 'certificate-generator-from-google-sheets')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  From Google Sheets
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('workshop-certificate-generator')}
                  onClick={(e) => handleNav(e, 'workshop-certificate-generator')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Workshops &amp; training
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('hackathon-certificate-generator')}
                  onClick={(e) => handleNav(e, 'hackathon-certificate-generator')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Hackathons
                </a>
              </li>
              <li>
                <a
                  href={getRoutePath('student-certificate-generator')}
                  onClick={(e) => handleNav(e, 'student-certificate-generator')}
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  Students &amp; clubs
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="font-mono-tabular text-xs font-semibold text-[#525866]">Resources</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
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
              <li>
                <a
                  href={SITE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4B5263] hover:text-[#12151E] transition-colors duration-150"
                >
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#12151E]/15 pt-6 text-xs text-[#525866] sm:flex-row sm:items-center sm:justify-between">
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
