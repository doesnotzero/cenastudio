/**
 * GlobalProgressBar - Premium loading indicator
 *
 * Shows a progress bar at the top of the screen with percentage
 * Replaces the ugly current loading states
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface GlobalProgressBarProps {
  isLoading: boolean;
  progress?: number; // 0-100, if not provided will animate automatically
}

export function GlobalProgressBar({ isLoading, progress }: GlobalProgressBarProps) {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setInternalProgress(0);
      return;
    }

    // If progress is provided, use it
    if (progress !== undefined) {
      setInternalProgress(progress);
      return;
    }

    // Otherwise, simulate progress
    setInternalProgress(0);

    // Fast start (0-50% in 500ms)
    const timer1 = setTimeout(() => setInternalProgress(50), 500);

    // Slow middle (50-90% in 2s)
    const timer2 = setTimeout(() => setInternalProgress(70), 1500);
    const timer3 = setTimeout(() => setInternalProgress(90), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoading, progress]);

  const displayProgress = progress !== undefined ? progress : internalProgress;

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-frame-orange via-frame-orange to-frame-orange/50"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: displayProgress / 100,
              opacity: 1
            }}
            exit={{
              scaleX: 1,
              opacity: 0,
              transition: { duration: 0.3 }
            }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Glow Effect */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gradient-to-r from-transparent via-frame-orange/20 to-transparent blur-sm"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: displayProgress / 100,
              opacity: 0.6
            }}
            exit={{ opacity: 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Percentage Badge (optional, only show if >0) */}
          {displayProgress > 0 && (
            <motion.div
              className="fixed top-2 right-4 z-[10000] px-2 py-1 bg-frame-gray-1 border border-frame-orange/30 rounded text-xs font-frame-mono text-frame-orange"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {Math.round(displayProgress)}%
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to control global progress
 */
export function useGlobalProgress() {
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

  return {
    isLoading,
    progress,
    startProgress,
    updateProgress,
    completeProgress,
    stopProgress,
    ProgressBar: () => <GlobalProgressBar isLoading={isLoading} progress={progress} />
  };
}
