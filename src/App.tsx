import { useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { BatchWorkspaceProvider, useBatchWorkspace } from './hooks/useBatchWorkspace';
import { usePageReveal } from './hooks/usePageReveal';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { CreateBatch } from './pages/CreateBatch';
import { Guide } from './pages/Guide';
import { Home } from './pages/Home';

function NotFoundPage() {
  const { navigate, startEmptyBatch } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);
  usePageReveal(mainRef);
  return (
    <main ref={mainRef} className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div data-page-reveal className="w-full max-w-lg rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 shadow-[4px_4px_0_#12151E]">
        <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#F6C844] px-3 py-1 font-mono-tabular text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]">
          404 · Page not found
        </span>
        <h1 className="font-display text-3xl font-bold tracking-[-0.025em] text-[#12151E]">
          This route doesn&apos;t exist
        </h1>
        <p className="text-sm leading-relaxed text-[#4B5263]">
          The page you opened may have moved or the URL has a typo. Head back to the home page or open the certificate studio directly.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:bg-[#F3F1EA] transition-colors duration-150 cursor-pointer"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={() => startEmptyBatch()}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-4 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:bg-[#1E2333] transition-colors duration-150 cursor-pointer"
          >
            Start a batch →
          </button>
        </div>
      </div>
    </main>
  );
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { navigate } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);
  usePageReveal(mainRef, [kind]);
  return (
    <main ref={mainRef} className="min-h-[75vh]">
      <div data-page-reveal className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-block rounded-md border-[1.5px] border-[#12151E] bg-[#F6C844] px-3 py-1 font-mono-tabular text-xs font-semibold text-[#12151E] shadow-[2px_2px_0_#12151E]">
            {kind === 'privacy' ? 'Privacy policy' : 'Terms of use'}
          </span>
          <span className="text-xs font-mono-tabular tabular-nums text-[#6B7280]">
            Effective November 14, 2026
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]">
          {kind === 'privacy' ? 'Privacy policy' : 'Terms of use'}
        </h1>
        {kind === 'privacy' ? (
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#4B5263] shadow-[4px_4px_0_#12151E]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                1. Local browser processing
              </h2>
              <p>
                CertBee operates as a client-side application. Uploaded certificate templates (PNG, JPG, SVG, PDF), handwritten signature images, custom TTF/OTF fonts, imported CSV/Excel participant spreadsheets, field layouts, and exported PDF/ZIP archives are processed inside your browser memory and stored only in your device&apos;s local IndexedDB database.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                2. Zero server collection
              </h2>
              <p>
                CertBee does not upload, transmit, store, log, or sell recipient names, email addresses, certificate artwork, or generated documents to remote servers. No user accounts, tracking pixels, or behavioral analytics cookies are required to run the certificate studio.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                3. Public Google Sheets &amp; typography assets
              </h2>
              <p>
                When you paste a public Google Sheets link in Step 02, your browser makes a direct, read-only request to Google&apos;s public CSV export endpoint for that spreadsheet tab—CertBee never receives OAuth credentials or private Drive access. Built-in editorial stylesheets load from Google Fonts, while vector PDF font embedding uses static font files served alongside the app.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                4. Draft retention &amp; data deletion
              </h2>
              <p>
                Your active batch draft persists locally in IndexedDB solely so refreshing the browser does not lose your layout. You may permanently erase all locally stored draft assets at any moment via the &ldquo;New batch&rdquo; reset control in the workflow header or by clearing site storage in your browser settings.
              </p>
            </section>
          </div>
        ) : (
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#4B5263] shadow-[4px_4px_0_#12151E]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                1. Permitted use &amp; content ownership
              </h2>
              <p>
                CertBee is provided free of charge for generating event, course, workshop, hackathon, institutional, and participation certificates. You retain full copyright and ownership over all templates, signatures, participant rosters, and exported PDF certificates you create.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                2. Asset &amp; font licensing responsibility
              </h2>
              <p>
                When uploading custom artwork, signature images, or third-party `.ttf`/`.otf` font files for embedding into PDFs, you represent that you hold the necessary usage rights or licenses to embed and distribute those assets within your issued certificates.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                3. Batch verification before distribution
              </h2>
              <p>
                Because rendering runs locally inside your browser, you are responsible for verifying recipient spelling, field alignment, auto-fit scaling on long names, and exported sample PDFs prior to distributing certificates at scale.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                4. Warranty disclaimer
              </h2>
              <p>
                CertBee is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted availability or fitness for a particular regulatory certification standard.
              </p>
            </section>
          </div>
        )}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:bg-[#F3F1EA] transition-colors duration-150 cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </div>
    </main>
  );
}

function AppShell() {
  const { route, step } = useBatchWorkspace();
  const isStudioEditor = route === 'create' && step === 3;
  const hideFooter = isStudioEditor;

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip certbee-surface-bg text-[#12151E]">
      <Navbar />
      <div className="flex-1 w-full">
        {route === 'home' && <Home />}
        {route === 'create' && <CreateBatch />}
        {route === 'about' && <About />}
        {route === 'guide' && <Guide />}
        {route === 'blog' && <Blog />}
        {route === 'contact' && <Contact />}
        {route === 'privacy' && <LegalPage kind="privacy" />}
        {route === 'terms' && <LegalPage kind="terms" />}
        {route === 'not-found' && <NotFoundPage />}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BatchWorkspaceProvider>
        <AppShell />
      </BatchWorkspaceProvider>
    </ErrorBoundary>
  );
}
