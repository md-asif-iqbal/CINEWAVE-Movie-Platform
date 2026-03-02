import { create } from 'zustand';

const useAuthStore = create((set) => ({
  activeProfile: null,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  clearProfile: () => set({ activeProfile: null }),
}));

export { useAuthStore };
export default useAuthStore;
