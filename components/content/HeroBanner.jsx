'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function HeroBanner({ content }) {
  const [muted, setMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const timerRef = useRef(null);
  const stopRef = useRef(null);
  const iframeRef = useRef(null);
  const ytId = getYouTubeId(content?.trailerUrl);

  useEffect(() => {
    if (!ytId) return;
    // Start trailer after 2.5s
    timerRef.current = setTimeout(() => setShowTrailer(true), 2500);
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(stopRef.current);
    };
  }, [ytId]);

  // Stop trailer after 30s playing
  useEffect(() => {
    if (!showTrailer) return;
    stopRef.current = setTimeout(() => setShowTrailer(false), 30000);
    return () => clearTimeout(stopRef.current);
  }, [showTrailer]);

  // Handle iframe load error detection
  useEffect(() => {
    if (!showTrailer || !ytId) return;
    // Give the iframe some time to load; if it fails YouTube shows error in the iframe
    // We can't detect cross-origin errors, so we just let it play
    setTrailerError(false);
  }, [showTrailer, ytId]);

  if (!content) return null;

  return (
    <div className="relative h-[55vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      {/* Backdrop Image (always behind) */}
      <div className="absolute inset-0">
        {content.backdropUrl ? (
          <Image
            src={content.backdropUrl}
            alt={content.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-cw-bg to-cw-bg-secondary" />
        )}
      </div>

      {/* YouTube Trailer Overlay */}
      <AnimatePresence>
        {showTrailer && ytId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[1]"
          >
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${ytId}&start=5&enablejsapi=1&iv_load_policy=3&disablekb=1`}
              className="w-full h-full object-cover pointer-events-none"
              style={{ border: 'none', transform: 'scale(1.2)' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={content.title}
              ref={iframeRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-cw-bg/90 via-cw-bg/50 to-transparent z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cw-bg via-cw-bg/70 to-transparent z-[2]" />

      {/* Content */}
      <div className="absolute bottom-[12%] md:bottom-[15%] left-0 right-0 px-4 md:px-8 lg:px-12 z-[3]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-2 md:mb-4 leading-tight drop-shadow-lg">
            {content.title}
          </h1>

          <div className="flex items-center gap-3 mb-3 md:mb-4 text-sm text-cw-text-muted flex-wrap">
            {content.rating?.imdb > 0 && (
              <span className="text-green-400 font-semibold text-base">{Math.round(content.rating.imdb * 10)}% Match</span>
            )}
            {content.year && <span>{content.year}</span>}
            {content.maturityRating && (
              <span className="px-1.5 py-0.5 border border-cw-text-secondary text-xs">
                {content.maturityRating}
              </span>
            )}
            {content.type === 'series' && content.totalSeasons && (
              <span>{content.totalSeasons} Season{content.totalSeasons > 1 ? 's' : ''}</span>
            )}
            {content.type === 'movie' && content.duration && (
              <span>{Math.floor(content.duration / 60)}h {content.duration % 60}m</span>
            )}
          </div>

          <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 max-w-lg leading-relaxed">
            {content.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href={`/watch/${content._id}`}>
              <Button size="lg" className="gap-2 bg-cw-red hover:bg-cw-red-hover text-white font-bold px-6 md:px-8">
                <Play size={20} fill="white" className="text-white" /> Play
              </Button>
            </Link>
            <Link href={content.type === 'series' ? `/series/${content._id}` : `/movie/${content._id}`}>
              <Button variant="secondary" size="lg" className="gap-2 bg-gray-500/70 hover:bg-gray-500/50 font-semibold px-6 md:px-8">
                <Info size={20} /> More Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-[12%] md:bottom-[15%] right-4 md:right-8 lg:right-12 z-[3] min-w-[44px] min-h-[44px] rounded-full border border-gray-400 bg-black/30 flex items-center justify-center hover:border-white transition-colors"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
}
