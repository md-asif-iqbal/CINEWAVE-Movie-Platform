'use client';
import MobileDrawer from '@/components/layout/MobileDrawer';
import FilterPanel from './FilterPanel';

export default function FilterDrawer({ isOpen, onClose, filters, onFilterChange }) {
  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} title="Filters">
      <FilterPanel filters={filters} onFilterChange={(f) => { onFilterChange(f); }} />
    </MobileDrawer>
  );
}
