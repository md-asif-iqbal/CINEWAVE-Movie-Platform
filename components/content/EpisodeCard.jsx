'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function EpisodeCard({ episode, number, contentId }) {
  return (
    <Link
      href={`/watch/${contentId}?episode=${episode._id}`}
      className="flex gap-3 md:gap-4 p-3 rounded-lg hover:bg-cw-bg-card transition-colors group min-h-[44px]"
    >
      <div className="text-cw-text-secondary text-lg font-semibold w-8 shrink-0 flex items-center justify-center">
        {number}
      </div>

      <div className="relative w-28 md:w-40 aspect-video rounded overflow-hidden bg-cw-bg-card shrink-0">
        {episode.thumbnailUrl ? (
          <Image src={episode.thumbnailUrl} alt={episode.title} fill className="object-cover" sizes="160px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cw-text-secondary text-xs">
            E{number}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play size={24} fill="white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-white truncate">{episode.title}</h3>
          {episode.duration > 0 && (
            <span className="text-xs text-cw-text-secondary shrink-0 ml-2">
              {formatDuration(episode.duration)}
            </span>
          )}
        </div>
        <p className="text-xs text-cw-text-secondary line-clamp-2">{episode.description}</p>
      </div>
    </Link>
  );
}
