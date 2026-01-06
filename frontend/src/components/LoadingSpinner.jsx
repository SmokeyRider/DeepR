import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-deepr-accent`} />
      {text && <span className="text-deepr-text-muted text-sm">{text}</span>}
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-deepr-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-deepr-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-deepr-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function PulsingCard({ children, className = '' }) {
  return (
    <div className={`card animate-pulse ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-deepr-border rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-deepr-border rounded w-3/4" />
          <div className="h-3 bg-deepr-border rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-deepr-border rounded" />
        <div className="h-3 bg-deepr-border rounded w-5/6" />
        <div className="h-3 bg-deepr-border rounded w-4/6" />
      </div>
      {children}
    </div>
  );
}

export function ThinkingIndicator({ name = 'AI' }) {
  return (
    <div className="flex items-center gap-3 text-deepr-text-muted">
      <div className="relative">
        <div className="w-8 h-8 bg-deepr-accent/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-deepr-accent" />
        </div>
        <div className="absolute inset-0 bg-deepr-accent/10 rounded-full animate-ping" />
      </div>
      <span className="text-sm">{name} is thinking...</span>
    </div>
  );
}
