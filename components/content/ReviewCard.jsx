'use client';
import { Star, ThumbsUp, AlertTriangle } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

export default function ReviewCard({ review }) {
  const [showSpoiler, setShowSpoiler] = useState(false);

  return (
    <div className="bg-cw-bg-secondary border border-cw-border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Avatar
          src={review.profileId?.avatar}
          name={review.profileId?.name || review.userId?.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">
              {review.profileId?.name || review.userId?.name || 'Anonymous'}
            </span>
            <span className="text-xs text-cw-text-secondary">{formatDate(review.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-cw-bg-card'
                }
              />
            ))}
            <span className="text-xs text-cw-text-muted ml-1">{review.rating}/10</span>
          </div>

          {review.spoiler && !showSpoiler ? (
            <button
              onClick={() => setShowSpoiler(true)}
              className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400"
            >
              <AlertTriangle size={14} /> Contains spoilers — click to reveal
            </button>
          ) : (
            review.comment && (
              <p className="text-sm text-cw-text-muted leading-relaxed">{review.comment}</p>
            )
          )}

          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-cw-text-secondary hover:text-white transition-colors min-h-[28px]">
              <ThumbsUp size={12} /> {review.likes || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
