import { ArrowRight, BookOpen, Compass, FileText, Home as HomeIcon, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { getRoutePath, useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { PageRoute } from '../types/certificate';
import { CertBeeLogo } from './CertBeeLogo';

type NavTarget = Exclude<PageRoute, 'not-found'>;

export function Navbar() {
  const { route, navigate, startEmptyBatch } = useBatchWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ label: string; target: NavTarget; icon: typeof HomeIcon }> = [
    { label: 'HOME', target: 'home', icon: HomeIcon },
    { label: 'ABOUT', target: 'about', icon: Compass },
    { label: 'GUIDE', target: 'guide', icon: BookOpen },
    { label: 'BLOG', target: 'blog', icon: FileText },
  ];

  const handleLinkClick = (e: React.MouseEvent, target: NavTarget) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setMobileOpen(false);
    navigate(target);
  };

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-[#141414]/15 bg-[#FBFBF8]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <a
            href={getRoutePath('home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            aria-label="CertBee Home"
            className="inline-flex items-center hover:opacity-90 transition-transform duration-150 hover:-translate-y-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-sm"
          >
            <CertBeeLogo size="md" />
          </a>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = route === item.target;
              return (
                <a
                  key={item.target}
                  href={getRoutePath(item.target)}
                  onClick={(e) => handleLinkClick(e, item.target)}
                  className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-mono-tabular text-[11px] font-semibold tracking-wider whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    active
                      ? 'bg-[#F6C33E] text-[#141414] border border-[#141414] shadow-[2px_2px_0_#141414]'
                      : 'text-[#52525B] hover:text-[#141414] hover:bg-[#141414]/5 border border-transparent'
                  }`}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={getRoutePath('contact')}
            onClick={(e) => handleLinkClick(e, 'contact')}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] px-3 py-1.5 font-mono-tabular text-[11px] font-semibold tracking-wider whitespace-nowrap shrink-0 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${
              route === 'contact'
                ? 'bg-[#F6C33E] text-[#141414] shadow-[2px_2px_0_#141414]'
                : 'bg-white text-[#141414] hover:bg-[#F3F1EA]'
            }`}
          >
            <span>CONTACT</span>
          </a>

          <a
            href={getRoutePath('create')}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setMobileOpen(false);
              if (route === 'create') {
                navigate('create');
              } else {
                startEmptyBatch();
              }
            }}
            className="group hidden sm:inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-3.5 py-1.5 font-mono-tabular text-[11px] font-semibold tracking-wider text-white hover:bg-[#27272A] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 whitespace-nowrap shrink-0 shadow-[2px_2px_0_#2563EB]"
          >
            <span>OPEN TOOL</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#F6C33E] transition-transform duration-150 group-hover:translate-x-0.5" />
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border-[1.5px] border-[#141414] bg-white text-[#141414] hover:bg-[#F6C33E] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t-[1.5px] border-[#141414]/15 bg-[#FBFBF8] px-4 py-4 space-y-1.5">
          {[...navItems, { label: 'CONTACT', target: 'contact' as NavTarget, icon: FileText }].map(
            (item) => (
              <a
                key={item.target}
                href={getRoutePath(item.target)}
                onClick={(e) => handleLinkClick(e, item.target)}
                className={`block w-full text-left px-3.5 py-2.5 rounded-sm font-mono-tabular text-xs font-semibold tracking-wider transition-colors ${
                  route === item.target
                    ? 'bg-[#F6C33E] text-[#141414] border border-[#141414]'
                    : 'text-[#141414] hover:bg-[#141414]/5'
                }`}
              >
                {item.label}
              </a>
            )
          )}
          <a
            href={getRoutePath('create')}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setMobileOpen(false);
              startEmptyBatch();
            }}
            className="mt-2 block w-full rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-4 py-3 text-center font-mono-tabular text-xs font-semibold tracking-wider text-white hover:bg-[#27272A] transition-colors"
          >
            OPEN TOOL →
          </a>
        </div>
      )}
    </header>
  );
}
