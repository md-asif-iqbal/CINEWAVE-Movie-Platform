'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { cn } from '@/lib/utils';

export default function ContentRow({ title, items, contents, href }) {
  items = items || contents || [];
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);

  const scrollOne = useCallback(() => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    // If at the end, scroll back to start
    if (scrollLeft >= scrollWidth - clientWidth - 10) {
      rowRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Scroll by approximately one card width
      const cardWidth = rowRef.current.querySelector(':scope > *')?.offsetWidth || 250;
      rowRef.current.scrollBy({ left: cardWidth + 8, behavior: 'smooth' });
    }
  }, []);

  // Auto-scroll every 2 seconds
  useEffect(() => {
    if (isPaused || !items.length) return;
    autoScrollRef.current = setInterval(scrollOne, 2000);
    return () => clearInterval(autoScrollRef.current);
  }, [isPaused, scrollOne, items.length]);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (!items.length) return null;

  return (
    <div
      className="mb-6 md:mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 mb-2 md:mb-3">
        <h2 className="text-fluid-lg md:text-fluid-xl font-heading font-semibold text-white">
          {title}
        </h2>
        {href && (
          <a href={href} className="text-xs md:text-sm text-cw-text-secondary hover:text-cw-text-muted transition-colors">
            See All →
          </a>
        )}
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 z-10 flex items-center justify-center transition-opacity',
            showLeft ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Content Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard key={item._id} content={item} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 z-10 flex items-center justify-center transition-opacity',
            showRight ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
