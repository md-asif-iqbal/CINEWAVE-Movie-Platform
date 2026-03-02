'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import FilterPanel from '@/components/search/FilterPanel';
import FilterDrawer from '@/components/search/FilterDrawer';
import useSearch from '@/hooks/useSearch';
import { SlidersHorizontal } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ type: '', genre: '' });

  const { results, loading, query, setQuery, clearAll } = useSearch(initialQuery);

  const handleFilterChange = (newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const filteredResults = results.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.genre && !item.genre?.includes(filters.genre)) return false;
    return true;
  });

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-16 pb-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Search</h1>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} onClear={clearAll} />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden bg-cw-bg border-2 border-cw-border rounded-lg px-4 min-h-[44px] flex items-center"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop filters */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Results */}
        <div className="flex-1">
          <SearchResults results={filteredResults} loading={loading} query={query} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 px-4 text-cw-text-muted">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
