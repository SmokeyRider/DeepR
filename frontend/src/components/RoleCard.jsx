import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export function RoleCard({ role, stepNumber, isLoading, delay = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return (
      <div 
        className="card border-l-4 animate-pulse"
        style={{ 
          borderLeftColor: role?.color || '#8b5cf6',
          animationDelay: `${delay}ms`
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-deepr-border flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-deepr-accent" />
            </div>
            <div className="w-0.5 h-full bg-deepr-border mt-2 min-h-[60px]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 bg-deepr-border rounded w-40" />
              <div className="h-4 bg-deepr-border rounded w-24" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-deepr-border rounded w-full" />
              <div className="h-3 bg-deepr-border rounded w-5/6" />
              <div className="h-3 bg-deepr-border rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) return null;

  return (
    <div 
      className="relative animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Connector line */}
      {stepNumber < 5 && (
        <div 
          className="absolute left-5 top-14 w-0.5 h-[calc(100%-40px)] bg-gradient-to-b from-deepr-border to-transparent"
        />
      )}
      
      <div 
        className="card card-hover border-l-4"
        style={{ borderLeftColor: role.color }}
      >
        <div className="flex items-start gap-4">
          {/* Step number and icon */}
          <div className="flex flex-col items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: `${role.color}20` }}
            >
              {role.icon}
            </div>
            <div 
              className="mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{ borderColor: role.color, color: role.color }}
            >
              {stepNumber}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <h3 className="font-semibold text-deepr-text">{role.role}</h3>
              <span className="badge" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                {role.focus}
              </span>
            </div>
            
            {/* Collapsible content */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-deepr-accent hover:text-deepr-accent-hover transition-colors mb-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Expand
                </>
              )}
            </button>
            
            {isExpanded && (
              <div className="animate-fade-in">
                <MarkdownRenderer content={role.content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
