import { create } from 'zustand';
import axios from 'axios';

const useContentStore = create((set, get) => ({
  featured: null,
  trending: [],
  newReleases: [],
  movies: [],
  series: [],
  searchResults: [],
  loading: false,
  error: null,

  fetchFeatured: async () => {
    try {
      const res = await axios.get('/api/content?featured=true&limit=1');
      set({ featured: res.data.data?.[0] || null });
    } catch (err) {
      console.error('Fetch featured error:', err);
    }
  },

  fetchTrending: async () => {
    try {
      const res = await axios.get('/api/content/trending');
      set({ trending: res.data.data || [] });
    } catch (err) {
      console.error('Fetch trending error:', err);
    }
  },

  fetchNewReleases: async () => {
    try {
      const res = await axios.get('/api/content/new-releases');
      set({ newReleases: res.data.data || [] });
    } catch (err) {
      console.error('Fetch new releases error:', err);
    }
  },

  fetchByType: async (type) => {
    try {
      const res = await axios.get(`/api/content?type=${type}&limit=20`);
      if (type === 'movie') set({ movies: res.data.data || [] });
      if (type === 'series') set({ series: res.data.data || [] });
    } catch (err) {
      console.error('Fetch by type error:', err);
    }
  },

  search: async (query, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ search: query, limit: '50', ...filters });
      const res = await axios.get(`/api/content?${params}`);
      set({ searchResults: res.data.contents || [], loading: false });
    } catch (err) {
      set({ error: 'Search failed', loading: false });
    }
  },

  clearSearch: () => set({ searchResults: [], error: null }),
}));

export default useContentStore;
