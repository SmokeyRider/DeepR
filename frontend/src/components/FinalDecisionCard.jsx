import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function FinalDecisionCard({ decision, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div className="card border-2 border-deepr-warning/50 bg-gradient-to-br from-deepr-card to-deepr-warning/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-deepr-warning/20 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-deepr-warning" />
          </div>
          <div>
            <div className="h-6 bg-deepr-border rounded w-56 mb-2" />
            <div className="h-4 bg-deepr-border rounded w-40" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-deepr-border rounded w-full" />
          <div className="h-4 bg-deepr-border rounded w-5/6" />
          <div className="h-4 bg-deepr-border rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!decision) return null;

  return (
    <div className="card border-2 border-deepr-warning/50 bg-gradient-to-br from-deepr-card to-deepr-warning/5 animate-slide-up glow-success">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-deepr-warning to-deepr-success rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-deepr-text">{decision.title || 'Final Decision'}</h2>
            <p className="text-sm text-deepr-text-muted">{decision.role}</p>
          </div>
        </div>
      </div>

      {/* Revisions Made */}
      {decision.revisions && decision.revisions.length > 0 && (
        <div className="mb-6 p-4 bg-deepr-bg rounded-lg">
          <h3 className="text-sm font-semibold text-deepr-text mb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-deepr-success" />
            Key Revisions Made
          </h3>
          <div className="space-y-3">
            {decision.revisions.map((rev, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded bg-deepr-success/20 text-deepr-success flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <div>
                  <span className="text-deepr-text-muted line-through">{rev.from}</span>
                  <span className="mx-2 text-deepr-text-muted">→</span>
                  <span className="text-deepr-text font-medium">{rev.to}</span>
                  <p className="text-xs text-deepr-text-muted mt-1">Reason: {rev.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Decision Content */}
      <div className="border-t border-deepr-border pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-deepr-accent hover:text-deepr-accent-hover transition-colors mb-4"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide full decision
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show full decision
            </>
          )}
        </button>

        {isExpanded && (
          <div className="animate-fade-in">
            <MarkdownRenderer content={decision.content} />
          </div>
        )}
      </div>
    </div>
  );
}
