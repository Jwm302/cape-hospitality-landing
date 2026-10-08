import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#10213a] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white/10 border border-white/20 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-serif mb-2">Display Recovery</h2>
            <p className="text-xs text-zinc-300 font-light mb-4 leading-relaxed">
              An unexpected render glitch occurred. Click reload below to refresh the portal state cleanly.
            </p>
            {this.state.error && (
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-rose-300 text-left mb-5 overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#b38a54] hover:bg-[#c59b63] text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Cape Hospitality Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
