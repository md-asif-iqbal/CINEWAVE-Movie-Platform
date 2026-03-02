import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ContentRow from '@/components/content/ContentRow';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Series - CineWave' };

async function getSeries() {
  try {
    await dbConnect();
    const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Crime', 'Romance', 'Sci-Fi', 'Fantasy'];
    const data = {};

    const allSeries = await Content.find({ type: 'series', status: 'active' }).sort('-createdAt').lean();

    for (const genre of genres) {
      data[genre] = allSeries.filter((s) => s.genre?.includes(genre));
    }

    data.all = allSeries;
    return data;
  } catch (err) {
    console.error('Get series error:', err);
    return { all: [] };
  }
}

export default async function SeriesPage() {
  const data = await getSeries();

  return (
    <div className="pt-20 sm:pt-24 space-y-6 sm:space-y-8 pb-8">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-2xl sm:text-3xl font-bold">Series</h1>
      </div>

      {data.all.length === 0 ? (
        <div className="px-4 sm:px-6 md:px-10 lg:px-16">
          <p className="text-cw-text-muted">No series found.</p>
        </div>
      ) : (
        <>
          {Object.entries(data).map(([genre, items]) => (
            genre !== 'all' && items.length > 0 && (
              <ContentRow key={genre} title={genre} contents={JSON.parse(JSON.stringify(items))} />
            )
          ))}
        </>
      )}
    </div>
  );
}
