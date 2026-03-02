import { create } from 'zustand';

const useLanguageStore = create(() => ({
  lang: 'en',
}));

export default useLanguageStore;
export { useLanguageStore };
