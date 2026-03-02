import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import Episode from '@/models/Episode';
import Review from '@/models/Review';
import ContentDetails from '@/components/content/ContentDetails';
import EpisodeList from '@/components/content/EpisodeList';
import ReviewSection from '@/components/content/ReviewSection';
import MoreLikeThis from '@/components/content/MoreLikeThis';

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const content = await Content.findById(params.id).lean();
    if (!content) return { title: 'Not Found - CineWave' };
    return {
      title: `${content.title} - CineWave`,
      description: content.description,
    };
  } catch {
    return { title: 'CineWave' };
  }
}

async function getContentData(id) {
  try {
    await dbConnect();

  const content = await Content.findById(id).lean();
  if (!content) return null;

  await Content.findByIdAndUpdate(id, { $inc: { views: 1 } });

  const [episodesRaw, reviews, similar] = await Promise.all([
    content.type === 'series'
      ? Episode.find({ contentId: id }).sort({ season: 1, episode: 1 }).lean()
      : Promise.resolve([]),
    Review.find({ contentId: id })
      .populate('userId', 'name image')
      .sort('-createdAt')
      .limit(20)
      .lean(),
    Content.find({
      _id: { $ne: id },
      genre: { $in: content.genre || [] },
      status: 'active',
    })
      .limit(12)
      .select('title thumbnailUrl type year rating genre')
      .lean(),
  ]);

  // Group episodes by season for EpisodeList
  const seasonsMap = {};
  for (const ep of episodesRaw) {
    const s = ep.season || 1;
    if (!seasonsMap[s]) seasonsMap[s] = { seasonNumber: s, episodes: [] };
    seasonsMap[s].episodes.push(ep);
  }
  const seasons = Object.values(seasonsMap).sort((a, b) => a.seasonNumber - b.seasonNumber);

  return { content, seasons, episodes: episodesRaw, reviews, similar };
  } catch (err) {
    console.error('Content detail error:', err);
    return null;
  }
}

export default async function ContentPage({ params }) {
  const data = await getContentData(params.id);
  if (!data) notFound();

  const { content, seasons, episodes, reviews, similar } = data;
  const serialized = JSON.parse(JSON.stringify({ content, seasons, episodes, reviews, similar }));

  return (
    <div className="pt-16 sm:pt-0">
      <ContentDetails content={serialized.content} />

      {serialized.content.type === 'series' && serialized.seasons.length > 0 && (
        <EpisodeList seasons={serialized.seasons} contentId={serialized.content._id} />
      )}

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8">
        <ReviewSection
          contentId={serialized.content._id}
          reviews={serialized.reviews}
        />
      </div>

      {serialized.similar.length > 0 && (
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8">
          <MoreLikeThis contents={serialized.similar} />
        </div>
      )}
    </div>
  );
}
