'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import axios from 'axios';
import ReviewCard from './ReviewCard';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function ReviewSection({ contentId, reviews = [], onReviewAdded }) {
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      addToast('Please select a rating', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/content/${contentId}`, {
        action: 'review',
        rating,
        comment,
        spoiler,
      });
      setRating(0);
      setComment('');
      setSpoiler(false);
      addToast('Review submitted!', 'success');
      onReviewAdded?.();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <h2 className="text-fluid-xl font-heading font-semibold text-white mb-4">Reviews</h2>

      {session && (
        <form onSubmit={handleSubmit} className="bg-cw-bg-secondary border border-cw-border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center"
              >
                <Star
                  size={20}
                  className={
                    (hover || rating) > i
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-cw-text-secondary'
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-cw-text-muted">{rating || hover}/10</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-cw-bg border-2 border-cw-border rounded-lg px-4 py-3 text-white text-sm placeholder:text-cw-text-secondary focus:outline-none focus:ring-2 focus:ring-cw-red/50 focus:border-cw-red resize-none min-h-[80px]"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-cw-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={spoiler}
                onChange={(e) => setSpoiler(e.target.checked)}
                className="rounded"
              />
              Contains spoilers
            </label>
            <Button type="submit" loading={loading} size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
        {reviews.length === 0 && (
          <p className="text-cw-text-secondary text-sm text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
