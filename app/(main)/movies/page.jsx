import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import ContentRow from '@/components/content/ContentRow';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Movies - CineWave' };

async function getMovies() {
  try {
    await dbConnect();
    const genres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation'];
    const data = {};

    const allMovies = await Content.find({ type: 'movie', status: 'active' }).sort('-createdAt').lean();

    for (const genre of genres) {
      data[genre] = allMovies.filter((m) => m.genre?.includes(genre));
    }

    data.all = allMovies;
    return data;
  } catch (err) {
    console.error('Get movies error:', err);
    return { all: [] };
  }
}

export default async function MoviesPage() {
  const data = await getMovies();

  return (
    <div className="pt-20 sm:pt-24 space-y-6 sm:space-y-8 pb-8">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-2xl sm:text-3xl font-bold">Movies</h1>
      </div>

      {data.all.length === 0 ? (
        <div className="px-4 sm:px-6 md:px-10 lg:px-16">
          <p className="text-cw-text-muted">No movies found.</p>
        </div>
      ) : (
        <>
          {Object.entries(data).map(([genre, movies]) => (
            genre !== 'all' && movies.length > 0 && (
              <ContentRow key={genre} title={genre} contents={JSON.parse(JSON.stringify(movies))} />
            )
          ))}
        </>
      )}
    </div>
  );
}
