import { Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useBatchWorkspace } from '../hooks/useBatchWorkspace';
import { WorkflowStep } from '../types/certificate';

const STEPS: Array<{ step: WorkflowStep; num: string; label: string }> = [
  { step: 1, num: '01', label: 'Template' },
  { step: 2, num: '02', label: 'Participants' },
  { step: 3, num: '03', label: 'Design' },
  { step: 4, num: '04', label: 'Generate' },
];

export function StepIndicator() {
  const { step, setStep, certificate, participants, resetAllWorkspace } = useBatchWorkspace();
  const [confirmReset, setConfirmReset] = useState(false);

  const hasTemplate = Boolean(certificate.template);
  const hasValidParticipants = Boolean(participants.dataset && !participants.hasBlockingErrors);

  const canJumpTo = (target: WorkflowStep): boolean => {
    if (target <= step) return true;
    if (target === 2) return hasTemplate;
    if (target === 3 || target === 4) return hasTemplate && hasValidParticipants;
    return false;
  };

  return (
    <div className="border-b-[1.5px] border-[#141414]/15 bg-[#F3F1EA]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-7">
        <nav aria-label="Certificate workflow steps" className="flex flex-wrap items-center gap-2 sm:gap-3">
          {STEPS.map((item, idx) => {
            const isCurrent = step === item.step;
            const isComplete =
              (item.step === 1 && hasTemplate && step > 1) ||
              (item.step === 2 && hasValidParticipants && step > 2) ||
              (item.step === 3 && step > 3);
            const reachable = canJumpTo(item.step);

            return (
              <div key={item.step} className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && setStep(item.step)}
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono-tabular text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isCurrent
                      ? 'border-[#141414] bg-[#F6C33E] text-[#141414] shadow-[2px_2px_0_#141414]'
                      : isComplete
                      ? 'border-[#141414] bg-[#C8EFE0] text-[#141414] hover:bg-[#b2e6d1]'
                      : reachable
                      ? 'border-[#141414] bg-white text-[#141414] hover:bg-[#FBFBF8]'
                      : 'border-transparent bg-transparent text-[#71717A] cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs">
                    {isComplete ? <Check className="h-3.5 w-3.5 inline text-[#1FA971]" /> : item.num}
                  </span>
                  <span>{item.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span aria-hidden="true" className="hidden sm:inline text-[#141414]/30">
                    /
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-[#141414] bg-white px-3 py-1.5 font-mono-tabular text-xs font-semibold text-[#141414] hover:bg-[#FBFBF8] transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New batch
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-white px-2.5 py-1 text-xs shadow-[2px_2px_0_#141414]">
              <span className="text-[#141414] font-semibold">Clear current draft?</span>
              <button
                type="button"
                onClick={async () => {
                  await resetAllWorkspace();
                  setConfirmReset(false);
                }}
                className="rounded-sm bg-[#DC2626] px-2 py-0.5 font-semibold text-white hover:bg-[#B91C1C]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-sm border border-[#141414] bg-[#F3F1EA] px-2 py-0.5 font-semibold text-[#141414] hover:bg-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
