'use client';
import { useRef, useEffect, useCallback } from 'react';
import usePlayerStore from '@/store/playerStore';

export default function useVideoPlayer() {
  const playerRef = useRef(null);
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    setPlaying,
    setMuted,
    setVolume,
    setCurrentTime,
    setDuration,
    setFullscreen,
    reset,
  } = usePlayerStore();

  const play = useCallback(() => {
    playerRef.current?.play();
    setPlaying(true);
  }, [setPlaying]);

  const pause = useCallback(() => {
    playerRef.current?.pause();
    setPlaying(false);
  }, [setPlaying]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setMuted(!isMuted);
    }
  }, [isMuted, setMuted]);

  const seek = useCallback(
    (time) => {
      if (playerRef.current) {
        playerRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [setCurrentTime]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerRef.current?.parentElement?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, [setFullscreen]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return {
    playerRef,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    setVolume: (v) => {
      if (playerRef.current) playerRef.current.volume = v;
      setVolume(v);
    },
    toggleFullscreen,
    setCurrentTime,
    setDuration,
  };
}
