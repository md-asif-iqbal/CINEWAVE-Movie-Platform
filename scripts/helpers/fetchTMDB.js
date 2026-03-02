/**
 * TMDB API helper — fetches series, seasons, movies, and episode videos
 * Requires TMDB_API_KEY in .env.local
 */

const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';

async function fetchSeriesFromTMDB(id) {
  if (!TMDB_KEY) throw new Error('TMDB_API_KEY not set in .env.local');
  const url = `${BASE}/tv/${id}?api_key=${TMDB_KEY}&append_to_response=credits,videos&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ⚠️ TMDB TV fetch failed: ${res.status} ${res.statusText}`);
    return null;
  }
  return res.json();
}

async function fetchSeasonFromTMDB(id, season) {
  if (!TMDB_KEY) throw new Error('TMDB_API_KEY not set in .env.local');
  const url = `${BASE}/tv/${id}/season/${season}?api_key=${TMDB_KEY}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ⚠️ TMDB season fetch failed: ${res.status}`);
    return null;
  }
  return res.json();
}

async function fetchSeasonVideosFromTMDB(seriesId, season) {
  if (!TMDB_KEY) return null;
  const url = `${BASE}/tv/${seriesId}/season/${season}/videos?api_key=${TMDB_KEY}&language=en-US`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchEpisodeVideosFromTMDB(seriesId, season, episode) {
  if (!TMDB_KEY) return null;
  const url = `${BASE}/tv/${seriesId}/season/${season}/episode/${episode}/videos?api_key=${TMDB_KEY}&language=en-US`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchMovieFromTMDB(id) {
  if (!TMDB_KEY) throw new Error('TMDB_API_KEY not set in .env.local');
  const url = `${BASE}/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits,videos&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  ⚠️ TMDB movie fetch failed: ${res.status} ${res.statusText}`);
    return null;
  }
  return res.json();
}

function buildTMDBImageUrl(path, size = 'w500') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Extract all YouTube video keys from a TMDB videos response.
 * Returns array of { key, type } sorted: Clip > Featurette > Teaser > Trailer > other
 */
function extractYouTubeKeys(videosData) {
  if (!videosData?.results?.length) return [];
  const priority = { Clip: 0, Featurette: 1, Teaser: 2, Trailer: 3 };
  return videosData.results
    .filter((v) => v.site === 'YouTube' && v.key)
    .sort((a, b) => (priority[a.type] ?? 4) - (priority[b.type] ?? 4))
    .map((v) => ({ key: v.key, type: v.type }));
}

module.exports = {
  fetchSeriesFromTMDB,
  fetchSeasonFromTMDB,
  fetchSeasonVideosFromTMDB,
  fetchEpisodeVideosFromTMDB,
  fetchMovieFromTMDB,
  buildTMDBImageUrl,
  extractYouTubeKeys,
};
