/**
 * VideoControls Component
 *
 * Advanced video player controls with speed, volume, fullscreen, and frame navigation
 */

import { useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Gauge,
  Settings,
} from "lucide-react";

export interface VideoControlsProps {
  /** Whether video is currently playing */
  isPlaying: boolean;

  /** Volume level (0-1) */
  volume: number;

  /** Whether video is muted */
  isMuted: boolean;

  /** Whether in fullscreen mode */
  isFullscreen: boolean;

  /** Current playback speed */
  playbackSpeed: number;

  /** Callback to toggle play/pause */
  onPlayPause: () => void;

  /** Callback to change volume */
  onVolumeChange: (volume: number) => void;

  /** Callback to toggle mute */
  onMuteToggle: () => void;

  /** Callback to toggle fullscreen */
  onFullscreenToggle: () => void;

  /** Callback to change playback speed */
  onSpeedChange: (speed: number) => void;

  /** Callback to skip backward (seconds) */
  onSkipBackward?: (seconds: number) => void;

  /** Callback to skip forward (seconds) */
  onSkipForward?: (seconds: number) => void;

  /** Callback to navigate frame-by-frame */
  onFrameStep?: (direction: 'forward' | 'backward') => void;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SKIP_SECONDS = 10;

export function VideoControls({
  isPlaying,
  volume,
  isMuted,
  isFullscreen,
  playbackSpeed,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onSpeedChange,
  onSkipBackward,
  onSkipForward,
  onFrameStep,
}: VideoControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  }, [onVolumeChange]);

  const handleSpeedSelect = useCallback((speed: number) => {
    onSpeedChange(speed);
    setShowSpeedMenu(false);
  }, [onSpeedChange]);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-black/80 border-t border-frame-gray-3">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          className="w-10 h-10 flex items-center justify-center bg-frame-orange hover:bg-frame-orange/90 rounded transition"
          title={isPlaying ? 'Pausar (Space)' : 'Reproduzir (Space)'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        {/* Skip Backward */}
        {onSkipBackward && (
          <button
            onClick={() => onSkipBackward(SKIP_SECONDS)}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition"
            title={`Voltar ${SKIP_SECONDS}s (←)`}
          >
            <SkipBack className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Skip Forward */}
        {onSkipForward && (
          <button
            onClick={() => onSkipForward(SKIP_SECONDS)}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition"
            title={`Avançar ${SKIP_SECONDS}s (→)`}
          >
            <SkipForward className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Frame Step */}
        {onFrameStep && (
          <>
            <div className="w-px h-6 bg-frame-gray-3 mx-1" />
            <button
              onClick={() => onFrameStep('backward')}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition text-xs font-mono"
              title="Frame anterior (,)"
            >
              {"<"}
            </button>
            <button
              onClick={() => onFrameStep('forward')}
              className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition text-xs font-mono"
              title="Próximo frame (.)"
            >
              {">"}
            </button>
          </>
        )}

        {/* Volume */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={onMuteToggle}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition"
            title={isMuted ? 'Ativar som (M)' : 'Mutar (M)'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Volume Slider */}
          {showVolumeSlider && (
            <div className="absolute left-full ml-2 flex items-center gap-2 px-3 py-2 bg-black/95 border border-frame-gray-3 rounded shadow-lg">
              <VolumeX className="w-3 h-3 text-frame-gray-light" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-frame-gray-3 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-frame-orange
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <Volume2 className="w-3 h-3 text-frame-gray-light" />
              <span className="text-xs font-mono text-white w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Playback Speed */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1.5 px-3 py-2 hover:bg-white/10 rounded transition"
            title="Velocidade de reprodução"
          >
            <Gauge className="w-4 h-4 text-white" />
            <span className="text-sm font-mono text-white">
              {playbackSpeed}x
            </span>
          </button>

          {/* Speed Menu */}
          {showSpeedMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSpeedMenu(false)}
              />

              <div className="absolute bottom-full right-0 mb-2 bg-black/95 border border-frame-gray-3 rounded shadow-lg overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-frame-gray-3">
                  <p className="text-xs font-semibold text-frame-gray-light uppercase tracking-wider">
                    Velocidade
                  </p>
                </div>
                <div className="py-1">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedSelect(speed)}
                      className={`
                        w-full px-4 py-2 text-left text-sm font-mono transition
                        ${speed === playbackSpeed
                          ? 'bg-frame-orange text-white'
                          : 'text-white hover:bg-white/10'
                        }
                      `}
                    >
                      {speed}x
                      {speed === 1 && <span className="text-xs ml-2 opacity-60">(Normal)</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fullscreen */}
        <button
          onClick={onFullscreenToggle}
          className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded transition"
          title={isFullscreen ? 'Sair de tela cheia (F)' : 'Tela cheia (F)'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 text-white" />
          ) : (
            <Maximize className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
