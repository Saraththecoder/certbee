import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { BatchWorkspaceProvider, useBatchWorkspace } from './hooks/useBatchWorkspace';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { CreateBatch } from './pages/CreateBatch';
import { Guide } from './pages/Guide';
import { Home } from './pages/Home';

function NotFoundPage() {
  const { navigate, startEmptyBatch } = useBatchWorkspace();
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-sm border-[1.5px] border-[#141414] bg-white p-7 sm:p-10 space-y-5 shadow-[5px_5px_0_#141414]">
        <span className="inline-block rounded-sm border border-[#141414] bg-[#F6C33E] px-2.5 py-1 font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#141414]">
          404 · Page not found
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#141414]">
          This route doesn&apos;t exist.
        </h1>
        <p className="text-sm leading-relaxed text-[#52525B]">
          The page you opened may have moved or the URL has a typo. Head back to the home sheet or open the certificate studio directly.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-2.5 text-xs font-bold text-[#141414] hover:bg-[#F3F1EA] transition-colors"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={() => startEmptyBatch()}
            className="rounded-sm border-[1.5px] border-[#141414] bg-[#141414] px-5 py-2.5 font-mono-tabular text-xs font-bold tracking-wider text-white hover:bg-[#27272A] transition-colors shadow-[2px_2px_0_#2563EB]"
          >
            OPEN CERTIFICATE TOOL →
          </button>
        </div>
      </div>
    </main>
  );
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { navigate } = useBatchWorkspace();
  return (
    <main className="min-h-[75vh]">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-block rounded-sm border border-[#141414] bg-[#C8EFE0] px-2.5 py-1 font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#141414]">
            {kind === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
          </span>
          <span className="font-mono-tabular text-xs text-[#52525B]">
            Effective Date: November 14, 2026 · Last Updated: November 14, 2026
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
          {kind === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
        </h1>
        {kind === 'privacy' ? (
          <div className="rounded-lg border-[1.5px] border-[#141414] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#52525B] shadow-[4px_4px_0_#141414]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                1. Local Browser Processing
              </h2>
              <p>
                CertBee operates as a client-side application. Uploaded certificate templates (PNG, JPG, SVG, PDF), handwritten signature images, custom TTF/OTF fonts, imported CSV/Excel participant spreadsheets, field layouts, and exported PDF/ZIP archives are processed inside your browser memory and stored only in your device&apos;s local IndexedDB database.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                2. Zero Server Collection
              </h2>
              <p>
                CertBee does not upload, transmit, store, log, or sell recipient names, email addresses, certificate artwork, or generated documents to remote servers. No user accounts, tracking pixels, or behavioral analytics cookies are required to run the certificate studio.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                3. Public Google Sheets &amp; Typography Assets
              </h2>
              <p>
                When you paste a public Google Sheets link in Step 02, your browser makes a direct, read-only request to Google&apos;s public CSV export endpoint for that spreadsheet tab—CertBee never receives OAuth credentials or private Drive access. Built-in editorial stylesheets load from Google Fonts, while vector PDF font embedding uses static font files served alongside the app.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                4. Draft Retention &amp; Data Deletion
              </h2>
              <p>
                Your active batch draft persists locally in IndexedDB solely so refreshing the browser does not lose your layout. You may permanently erase all locally stored draft assets at any moment via the &ldquo;New batch&rdquo; reset control in the workflow header or by clearing site storage in your browser settings.
              </p>
            </section>
          </div>
        ) : (
          <div className="rounded-lg border-[1.5px] border-[#141414] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#52525B] shadow-[4px_4px_0_#141414]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                1. Permitted Use &amp; Content Ownership
              </h2>
              <p>
                CertBee is provided free of charge for generating event, course, workshop, hackathon, institutional, and participation certificates. You retain full copyright and ownership over all templates, signatures, participant rosters, and exported PDF certificates you create.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                2. Asset &amp; Font Licensing Responsibility
              </h2>
              <p>
                When uploading custom artwork, signature images, or third-party `.ttf`/`.otf` font files for embedding into PDFs, you represent that you hold the necessary usage rights or licenses to embed and distribute those assets within your issued certificates.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                3. Batch Verification Before Distribution
              </h2>
              <p>
                Because rendering runs locally inside your browser, you are responsible for verifying recipient spelling, field alignment, auto-fit scaling on long names, and exported sample PDFs prior to distributing certificates at scale.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-bold text-[#141414]">
                4. Warranty Disclaimer
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
            className="rounded-md border-[1.5px] border-[#141414] bg-[#F6C33E] px-4 py-2 text-sm font-semibold text-[#141414] hover:bg-[#f2b824] transition-colors shadow-[2px_2px_0_#141414]"
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
    <div className="min-h-screen flex flex-col overflow-x-clip notebook-ruled-sheet text-[#141414]">
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
