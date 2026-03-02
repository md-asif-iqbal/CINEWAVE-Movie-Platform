'use client';
import { useState, useEffect, useCallback } from 'react';
import useContentStore from '@/store/contentStore';
import useDebounce from './useDebounce';

export default function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({});
  const debouncedQuery = useDebounce(query, 400);
  const { searchResults, loading, error, search, clearSearch } = useContentStore();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      search(debouncedQuery, filters);
    } else {
      clearSearch();
    }
  }, [debouncedQuery, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setFilters({});
    clearSearch();
  }, [clearSearch]);

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    results: searchResults,
    loading,
    error,
    clearAll,
  };
}
