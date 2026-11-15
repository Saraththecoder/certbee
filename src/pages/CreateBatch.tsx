import { CertificateCanvas } from '../components/CertificateCanvas';
import { GenerationProgress } from '../components/GenerationProgress';
import { ParticipantTable } from '../components/ParticipantTable';
import { StepIndicator } from '../components/StepIndicator';
import { UploadZone } from '../components/UploadZone';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';

export function CreateBatch() {
  const { step } = useBatchWorkspace();

  return (
    <main className="min-h-[calc(100vh-116px)] text-[#141414]">
      <StepIndicator />
      {step === 1 && <UploadZone />}
      {step === 2 && <ParticipantTable />}
      {step === 3 && <CertificateCanvas />}
      {step === 4 && <GenerationProgress />}
    </main>
  );
}
