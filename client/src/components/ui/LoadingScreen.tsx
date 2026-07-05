import { cn } from "@/lib/utils";

interface ProgressBarProps {
  className?: string;
  progress?: number;
  message?: string;
}

export function ProgressBar({ className, progress = 0, message }: ProgressBarProps) {
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 h-1 bg-ds-surface-3 overflow-hidden", className)}>
      <div 
        className="h-full bg-ds-orange transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}

interface LoadingScreenProps {
  className?: string;
  message?: string;
  progress?: number;
}

export function LoadingScreen({ className, message = "Carregando...", progress }: LoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-ds-surface-0",
      className
    )}>
      {progress !== undefined ? (
        <div className="w-full max-w-md px-ds-space-8">
          <ProgressBar progress={progress} />
          {message && (
            <p className="mt-ds-space-4 text-ds-text-2 text-sm text-center">{message}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-ds-space-6">
          <div className="w-12 h-12 border-2 border-ds-surface-3 border-t-ds-orange rounded-full animate-spin" />
          {message && (
            <p className="text-ds-text-2 text-sm">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-ds-space-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-3 bg-ds-surface-2 rounded-full animate-pulse",
            i === lines - 1 ? "w-5/6" : "w-full"
          )} 
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}