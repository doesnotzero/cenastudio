/**
 * VideoTimeline Component
 *
 * Enhanced video timeline with comment markers, hover preview, and precise seeking
 */

import { useRef, useState, useCallback, useMemo } from "react";
import { MessageSquare, CheckCircle2 } from "lucide-react";

export interface CommentMarker {
  id: number;
  timestampSeconds: number;
  comment: string;
  resolved: boolean;
  authorName: string;
}

export interface VideoTimelineProps {
  /** Current playback time in seconds */
  currentTime: number;

  /** Total duration in seconds */
  duration: number;

  /** Array of comment markers to display */
  markers?: CommentMarker[];

  /** Callback when user seeks to a new time */
  onSeek?: (seconds: number) => void;

  /** Callback when user clicks a marker */
  onMarkerClick?: (marker: CommentMarker) => void;

  /** Whether the video is currently playing */
  isPlaying?: boolean;

  /** Buffered ranges (for showing loaded portions) */
  buffered?: TimeRanges | null;
}

export function VideoTimeline({
  currentTime,
  duration,
  markers = [],
  onSeek,
  onMarkerClick,
  isPlaying,
  buffered,
}: VideoTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate buffered percentage
  const bufferedRanges = useMemo(() => {
    if (!buffered || !duration) return [];

    const ranges: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push({
        start: (buffered.start(i) / duration) * 100,
        end: (buffered.end(i) / duration) * 100,
      });
    }
    return ranges;
  }, [buffered, duration]);

  // Get time from mouse position
  const getTimeFromPosition = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;

    return percentage * duration;
  }, [duration]);

  // Handle seeking
  const handleSeek = useCallback((clientX: number) => {
    const time = getTimeFromPosition(clientX);
    if (onSeek) onSeek(time);
  }, [getTimeFromPosition, onSeek]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  }, [handleSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setHoverPosition(percentage);
    setHoverTime(getTimeFromPosition(e.clientX));

    if (isDragging) {
      handleSeek(e.clientX);
    }
  }, [isDragging, handleSeek, getTimeFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);
  }, [handleSeek]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      handleSeek(e.touches[0].clientX);
    }
  }, [isDragging, handleSeek]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-2">
      {/* Time Display */}
      <div className="flex items-center justify-between text-xs text-frame-gray-light font-frame-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Timeline Container */}
      <div className="relative group">
        {/* Hover Time Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-8 transform -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded pointer-events-none z-10"
            style={{ left: `${hoverPosition}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Main Timeline */}
        <div
          ref={timelineRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative h-2 bg-frame-gray-3 rounded-full cursor-pointer overflow-visible"
        >
          {/* Buffered Ranges */}
          {bufferedRanges.map((range, index) => (
            <div
              key={index}
              className="absolute h-full bg-frame-gray-4 rounded-full"
              style={{
                left: `${range.start}%`,
                width: `${range.end - range.start}%`,
              }}
            />
          ))}

          {/* Progress Bar */}
          <div
            className="absolute h-full bg-frame-orange rounded-full transition-all"
            style={{ width: `${progress}%` }}
          >
            {/* Playhead */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-frame-orange" />
          </div>

          {/* Comment Markers */}
          {markers.map((marker) => {
            const position = duration > 0 ? (marker.timestampSeconds / duration) * 100 : 0;

            return (
              <button
                key={marker.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMarkerClick) onMarkerClick(marker);
                }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group/marker"
                style={{ left: `${position}%` }}
                title={`${marker.authorName}: ${marker.comment}`}
              >
                {/* Marker Visual */}
                <div className={`
                  w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all
                  group-hover/marker:scale-125
                  ${marker.resolved
                    ? 'bg-green-500'
                    : 'bg-yellow-400'
                  }
                `}>
                  {marker.resolved ? (
                    <CheckCircle2 className="w-2 h-2 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  ) : (
                    <MessageSquare className="w-2 h-2 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/95 text-white text-xs rounded px-3 py-2 whitespace-nowrap max-w-xs">
                    <p className="font-semibold mb-1">{marker.authorName}</p>
                    <p className="text-frame-gray-light truncate">{marker.comment}</p>
                    <p className="text-[0.65rem] text-frame-gray-light/60 mt-1">
                      {formatTime(marker.timestampSeconds)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments Count */}
      {markers.length > 0 && (
        <div className="flex items-center gap-3 text-[0.65rem] text-frame-gray-light">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-yellow-400" />
            <span>{markers.filter(m => !m.resolved).length} pendentes</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>{markers.filter(m => m.resolved).length} resolvidos</span>
          </div>
        </div>
      )}
    </div>
  );
}
