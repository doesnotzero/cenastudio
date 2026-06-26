import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack,
} from "lucide-react";

interface VideoPlayerProps {
  url: string;
  onProgress?: (seconds: number) => void;
  onDuration?: (duration: number) => void;
  seekTo?: number | null;
  onReady?: () => void;
}

export default function VideoPlayer({
  url, onProgress, onDuration, seekTo, onReady,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (seekTo != null && playerRef.current) {
      playerRef.current.seekTo(seekTo, "seconds");
      setPlaying(true);
    }
  }, [seekTo]);

  useEffect(() => {
    if (!url) {
      setPlaying(false);
      setPlayed(0);
      setCurrentTime(0);
    }
  }, [url]);

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
    onProgress?.(state.playedSeconds);
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
    onDuration?.(dur);
  };

  const handlePlayPause = () => setPlaying((prev) => !prev);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setMuted(val === 0);
  };

  const handleMute = () => setMuted((prev) => !prev);

  const handleSkip = (seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPlayed(val);
    if (playerRef.current) {
      playerRef.current.seekTo(val, "fraction");
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!url) {
    return (
      <div className="aspect-video bg-frame-black rounded-lg flex items-center justify-center border border-frame-gray-3">
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-4 text-frame-gray-4" />
          <p className="text-frame-gray-light text-sm">Nenhum vídeo carregado</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden border border-frame-gray-3 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        muted={muted}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onReady={onReady}
        progressInterval={100}
        style={{ position: "absolute", top: 0, left: 0 }}
        config={{ file: { attributes: { controlsList: "nodownload" } } } as any}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-frame-orange/90 hover:bg-frame-orange flex items-center justify-center transition-all hover:scale-110"
            >
              <Play className="w-7 h-7 text-frame-black ml-1" />
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onChange={handleSeek}
            className="w-full h-1 appearance-none bg-frame-gray-4/50 rounded-full cursor-pointer accent-frame-orange [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-frame-orange [&::-webkit-slider-thumb]:cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handlePlayPause} className="text-white hover:text-frame-orange transition">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={() => handleSkip(-10)} className="text-white/70 hover:text-white transition" title="Voltar 10s">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={() => handleSkip(10)} className="text-white/70 hover:text-white transition" title="Avançar 10s">
                <SkipForward className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleMute} className="text-white/70 hover:text-white transition">
                  {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range" min={0} max={1} step="any"
                  value={muted ? 0 : volume} onChange={handleVolumeChange}
                  className="w-20 h-1 appearance-none bg-frame-gray-4/50 rounded-full cursor-pointer accent-frame-orange [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-frame-orange"
                />
              </div>
              <span className="text-xs text-white/70 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
