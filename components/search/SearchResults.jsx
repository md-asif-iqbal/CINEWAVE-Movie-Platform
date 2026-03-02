'use client';
import ContentCard from '@/components/content/ContentCard';
import Spinner from '@/components/ui/Spinner';

export default function SearchResults({ results = [], loading, query }) {
  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (query && query.length >= 2 && !results.length) {
    return (
      <div className="text-center py-20">
        <p className="text-cw-text-secondary text-lg mb-2">No results found</p>
        <p className="text-cw-text-secondary text-sm">Try a different search term</p>
      </div>
    );
  }

  if (!results.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
      {results.map((item) => (
        <ContentCard key={item._id} content={item} />
      ))}
    </div>
  );
}
