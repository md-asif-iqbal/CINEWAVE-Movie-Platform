import { create } from 'zustand';
import axios from 'axios';

const useSubscriptionStore = create((set, get) => ({
  status: null,
  loading: false,
  error: null,
  paymentLoading: false,

  fetchStatus: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/subscription/status');
      set({ status: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ loading: false, error: 'Failed to fetch status' });
      return null;
    }
  },

  initiatePayment: async (plan) => {
    set({ paymentLoading: true, error: null });
    try {
      const res = await axios.post('/api/payment/initiate', { plan });
      set({ paymentLoading: false });
      return res.data;
    } catch (err) {
      set({
        paymentLoading: false,
        error: err.response?.data?.error || 'Payment initiation failed',
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useSubscriptionStore;
