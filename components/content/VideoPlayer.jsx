'use client';
import { useRef, useEffect, useState } from 'react';

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function VideoPlayer({ src, poster, onProgress, onEnded, autoPlay = true, controls = true, muted = false }) {
  const videoRef = useRef(null);
  const ytId = getYouTubeId(src);

  useEffect(() => {
    if (videoRef.current && autoPlay && !ytId) {
      videoRef.current.play().catch(() => {});
    }
  }, [src, autoPlay, ytId]);

  const handleTimeUpdate = () => {
    if (videoRef.current && onProgress) {
      onProgress({
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration,
        progress: (videoRef.current.currentTime / videoRef.current.duration) * 100,
      });
    }
  };

  if (!src) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cw-red/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cw-red"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
        </div>
        <p className="text-cw-text-secondary text-lg">Video coming soon</p>
        <p className="text-cw-text-muted text-sm">This content will be available shortly</p>
      </div>
    );
  }

  // YouTube embed
  if (ytId) {
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: controls ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      showinfo: '0',
      enablejsapi: '1',
      iv_load_policy: '3',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    });
    return (
      <div className="w-full aspect-video bg-black relative">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?${params.toString()}`}
          className="w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title="Video Player"
        />
      </div>
    );
  }

  // Direct video (MP4 etc.)
  return (
    <div className="w-full aspect-video bg-black relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={controls}
        controlsList="nodownload"
        playsInline
        muted={muted}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        className="w-full h-full object-contain"
        style={{ maxHeight: '100%' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
