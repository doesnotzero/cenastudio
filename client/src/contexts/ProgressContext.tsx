/**
 * ProgressContext - Global progress state management
 *
 * Allows any component to trigger/update the global progress bar
 */

import { createContext, useContext, useState, ReactNode } from "react";
import { GlobalProgressBar } from "@/components/GlobalProgressBar";

interface ProgressContextType {
  isLoading: boolean;
  progress: number;
  startProgress: () => void;
  updateProgress: (value: number) => void;
  completeProgress: () => void;
  stopProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startProgress = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const updateProgress = (value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const completeProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  const stopProgress = () => {
    setIsLoading(false);
    setProgress(0);
  };

  return (
    <ProgressContext.Provider
      value={{
        isLoading,
        progress,
        startProgress,
        updateProgress,
        completeProgress,
        stopProgress,
      }}
    >
      <GlobalProgressBar isLoading={isLoading} progress={progress} />
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
