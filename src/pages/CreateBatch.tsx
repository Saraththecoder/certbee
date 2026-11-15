import { useEffect, useRef } from 'react';
import { CertificateCanvas } from '../components/CertificateCanvas';
import { GenerationProgress } from '../components/GenerationProgress';
import { ParticipantTable } from '../components/ParticipantTable';
import { StepIndicator } from '../components/StepIndicator';
import { UploadZone } from '../components/UploadZone';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { usePageReveal } from '../hooks/usePageReveal';

const EDITOR_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Playfair+Display:wght@500;600;700&display=swap';

export function CreateBatch() {
  const { step } = useBatchWorkspace();
  const stepPanelRef = useRef<HTMLDivElement | null>(null);

  usePageReveal(stepPanelRef, [step]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.querySelector('link[data-certbee-editor-fonts="true"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = EDITOR_FONTS_HREF;
    link.setAttribute('data-certbee-editor-fonts', 'true');
    document.head.appendChild(link);
  }, []);

  return (
    <main className="min-h-[calc(100vh-116px)] text-[#141414]">
      <StepIndicator />
      <div ref={stepPanelRef}>
        {step === 1 && <UploadZone />}
        {step === 2 && <ParticipantTable />}
        {step === 3 && <CertificateCanvas />}
        {step === 4 && <GenerationProgress />}
      </div>
    </main>
  );
}
