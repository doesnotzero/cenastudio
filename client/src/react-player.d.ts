declare module "react-player" {
  import { Component } from "react";

  interface ReactPlayerProps {
    url?: string;
    playing?: boolean;
    muted?: boolean;
    volume?: number;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    progressInterval?: number;
    controls?: boolean;
    light?: boolean | string;
    loop?: boolean;
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onEnded?: () => void;
    onError?: (error: any) => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
    onSeek?: (seconds: number) => void;
    config?: any;
  }

  interface ReactPlayer extends Component<ReactPlayerProps> {
    seekTo: (amount: number, type?: "seconds" | "fraction") => void;
    getInternalPlayer: () => any;
    getCurrentTime: () => number;
    getDuration: () => number;
  }

  const ReactPlayer: React.ForwardRefExoticComponent<ReactPlayerProps & React.RefAttributes<any>>;
  export default ReactPlayer;
}
