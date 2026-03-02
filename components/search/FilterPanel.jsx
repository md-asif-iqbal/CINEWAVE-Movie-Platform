'use client';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Crime', 'Documentary', 'Drama',
  'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
];

const types = [
  { value: '', label: 'All' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' },
  { value: 'documentary', label: 'Documentary' },
];

export default function FilterPanel({ filters, onFilterChange }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onFilterChange({ type: t.value })}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors min-h-[44px] ${
                filters.type === t.value
                  ? 'bg-cw-red text-white'
                  : 'bg-cw-bg-card text-cw-text-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-2">Genre</h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ genre: filters.genre === g ? '' : g })}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors min-h-[44px] ${
                filters.genre === g
                  ? 'bg-cw-red text-white'
                  : 'bg-cw-bg-card text-cw-text-muted hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
