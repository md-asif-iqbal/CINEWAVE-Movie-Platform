'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import VideoPlayer from '@/components/content/VideoPlayer';
import axios from 'axios';
import useAuthStore from '@/store/authStore';
import Spinner from '@/components/ui/Spinner';
import { Lock, LogIn, CreditCard } from 'lucide-react';

function WatchContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const episodeId = searchParams.get('episode');
  const { data: session, status: authStatus } = useSession();
  const { activeProfile } = useAuthStore();

  const [content, setContent] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState(null); // null | 'checking' | 'granted' | 'needLogin' | 'needSubscription'
  const [selectedSeason, setSelectedSeason] = useState(1);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    fetchContent();
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [id, episodeId]);

  // Check access after content is loaded and auth is resolved
  useEffect(() => {
    if (authStatus === 'loading' || loading) return;
    checkAccess();
  }, [authStatus, session, loading]);

  // Sync selected season with current episode
  useEffect(() => {
    if (episode) {
      setSelectedSeason(episode.season || 1);
    } else if (allEpisodes.length > 0) {
      setSelectedSeason(allEpisodes[0].season || 1);
    }
  }, [episode, allEpisodes]);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get(`/api/content/${id}`);
      setContent(data.content);
      setAllEpisodes(data.episodes || []);

      if (episodeId && data.episodes?.length > 0) {
        const ep = data.episodes.find((e) => String(e._id) === String(episodeId));
        setEpisode(ep || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async () => {
    // Not logged in → show trailer only
    if (!session) {
      setAccessStatus('needLogin');
      return;
    }

    // Logged in → check subscription/trial
    setAccessStatus('checking');
    try {
      const { data } = await axios.get('/api/subscription/status');
      if (data.hasAccess) {
        setAccessStatus('granted');
      } else {
        setAccessStatus('needSubscription');
      }
    } catch (err) {
      setAccessStatus('needSubscription');
    }
  };

  const handleProgress = (progress, duration) => {
    if (!activeProfile?._id || accessStatus !== 'granted') return;

    if (!saveTimerRef.current) {
      saveTimerRef.current = setInterval(() => {
        saveProgress(progress, duration);
      }, 30000);
    }
  };

  const saveProgress = async (progress, duration) => {
    try {
      await axios.post(`/api/profile/${activeProfile._id}/history`, {
        contentId: id,
        episodeId: episodeId || undefined,
        progress,
        duration,
      });
    } catch (err) {
      console.error('Save progress failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-cw-text-muted">
          Content not found
        </p>
      </div>
    );
  }

  const trailerUrl = content.trailerUrl;

  // For series without a selected episode, use the first episode
  let resolvedEpisode = episode;
  if (!resolvedEpisode && content.type === 'series' && allEpisodes.length > 0) {
    resolvedEpisode = allEpisodes[0];
  }

  const fullVideoUrl = resolvedEpisode?.videoUrl || content.videoUrl;
  const epSeason = resolvedEpisode?.season ?? resolvedEpisode?.seasonNumber;
  const epNum = resolvedEpisode?.episode ?? resolvedEpisode?.episodeNumber;
  const title = resolvedEpisode
    ? `${content.title} — S${String(epSeason || 1).padStart(2,'0')}E${String(epNum || 1).padStart(2,'0')} ${resolvedEpisode.title || ''}`
    : content.title;

  // ACCESS DENIED: Not logged in → show trailer + login prompt
  if (accessStatus === 'needLogin') {
    return (
      <div className="min-h-screen bg-black">
        {/* Show trailer if available */}
        {trailerUrl ? (
          <div className="relative">
            <VideoPlayer
              src={trailerUrl}
              title={`${title} - Trailer`}
              poster={content.backdropUrl || content.thumbnailUrl}
            />
            {/* Overlay after trailer */}
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none" style={{ top: '60%' }}>
              <div className="text-center pointer-events-auto p-6">
                <LogIn className="mx-auto mb-3 text-cw-red" size={40} />
                <h2 className="text-xl font-bold text-white mb-2">
                  Login to Watch Full Video
                </h2>
                <p className="text-cw-text-secondary text-sm mb-4 max-w-sm">
                  Register and get 2 months free access!
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/auth/login"
                    className="bg-cw-red hover:bg-cw-red-hover text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors border border-white/20"
                  >
                    Register Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8">
              <Lock className="mx-auto mb-4 text-cw-text-secondary" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">
                Login Required to Watch
              </h2>
              <p className="text-cw-text-secondary text-sm mb-6">
                Register and enjoy 2 months of free streaming!
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/auth/login"
                  className="bg-cw-red hover:bg-cw-red-hover text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors border border-white/20"
                >
                  Register Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACCESS DENIED: Logged in but no subscription/trial
  if (accessStatus === 'needSubscription') {
    return (
      <div className="min-h-screen bg-black">
        {trailerUrl ? (
          <div className="relative">
            <VideoPlayer
              src={trailerUrl}
              title={`${title} - Trailer`}
              poster={content.backdropUrl || content.thumbnailUrl}
            />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none" style={{ top: '60%' }}>
              <div className="text-center pointer-events-auto p-6">
                <CreditCard className="mx-auto mb-3 text-cw-red" size={40} />
                <h2 className="text-xl font-bold text-white mb-2">
                  Subscription Required
                </h2>
                <p className="text-cw-text-secondary text-sm mb-4 max-w-sm">
                  Choose a plan to watch full content. Starting from just ৳20/month!
                </p>
                <Link
                  href="/subscription"
                  className="bg-cw-red hover:bg-cw-red-hover text-white px-8 py-2.5 rounded-lg font-semibold transition-colors inline-block"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8">
              <CreditCard className="mx-auto mb-4 text-cw-text-secondary" size={48} />
              <h2 className="text-xl font-bold text-white mb-2">
                Subscription Required
              </h2>
              <p className="text-cw-text-secondary text-sm mb-6">
                Subscribe to watch full content
              </p>
              <Link
                href="/subscription"
                className="bg-cw-red hover:bg-cw-red-hover text-white px-8 py-2.5 rounded-lg font-semibold transition-colors inline-block"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Still checking access
  if (accessStatus === 'checking' || accessStatus === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ACCESS GRANTED: Full video
  // Fallback to trailer if no direct video URL available
  const videoSrc = fullVideoUrl || trailerUrl;
  const isSeries = content.type === 'series' && allEpisodes.length > 0;

  // Group episodes by season
  const seasons = isSeries
    ? [...new Set(allEpisodes.map((ep) => ep.season || 1))].sort((a, b) => a - b)
    : [];
  const seasonEpisodes = allEpisodes.filter((ep) => (ep.season || 1) === selectedSeason);

  return (
    <div className="min-h-screen bg-black">
      {isSeries ? (
        /* ───── Series: side-by-side layout (desktop) ───── */
        <div className="flex flex-col lg:flex-row w-full">
          {/* Video player — sticky on desktop */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-hidden">
            <VideoPlayer
              src={videoSrc}
              title={title}
              poster={content.backdropUrl || content.thumbnailUrl}
              onProgress={handleProgress}
            />
            {/* Now playing info — visible on desktop below the video within the sticky panel */}
            <div className="hidden lg:block px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
              <h2 className="text-white text-base font-semibold truncate">{title}</h2>
            </div>
          </div>

          {/* Episode sidebar — scrollable */}
          <div className="w-full lg:w-[380px] xl:w-[420px] lg:h-screen lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-black/60">
            {/* Mobile now-playing */}
            <div className="lg:hidden px-4 py-3 border-b border-white/10">
              <h2 className="text-white text-sm font-semibold truncate">{title}</h2>
            </div>

            {/* Season selector */}
            {seasons.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 overflow-x-auto scrollbar-hide">
                {seasons.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedSeason === s
                        ? 'bg-cw-red text-white'
                        : 'bg-white/10 text-cw-text-secondary hover:bg-white/20'
                    }`}
                  >
                    Season {s}
                  </button>
                ))}
              </div>
            )}

            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold">
                {seasons.length > 1 ? `Season ${selectedSeason}` : 'Episodes'}
                <span className="text-cw-text-muted ml-2 font-normal">({seasonEpisodes.length})</span>
              </h3>
            </div>

            {/* Episode list */}
            <div className="px-2 pb-4 space-y-1">
              {seasonEpisodes.map((ep, idx) => {
                const isActive = resolvedEpisode && String(ep._id) === String(resolvedEpisode._id);
                const epNumber = ep.episode || idx + 1;
                return (
                  <Link
                    key={ep._id}
                    href={`/watch/${id}?episode=${ep._id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cw-red/20 border border-cw-red/40'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <span className={`text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-cw-red text-white' : 'bg-white/10 text-cw-text-secondary'
                    }`}>
                      {epNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-cw-red' : 'text-white'}`}>
                        {ep.title || `Episode ${epNumber}`}
                      </p>
                      {ep.duration > 0 && (
                        <span className="text-xs text-cw-text-muted">{ep.duration} min</span>
                      )}
                    </div>
                    {isActive && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cw-red animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ───── Movie: full-width player ───── */
        <VideoPlayer
          src={videoSrc}
          title={title}
          poster={content.backdropUrl || content.thumbnailUrl}
          onProgress={handleProgress}
        />
      )}
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Spinner size="lg" /></div>}>
      <WatchContent />
    </Suspense>
  );
}
