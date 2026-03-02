import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  isPlaying: false,
  isMuted: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  isFullscreen: false,
  showControls: true,
  quality: '1080p',
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMuted: (isMuted) => set({ isMuted }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setShowControls: (showControls) => set({ showControls }),
  setQuality: (quality) => set({ quality }),
  reset: () =>
    set({
      isPlaying: false,
      isMuted: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      isFullscreen: false,
      showControls: true,
      quality: '1080p',
    }),
}));

export default usePlayerStore;
