'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function ContentCardLarge({ content }) {
  if (!content) return null;
  const href = content.type === 'series' ? `/series/${content._id}` : `/movie/${content._id}`;

  return (
    <Link href={href} className="block group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-cw-bg-card">
        {content.thumbnailUrl ? (
          <Image
            src={content.thumbnailUrl}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cw-text-secondary text-sm p-3 text-center">
            {content.title}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play size={24} fill="black" className="text-black ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-sm font-semibold text-white truncate">{content.title}</h3>
        </div>
      </div>
    </Link>
  );
}
