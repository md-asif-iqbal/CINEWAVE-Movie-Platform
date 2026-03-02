import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import HeroBanner from '@/components/content/HeroBanner';
import ContentRow from '@/components/content/ContentRow';
import HeroBannerSkeleton from '@/components/skeletons/HeroBannerSkeleton';
import ContentRowSkeleton from '@/components/skeletons/ContentRowSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Home - CineWave',
};

async function getHomeData() {
  try {
    await dbConnect();
    const [featured, trending, newReleases, movies, series, topRated] = await Promise.all([
      Content.find({ featured: true, status: 'active' }).limit(5).lean(),
      Content.find({ trending: true, status: 'active' }).sort('-views').limit(20).lean(),
      Content.find({ newRelease: true, status: 'active' }).sort('-createdAt').limit(20).lean(),
      Content.find({ type: 'movie', status: 'active' }).sort('-createdAt').limit(20).lean(),
      Content.find({ type: 'series', status: 'active' }).sort('-createdAt').limit(20).lean(),
      Content.find({ status: 'active', 'rating.imdb': { $gte: 7 } }).sort('-rating.imdb').limit(20).lean(),
    ]);
    return { featured, trending, newReleases, movies, series, topRated };
  } catch (err) {
    console.error('Home data error:', err);
    return { featured: [], trending: [], newReleases: [], movies: [], series: [], topRated: [] };
  }
}

export default async function HomePage() {
  const { featured, trending, newReleases, movies, series, topRated } = await getHomeData();
  const heroContent = featured[0] || trending[0] || newReleases[0] || null;

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 -mt-[64px]">
      <Suspense fallback={<HeroBannerSkeleton />}>
        {heroContent ? (
          <HeroBanner content={JSON.parse(JSON.stringify(heroContent))} />
        ) : (
          <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cw-bg-secondary flex items-center justify-center">
            <p className="text-cw-text-muted text-lg">Welcome to CineWave</p>
          </div>
        )}
      </Suspense>

      <Suspense fallback={<ContentRowSkeleton />}>
        {trending.length > 0 && (
          <ContentRow title="Trending Now" contents={JSON.parse(JSON.stringify(trending))} />
        )}
      </Suspense>

      <Suspense fallback={<ContentRowSkeleton />}>
        {newReleases.length > 0 && (
          <ContentRow title="New Releases" contents={JSON.parse(JSON.stringify(newReleases))} />
        )}
      </Suspense>

      <Suspense fallback={<ContentRowSkeleton />}>
        {movies.length > 0 && (
          <ContentRow title="Movies" contents={JSON.parse(JSON.stringify(movies))} />
        )}
      </Suspense>

      <Suspense fallback={<ContentRowSkeleton />}>
        {series.length > 0 && (
          <ContentRow title="Series" contents={JSON.parse(JSON.stringify(series))} />
        )}
      </Suspense>

      <Suspense fallback={<ContentRowSkeleton />}>
        {topRated.length > 0 && (
          <ContentRow title="Top Rated" contents={JSON.parse(JSON.stringify(topRated))} />
        )}
      </Suspense>
    </div>
  );
}
