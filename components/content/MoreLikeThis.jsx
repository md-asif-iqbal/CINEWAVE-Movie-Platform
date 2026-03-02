'use client';
import ContentCard from './ContentCard';

export default function MoreLikeThis({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <h2 className="text-fluid-xl font-heading font-semibold text-white mb-4">More Like This</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {items.map((item) => (
          <ContentCard key={item._id} content={item} />
        ))}
      </div>
    </div>
  );
}
