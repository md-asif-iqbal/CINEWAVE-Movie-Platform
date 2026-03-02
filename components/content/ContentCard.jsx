'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function ContentCard({ content }) {
  const [hovered, setHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimerRef = useRef(null);
  const previewTimerRef = useRef(null);
  const detailsHref = content.type === 'series' ? `/series/${content._id}` : `/movie/${content._id}`;
  const ytId = getYouTubeId(content?.trailerUrl);

  useEffect(() => {
    if (hovered && ytId) {
      hoverTimerRef.current = setTimeout(() => setShowPreview(true), 600);
      previewTimerRef.current = setTimeout(() => setShowPreview(false), 31000);
    } else {
      setShowPreview(false);
      clearTimeout(hoverTimerRef.current);
      clearTimeout(previewTimerRef.current);
    }
    return () => {
      clearTimeout(hoverTimerRef.current);
      clearTimeout(previewTimerRef.current);
    };
  }, [hovered, ytId]);

  return (
    <div
      className="relative shrink-0 w-[calc(50vw-24px)] sm:w-[calc(33.33vw-24px)] md:w-[calc(25vw-26px)] lg:w-[calc(20vw-30px)] xl:w-[calc(16.66vw-32px)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={detailsHref} className="block">
        {/* Thumbnail / Video Preview */}
        <div className="relative aspect-video rounded-t overflow-hidden bg-cw-bg-card">
          {/* YouTube trailer preview on hover */}
          {showPreview && ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${ytId}&start=5`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ border: 'none', transform: 'scale(1.15)' }}
              allow="autoplay; encrypted-media"
              title={content.title}
            />
          ) : content.thumbnailUrl ? (
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.66vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cw-text-secondary text-sm">
              {content.title}
            </div>
          )}

          {/* Play icon overlay on hover */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300',
            hovered ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="w-10 h-10 rounded-full bg-cw-red/90 flex items-center justify-center shadow-lg">
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>

          {/* Progress bar */}
          {content.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div className="h-full bg-cw-red" style={{ width: `${content.progress}%` }} />
            </div>
          )}
        </div>
      </Link>

      {/* Details below the image — always visible */}
      <div className="bg-cw-bg-secondary rounded-b px-2.5 py-2">
        <Link href={detailsHref}>
          <h3 className="text-sm font-medium text-white truncate mb-1">{content.title}</h3>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-cw-text-muted mb-1 flex-wrap">
          {content.rating?.imdb > 0 && (
            <span className="text-green-400 font-semibold">{Math.round(content.rating.imdb * 10)}%</span>
          )}
          {content.year && <span>{content.year}</span>}
          {content.maturityRating && (
            <span className="px-1 border border-cw-text-secondary/50 text-[11px]">{content.maturityRating}</span>
          )}
          {content.type === 'series' && content.totalSeasons && (
            <span>{content.totalSeasons}S</span>
          )}
          {content.type === 'movie' && content.duration > 0 && (
            <span>{Math.floor(content.duration / 60)}h{content.duration % 60 > 0 ? ` ${content.duration % 60}m` : ''}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {content.genre?.slice(0, 2).map((g) => (
            <span key={g} className="text-[11px] text-cw-text-secondary">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
