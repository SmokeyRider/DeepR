import { useState } from 'react';
import { Crown, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function ChairmanCard({ chairman, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="card border-2 border-deepr-accent/50 bg-gradient-to-br from-deepr-card to-deepr-accent/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-deepr-accent/20 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-deepr-accent" />
          </div>
          <div>
            <div className="h-6 bg-deepr-border rounded w-48 mb-2" />
            <div className="h-4 bg-deepr-border rounded w-32" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-deepr-border rounded w-full" />
          <div className="h-4 bg-deepr-border rounded w-5/6" />
          <div className="h-4 bg-deepr-border rounded w-4/6" />
          <div className="h-4 bg-deepr-border rounded w-full" />
          <div className="h-4 bg-deepr-border rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!chairman) return null;

  return (
    <div className="card border-2 border-deepr-accent/50 bg-gradient-to-br from-deepr-card to-deepr-accent/5 animate-slide-up glow-accent">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-deepr-accent to-deepr-info rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-deepr-text">Chairman's Synthesis</h2>
              <span className="badge badge-accent text-xs">Final Decision</span>
            </div>
            <p className="text-sm text-deepr-text-muted">Model: {chairman.model}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-deepr-success">
            {chairman.consensusScore}%
          </div>
          <div className="text-sm text-deepr-text-muted">Consensus Score</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-deepr-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-deepr-success" />
            <span className="text-sm font-medium text-deepr-text">Agreements</span>
          </div>
          <ul className="space-y-1">
            {chairman.agreements?.map((point, i) => (
              <li key={i} className="text-sm text-deepr-text-muted flex items-start gap-2">
                <span className="text-deepr-success mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-deepr-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-deepr-warning" />
            <span className="text-sm font-medium text-deepr-text">Disagreements</span>
          </div>
          <ul className="space-y-1">
            {chairman.disagreements?.map((point, i) => (
              <li key={i} className="text-sm text-deepr-text-muted flex items-start gap-2">
                <span className="text-deepr-warning mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Decision */}
      <div className="border-t border-deepr-border pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-deepr-accent hover:text-deepr-accent-hover transition-colors mb-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide full synthesis
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show full synthesis
            </>
          )}
        </button>

        {isExpanded && (
          <div className="animate-fade-in">
            <MarkdownRenderer content={chairman.finalDecision} />
          </div>
        )}
      </div>
    </div>
  );
}
