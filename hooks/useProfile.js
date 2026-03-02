'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useProfile() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/profile');
      setProfiles(res.data.data || []);
    } catch (err) {
      console.error('Fetch profiles error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = async (data) => {
    const res = await axios.post('/api/profile', data);
    await fetchProfiles();
    return res.data;
  };

  const updateProfile = async (id, data) => {
    const res = await axios.put(`/api/profile/${id}`, data);
    await fetchProfiles();
    return res.data;
  };

  const deleteProfile = async (id) => {
    await axios.delete(`/api/profile/${id}`);
    await fetchProfiles();
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, loading, fetchProfiles, createProfile, updateProfile, deleteProfile };
}
