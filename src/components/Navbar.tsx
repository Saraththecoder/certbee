import { ArrowRight, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { PageRoute } from '../types/certificate';
import { CertBeeLogo } from './CertBeeLogo';

type NavTarget = Exclude<PageRoute, 'not-found'>;

export function Navbar() {
  const { route, navigate, startEmptyBatch } = useBatchWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ label: string; target: NavTarget }> = [
    { label: 'Tool', target: 'create' },
    { label: 'Guide', target: 'guide' },
    { label: 'Blog', target: 'blog' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent, target: NavTarget) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setMobileOpen(false);
    if (target === 'create' && route !== 'create') {
      startEmptyBatch();
    } else {
      navigate(target);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-[#12151E] bg-[#FAF9F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href={getRoutePath('home')}
          onClick={(e) => handleLinkClick(e, 'home')}
          aria-label="CertBee Home"
          className="inline-flex items-center whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E] rounded-lg"
        >
          <CertBeeLogo size="md" />
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const active = route === item.target;
            return (
              <a
                key={item.target}
                href={getRoutePath(item.target)}
                onClick={(e) => handleLinkClick(e, item.target)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 px-1 py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12151E] rounded ${
                  active
                    ? 'text-[#12151E] underline decoration-[#F6C844] decoration-2 underline-offset-4'
                    : 'text-[#4B5263] hover:text-[#12151E] hover:underline hover:decoration-[#12151E]/40 hover:underline-offset-4'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={getRoutePath('create')}
            onClick={(e) => handleLinkClick(e, 'create')}
            className="group hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-4 text-xs font-semibold text-white shadow-[2px_2px_0_#F6C844] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#1E2333] transition-[background-color,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Start a batch</span>
            <ArrowRight
              className="h-3.5 w-3.5 text-[#F6C844] transition-transform duration-150 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border-[1.5px] border-[#12151E] bg-white text-[#12151E] shadow-[2px_2px_0_#12151E] hover:bg-[#F3F1EA] active:translate-y-0.5 transition-[background-color,transform] duration-150"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? 'grid-rows-[1fr] opacity-100 border-t-[1.5px] border-[#12151E]' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        } bg-[#FAF9F5]`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-4 space-y-1.5">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={getRoutePath(item.target)}
                onClick={(e) => handleLinkClick(e, item.target)}
                tabIndex={mobileOpen ? undefined : -1}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  route === item.target
                    ? 'border-[1.5px] border-[#12151E] bg-[#F6C844] text-[#12151E]'
                    : 'text-[#4B5263] hover:bg-[#F3F1EA] hover:text-[#12151E]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={getRoutePath('create')}
              onClick={(e) => handleLinkClick(e, 'create')}
              tabIndex={mobileOpen ? undefined : -1}
              className="mt-2 flex w-full h-11 items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-4 text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] transition-colors duration-150"
            >
              <span>Start a batch</span>
              <ArrowRight className="h-4 w-4 text-[#F6C844]" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
