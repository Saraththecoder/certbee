import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';
import React from 'react';
import { clearWorkspaceState } from '../services/storageService';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetDraftAndReload = async () => {
    await clearWorkspaceState();
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen certbee-surface-bg flex items-center justify-center px-5 py-12 text-[#141414]">
        <div className="w-full max-w-lg rounded-sm border-[1.5px] border-[#141414] bg-white p-7 sm:p-9 space-y-5 shadow-[5px_5px_0_#141414]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm border-[1.5px] border-[#141414] bg-[#FEF2F2] text-[#DC2626]">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <p className="font-mono-tabular text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
              Recovery Mode
            </p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#141414]">
              Something went wrong on this screen.
            </h1>
            <p className="text-sm leading-relaxed text-[#52525B]">
              Reload the page to resume your saved draft, or reset the local IndexedDB workspace if a corrupted template or dataset triggered the error.
            </p>
          </div>

          {this.state.message && (
            <p className="rounded-sm border border-[#141414]/20 bg-[#FBFBF8] px-3 py-2 font-mono-tabular text-xs text-[#52525B] break-words">
              {this.state.message}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-[#F6C33E] px-4 py-2.5 text-xs font-bold text-[#141414] hover:bg-[#f2b824] transition-colors shadow-[2px_2px_0_#141414]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reload page</span>
            </button>
            <button
              type="button"
              onClick={this.handleResetDraftAndReload}
              className="inline-flex items-center gap-2 rounded-sm border-[1.5px] border-[#141414] bg-white px-4 py-2.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear saved draft &amp; return home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
