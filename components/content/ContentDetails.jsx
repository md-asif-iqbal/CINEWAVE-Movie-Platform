'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, Share2, Check, Film } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';
import useWatchlist from '@/hooks/useWatchlist';
export default function ContentDetails({ content }) {
  const { data: session } = useSession();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inList = isInWatchlist(content?._id);

  if (!content) return null;

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {content.backdropUrl ? (
          <Image src={content.backdropUrl} alt={content.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-cw-bg-secondary to-cw-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cw-bg via-cw-bg/60 to-transparent" />
      </div>

      {/* Details */}
      <div className="relative -mt-32 md:-mt-40 px-4 md:px-8 lg:px-12 pb-8 max-w-5xl">
        <h1 className="text-fluid-3xl md:text-fluid-4xl font-heading font-extrabold text-white mb-3">
          {content.title}
        </h1>

        <div className="flex items-center gap-3 mb-4 flex-wrap text-sm">
          {content.rating?.imdb > 0 && (
            <span className="text-green-400 font-semibold">{Math.round(content.rating.imdb * 10)}% Match</span>
          )}
          {content.year && <span className="text-cw-text-muted">{content.year}</span>}
          {content.maturityRating && (
            <Badge variant="outline">{content.maturityRating}</Badge>
          )}
          {content.duration > 0 && (
            <span className="text-cw-text-muted">{formatDuration(content.duration)}</span>
          )}
          {content.type === 'series' && content.seasons?.length > 0 && (
            <span className="text-cw-text-muted">{content.seasons.length} Season{content.seasons.length > 1 ? 's' : ''}</span>
          )}
          {content.rating?.imdb > 0 && (
            <span className="text-yellow-400">★ {content.rating.imdb.toFixed(1)}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Play / Watch button - available for everyone (access check in watch page) */}
          <Link href={`/watch/${content._id}`}>
            <Button size="lg" className="gap-2 bg-cw-red hover:bg-cw-red-hover text-white">
              <Play size={20} fill="white" className="text-white" />
              {session ? 'Play' : 'Watch'}
            </Button>
          </Link>

          {/* Watch Trailer button - shown when trailer exists */}
          {content.trailerUrl && (
            <Link href={`/watch/${content._id}`}>
              <Button variant="secondary" size="lg" className="gap-2">
                <Film size={20} />
                Watch Trailer
              </Button>
            </Link>
          )}

          {/* My List - only for logged in users */}
          {session && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => inList ? removeFromWatchlist(content._id) : addToWatchlist(content._id)}
              className="gap-2"
            >
              {inList ? <Check size={20} /> : <Plus size={20} />}
              {inList ? 'In My List' : 'My List'}
            </Button>
          )}

          {/* Sign up prompt for guests */}
          {!session && (
            <Link href="/auth/register">
              <Button variant="secondary" size="lg" className="gap-2">
                Register Free
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="rounded-full border border-cw-border">
            <ThumbsUp size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full border border-cw-border">
            <Share2 size={20} />
          </Button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <div>
            <p className="text-cw-text-muted text-sm md:text-base leading-relaxed mb-4">
              {content.longDescription || content.description}
            </p>
          </div>
          <div className="space-y-3 text-sm">
            {content.cast?.length > 0 && (
              <p className="text-cw-text-secondary">
                <span className="text-cw-text-muted">Cast: </span>
                {content.cast.slice(0, 5).map((c) => c.name).join(', ')}
              </p>
            )}
            {content.genre?.length > 0 && (
              <p className="text-cw-text-secondary">
                <span className="text-cw-text-muted">Genres: </span>
                {content.genre.join(', ')}
              </p>
            )}
            {content.director && (
              <p className="text-cw-text-secondary">
                <span className="text-cw-text-muted">Director: </span>
                {content.director}
              </p>
            )}
            {content.language?.length > 0 && (
              <p className="text-cw-text-secondary">
                <span className="text-cw-text-muted">Languages: </span>
                {content.language.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
