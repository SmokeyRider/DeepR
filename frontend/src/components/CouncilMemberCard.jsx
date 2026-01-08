import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function CouncilMemberCard({ member, isLoading, delay = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div 
        className="card border-l-4 animate-pulse"
        style={{ 
          borderLeftColor: member?.color || '#8b5cf6',
          animationDelay: `${delay}ms`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-deepr-border flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-deepr-accent" />
            </div>
            <div>
              <div className="h-5 bg-deepr-border rounded w-32 mb-2" />
              <div className="h-3 bg-deepr-border rounded w-24" />
            </div>
          </div>
          <div className="h-6 bg-deepr-border rounded w-16" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-deepr-border rounded w-full" />
          <div className="h-3 bg-deepr-border rounded w-5/6" />
          <div className="h-3 bg-deepr-border rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!member) return null;

  const confidenceColor = member.confidence >= 85 
    ? 'text-deepr-success' 
    : member.confidence >= 70 
      ? 'text-deepr-warning' 
      : 'text-deepr-error';

  return (
    <div 
      className="card card-hover border-l-4 animate-slide-up"
      style={{ 
        borderLeftColor: member.color,
        animationDelay: `${delay}ms`
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: member.color }}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-deepr-text">{member.name}</h3>
            <p className="text-sm text-deepr-text-muted">{member.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${confidenceColor}`} />
          <span className={`font-semibold ${confidenceColor}`}>
            {member.confidence}%
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-deepr-text leading-relaxed">
          {member.summary || <span className="italic text-deepr-text-muted">No summary available</span>}
        </p>
      </div>

      {/* Expandable Reasoning */}
      <div className="border-t border-deepr-border pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-deepr-accent hover:text-deepr-accent-hover transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide detailed reasoning
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show detailed reasoning
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 bg-deepr-bg rounded-lg animate-fade-in">
            <MarkdownRenderer content={member.reasoning} />
          </div>
        )}
      </div>
    </div>
  );
}
