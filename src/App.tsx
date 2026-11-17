import { lazy, Suspense, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { LANDING_PAGES, LandingRouteKey } from './data/landingPages';
import { BatchWorkspaceProvider, useBatchWorkspace } from './hooks/useBatchWorkspace';
import { usePageReveal } from './hooks/usePageReveal';
import { Home } from './pages/Home';

const CreateBatch = lazy(() =>
  import('./pages/CreateBatch').then((m) => ({ default: m.CreateBatch }))
);
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Guide = lazy(() => import('./pages/Guide').then((m) => ({ default: m.Guide })));
const Blog = lazy(() => import('./pages/Blog').then((m) => ({ default: m.Blog })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);

function RouteLoadingFallback() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="rounded-xl border-[1.5px] border-[#12151E] bg-white px-5 py-3 text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E]">
        Loading workspace…
      </div>
    </main>
  );
}

function NotFoundPage() {
  const { navigate, startEmptyBatch } = useBatchWorkspace();
  const mainRef = useRef<HTMLElement | null>(null);
  usePageReveal(mainRef);
  return (
    <main ref={mainRef} className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div
        data-page-reveal
        className="w-full max-w-lg rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 shadow-[4px_4px_0_#12151E]"
      >
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
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#F3F1EA] transition-[background-color,transform] duration-150 cursor-pointer"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={() => startEmptyBatch()}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-[#12151E] px-4 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_#F6C844] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#1E2333] transition-[background-color,transform] duration-150 cursor-pointer"
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
            {kind === 'privacy' ? 'Privacy policy' : 'Terms of use & acceptable use'}
          </span>
          <span className="text-xs font-mono-tabular tabular-nums text-[#525866]">
            Last updated November 17, 2026
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#12151E]">
          {kind === 'privacy' ? 'Privacy policy' : 'Terms of use & disclaimer'}
        </h1>
        {kind === 'privacy' ? (
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#4B5263] shadow-[4px_4px_0_#12151E]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                1. Local browser processing &amp; zero server uploads
              </h2>
              <p>
                CertBee operates as a client-side web application. Uploaded certificate templates (PNG, JPG, SVG, PDF), signature images, custom `.ttf`/`.otf` fonts, imported CSV/Excel spreadsheets, pasted participant names, field layouts, and exported PDF or ZIP archives are processed directly inside your browser&apos;s memory. CertBee does not operate a backend database for user accounts, templates, participant rosters, or generated certificates, and does not upload, sell, or share your roster files.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                2. Hosting infrastructure &amp; third-party network requests
              </h2>
              <p>
                While your certificate data stays on your device, loading the website and optional external resources involves standard internet requests to third-party infrastructure providers:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-[#12151E]">Static Hosting (Vercel):</strong> Delivering the application assets generates standard web server/CDN access logs (such as IP address, browser User-Agent, timestamp, and requested page path) governed by Vercel&apos;s privacy practices.
                </li>
                <li>
                  <strong className="text-[#12151E]">Google Fonts:</strong> UI typography CSS stylesheets load from Google Fonts when you view pages, which involves standard HTTP requests to Google&apos;s font CDN.
                </li>
                <li>
                  <strong className="text-[#12151E]">Public Google Sheets Import:</strong> Only when you paste a public Google Sheets URL in Step 02 does your browser make a direct, read-only request to Google&apos;s public CSV export endpoint (`export?format=csv`). CertBee never requests Google Workspace OAuth tokens or access to private Drive files.
                </li>
              </ul>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                3. Organizer responsibility as data controller
              </h2>
              <p>
                When you import student, attendee, employee, or participant names and email addresses into CertBee, you act as the sole data controller under applicable privacy laws (including GDPR, CCPA/CPRA, FERPA, and India&apos;s DPDPA). You are solely responsible for ensuring you have a valid legal basis, notice, and any required participant, institutional, or parental consent to process that data and issue certificates.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                4. Browser storage (`IndexedDB`) &amp; data deletion
              </h2>
              <p>
                Active batch drafts (template, table rows, fields, custom fonts) are stored locally in your browser&apos;s `IndexedDB` so refreshing the tab does not wipe your work. Because CertBee does not store copies on remote servers, only you control this data: click &ldquo;New batch&rdquo; in the studio header or clear site data/cookies in your browser settings at any time to permanently erase it from your device.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                5. Optional aggregate analytics &amp; opt-out
              </h2>
              <p>
                Analytics are disabled unless explicitly configured via deployment environment variables (`VITE_GA_MEASUREMENT_ID`). When enabled, analytics are configured to anonymize IPs, disable Google Signals and ad personalization, respect browser Do Not Track (`DNT`) and Global Privacy Control (`GPC`) signals, and allow only non-PII aggregate parameters (such as template format category or batch size bucket). Participant names, emails, sheet links, and uploaded filenames are never included in analytics events.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                6. Children&apos;s privacy
              </h2>
              <p>
                CertBee is a productivity utility intended for event organizers, educators, and coordinators—not children under 13 (or the minimum digital consent age in your jurisdiction). CertBee does not knowingly collect personal information from minors. Schools, clubs, and youth event organizers using CertBee are solely responsible for compliance with applicable student and minor privacy regulations.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                7. Policy updates &amp; privacy contact
              </h2>
              <p>
                We may update this Privacy Policy periodically as the software evolves, indicated by the &ldquo;Last updated&rdquo; date above. For privacy questions, data concerns, or security reports, contact{' '}
                <a
                  href="mailto:sarathkumar86518@gmail.com"
                  className="font-semibold text-[#2563EB] underline underline-offset-2 hover:text-[#12151E]"
                >
                  sarathkumar86518@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        ) : (
          <div className="rounded-xl border-[1.5px] border-[#12151E] bg-white p-6 sm:p-8 space-y-5 text-sm leading-relaxed text-[#4B5263] shadow-[4px_4px_0_#12151E]">
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                1. Acceptance of terms &amp; independent status
              </h2>
              <p>
                By accessing or using CertBee (`https://certbee.vercel.app`), you agree to these Terms of Use. If you do not agree, do not use the service. CertBee is an independent, community-built open-source utility maintained by its author and is provided free of charge.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                2. Acceptable use &amp; prohibition of forgery or fraud
              </h2>
              <p>
                CertBee is intended strictly for legitimate event, workshop, hackathon, club, training, and appreciation certificates. You agree <strong className="text-[#12151E]">not</strong> to use CertBee to create, alter, forge, or distribute:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fake, fraudulent, or unauthorized academic degrees, transcripts, diplomas, or school/university credentials;</li>
                <li>Counterfeit government, regulatory, medical, legal, financial, safety, or professional licensing documents;</li>
                <li>Certificates bearing institutional seals, signatures, logos, or organization names that you are not legally authorized to represent or issue;</li>
                <li>Unlawful, defamatory, deceptive, or infringing content of any kind.</li>
              </ul>
              <p>
                You bear sole legal responsibility for every document you generate or distribute.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                3. Ownership, templates &amp; font licensing
              </h2>
              <p>
                You retain all ownership rights to your original templates, participant lists, and exported PDF certificates. When uploading artwork, logos, signature scans, or third-party `.ttf`/`.otf` fonts into CertBee, you represent and warrant that you hold all required intellectual property rights and embedding/distribution licenses to use those assets.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                4. Third-party trademarks &amp; non-affiliation disclaimer
              </h2>
              <p>
                CertBee is an independent software project and is <strong className="text-[#12151E]">not affiliated with, endorsed by, sponsored by, or officially connected to</strong> Google LLC (including Google Sheets, Google Fonts, or the Google Student Ambassador program), Canva Pty Ltd, Microsoft Corporation (Excel), Figma, Inc., Adobe Inc., or any educational institution or sponsor. All third-party product names, file formats, and trademarks belong to their respective owners and are mentioned solely to describe workflow compatibility.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                5. No credential verification &amp; pre-export review
              </h2>
              <p>
                CertBee is strictly a client-side layout and PDF merge tool—it does not verify attendee identity, attendance, accreditation, or the authenticity of issued certificates. Because rendering depends on your uploaded files and local browser memory (~200–300 PDFs recommended per batch), you are solely responsible for reviewing exported PDFs for spelling, font shaping, alignment, and print quality before distribution or commercial printing.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                6. Disclaimer of warranties
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CERTBEE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, NON-INFRINGEMENT, OR UNINTERRUPTED AVAILABILITY.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                7. Limitation of liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CERTBEE, ITS CREATOR, OR ITS CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, GOODWILL, REPRINTING COSTS, OR EVENT DISRUPTION ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE CERTBEE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BECAUSE CERTBEE IS PROVIDED FREE OF CHARGE, TOTAL AGGREGATE LIABILITY FOR ANY CLAIM SHALL NOT EXCEED $0 USD (OR THE MINIMUM AMOUNT PERMITTED BY LAW).
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                8. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless CertBee, its creator, and its contributors from and against any claims, liabilities, damages, losses, or legal expenses (including reasonable attorneys&apos; fees) arising out of or relating to: (a) certificates, artwork, fonts, or signatures you process or distribute; (b) your breach of these Terms or applicable data-protection laws; or (c) any allegation that your templates or issued certificates infringe third-party rights or misrepresent credentials.
              </p>
            </section>
            <section className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#12151E]">
                9. Changes, severability &amp; takedown / legal contact
              </h2>
              <p>
                We may modify or discontinue features or update these Terms at any time without notice; continued use after updates constitutes acceptance. If any provision is held unenforceable, the remaining provisions remain in full force. To report copyright/trademark concerns, abuse, or legal notices, email{' '}
                <a
                  href="mailto:sarathkumar86518@gmail.com"
                  className="font-semibold text-[#2563EB] underline underline-offset-2 hover:text-[#12151E]"
                >
                  sarathkumar86518@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-white px-4 text-xs sm:text-sm font-semibold text-[#12151E] shadow-[3px_3px_0_#12151E] hover:-translate-y-0.5 active:translate-y-0.5 hover:bg-[#F3F1EA] transition-[background-color,transform] duration-150 cursor-pointer"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={() => navigate(kind === 'privacy' ? 'terms' : 'privacy')}
            className="inline-flex h-10 items-center rounded-lg border-[1.5px] border-[#12151E] bg-[#FAF9F5] px-4 text-xs sm:text-sm font-semibold text-[#12151E] hover:bg-[#FFF4CC] transition-colors duration-150 cursor-pointer"
          >
            {kind === 'privacy' ? 'Read Terms of use →' : 'Read Privacy policy →'}
          </button>
        </div>
      </div>
    </main>
  );
}

function isLandingRouteKey(value: string): value is LandingRouteKey {
  return value in LANDING_PAGES;
}

function AppShell() {
  const { route, blogSlug, step } = useBatchWorkspace();
  const isStudioEditor = route === 'create' && step === 3;
  const hideFooter = isStudioEditor;

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip certbee-surface-bg text-[#12151E]">
      <Navbar />
      <div className="flex-1 w-full">
        <Suspense fallback={<RouteLoadingFallback />}>
          {route === 'home' && <Home />}
          {route === 'create' && <CreateBatch />}
          {isLandingRouteKey(route) && <LandingPage pageKey={route} />}
          {route === 'about' && <About />}
          {route === 'guide' && <Guide />}
          {(route === 'blog' || route === 'blog-post') && <Blog slug={blogSlug} />}
          {route === 'contact' && <Contact />}
          {route === 'privacy' && <LegalPage kind="privacy" />}
          {route === 'terms' && <LegalPage kind="terms" />}
          {route === 'not-found' && <NotFoundPage />}
        </Suspense>
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
