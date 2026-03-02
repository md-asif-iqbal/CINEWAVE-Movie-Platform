/**
 * Content Seed — Fetch from TMDB + Upload images to Cloudinary + Save to MongoDB
 * ═══════════════════════════════════════════════════════════════════════════════
 * Uses the same MongoDB + Cloudinary config as the main app (via env vars).
 *
 * Exports: seedSeries(tmdbId, nameHint), seedMovie(tmdbId, nameHint)
 */

const mongoose = require('mongoose');
const { fetchSeriesFromTMDB, fetchSeasonFromTMDB, fetchSeasonVideosFromTMDB, fetchEpisodeVideosFromTMDB, fetchMovieFromTMDB, buildTMDBImageUrl, extractYouTubeKeys } = require('./helpers/fetchTMDB');
const { downloadAndUpload } = require('./helpers/uploadToCloudinary');
const { trailerMap } = require('./helpers/trailerMap');

// ─── Content Schema (matches /models/Content.js with new fields) ─────────────
const contentSchema = new mongoose.Schema(
  {
    tmdbId: { type: String, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    originalTitle: { type: String },
    type: { type: String, enum: ['movie', 'series', 'documentary', 'short'], required: true },
    description: { type: String },
    longDescription: { type: String },
    genre: [{ type: String }],
    language: [{ type: String }],
    year: { type: Number },
    duration: { type: Number },
    rating: {
      imdb: { type: Number, default: 0 },
      platform: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    maturityRating: { type: String, default: 'ALL' },
    cast: [{ name: String, character: String, photo: String }],
    director: { type: String },
    producer: { type: String },
    studio: { type: String },
    thumbnailUrl: { type: String },
    backdropUrl: { type: String },
    trailerUrl: { type: String },
    videoUrl: { type: String },
    totalSeasons: { type: Number, default: 1 },
    seasons: [
      {
        seasonNumber: Number,
        title: String,
        posterUrl: String,
        airDate: Date,
        episodeCount: Number,
        episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
      },
    ],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newRelease: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'coming_soon'], default: 'active' },
  },
  { timestamps: true }
);

// ─── Episode Schema (matches /models/Episode.js with new fields) ─────────────
const episodeSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    season: { type: Number, required: true },
    episode: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number },
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
    airDate: { type: Date },
    introStart: { type: Number, default: 30 },
    introEnd: { type: Number, default: 120 },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);
const Episode = mongoose.models.Episode || mongoose.model('Episode', episodeSchema);

/**
 * Build a YouTube embed URL from a video key.
 */
function ytEmbed(key) {
  if (!key) return null;
  return `https://www.youtube.com/embed/${key}`;
}

/**
 * Collect all available YouTube keys for a series from TMDB:
 *   - series-level videos (trailers, clips, featurettes)
 *   - season-level videos
 *   - episode-level videos
 * Returns a pool of unique YouTube keys to assign to episodes.
 */
async function collectSeriesYouTubePool(tmdbId, seriesData, totalSeasons) {
  const pool = [];
  const seen = new Set();

  // 1. Series-level videos
  const seriesKeys = extractYouTubeKeys(seriesData.videos);
  for (const v of seriesKeys) {
    if (!seen.has(v.key)) { pool.push(v.key); seen.add(v.key); }
  }

  // 2. Season-level videos
  for (let s = 1; s <= totalSeasons; s++) {
    const seasonVids = await fetchSeasonVideosFromTMDB(tmdbId, s);
    await delay(250);
    const keys = extractYouTubeKeys(seasonVids);
    for (const v of keys) {
      if (!seen.has(v.key)) { pool.push(v.key); seen.add(v.key); }
    }
  }

  return pool;
}

// ─── Seed a Series ───────────────────────────────────────────────────────────
async function seedSeries(tmdbId, nameHint) {
  console.log(`\n📺 Processing: ${nameHint} (TMDB: ${tmdbId})`);

  // 1. Fetch from TMDB
  const data = await fetchSeriesFromTMDB(tmdbId);
  if (!data || data.status_message) {
    console.log(`  ⚠️ TMDB fetch failed for ${nameHint}: ${data?.status_message || 'unknown error'}`);
    return;
  }

  // 2. Download + Upload images to Cloudinary
  console.log(`  📸 Uploading images to Cloudinary...`);
  const [thumbnailUrl, backdropUrl] = await Promise.all([
    downloadAndUpload(
      buildTMDBImageUrl(data.poster_path, 'w500'),
      'posters',
      `series-${tmdbId}-poster`
    ),
    downloadAndUpload(
      buildTMDBImageUrl(data.backdrop_path, 'original'),
      'backdrops',
      `series-${tmdbId}-backdrop`
    ),
  ]);

  // 3. Upload cast photos to Cloudinary
  const cast = [];
  for (const c of (data.credits?.cast || []).slice(0, 10)) {
    const photoUrl = await downloadAndUpload(
      buildTMDBImageUrl(c.profile_path, 'w185'),
      'cast',
      `cast-${c.id}`
    );
    cast.push({ name: c.name, character: c.character, photo: photoUrl });
    await delay(100);
  }

  // 4. Get trailer YouTube embed URL (no download — just embed)
  const trailerKey =
    trailerMap[data.name] ||
    trailerMap[nameHint] ||
    getTrailerFromTMDB(data.videos);
  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`
    : null;

  // 5. Save/update Content in MongoDB (upsert by tmdbId)
  const content = await Content.findOneAndUpdate(
    { tmdbId: tmdbId.toString() },
    {
      tmdbId: tmdbId.toString(),
      title: data.name || data.original_name || nameHint,
      originalTitle: data.original_name,
      type: 'series',
      description: (data.overview || '').slice(0, 300),
      longDescription: data.overview || '',
      genre: (data.genres || []).map((g) => g.name),
      language: [...new Set([data.original_language, ...(data.languages || [])])].filter(Boolean),
      year: data.first_air_date ? new Date(data.first_air_date).getFullYear() : null,
      rating: {
        imdb: parseFloat(data.vote_average?.toFixed(1)) || 0,
        platform: parseFloat(data.vote_average?.toFixed(1)) || 0,
        count: data.vote_count || 0,
      },
      maturityRating: getMaturityRating(data),
      cast,
      director: getDirector(data.credits),
      studio: data.production_companies?.[0]?.name || '',
      thumbnailUrl: thumbnailUrl || buildTMDBImageUrl(data.poster_path, 'w500'),
      backdropUrl: backdropUrl || buildTMDBImageUrl(data.backdrop_path, 'original'),
      trailerUrl,
      videoUrl: trailerUrl,
      totalSeasons: data.number_of_seasons || 1,
      tags: [
        data.name || nameHint,
        ...(data.genres || []).map((g) => g.name),
      ].filter(Boolean),
      trending: data.vote_average > 7.5,
      newRelease: data.last_air_date && new Date(data.last_air_date) > new Date('2022-01-01'),
      views: Math.floor(Math.random() * 900000) + 100000,
      likes: Math.floor(Math.random() * 90000) + 10000,
      status: 'active',
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 6. Fetch all seasons + episodes + collect YouTube video pool
  const seasonsData = [];
  const totalSeasons = Math.min(data.number_of_seasons || 1, 5); // cap at 5 to keep seed fast

  console.log(`  🎥 Collecting YouTube videos from TMDB...`);
  const ytPool = await collectSeriesYouTubePool(tmdbId, data, totalSeasons);
  console.log(`  🎥 Found ${ytPool.length} YouTube videos for episodes`);

  let globalEpIndex = 0;

  for (let s = 1; s <= totalSeasons; s++) {
    console.log(`  📅 Season ${s}/${totalSeasons}...`);
    const seasonData = await fetchSeasonFromTMDB(tmdbId, s);
    await delay(400);

    if (!seasonData || seasonData.status_message) {
      console.log(`    ⚠️ Season ${s} not found, skipping`);
      continue;
    }

    // Upload season poster to Cloudinary
    const seasonPosterUrl = await downloadAndUpload(
      buildTMDBImageUrl(seasonData.poster_path, 'w500'),
      'season-posters',
      `series-${tmdbId}-season-${s}`
    );

    const episodeIds = [];
    const episodes = (seasonData.episodes || []).slice(0, 20); // cap episodes per season

    for (const ep of episodes) {
      // Upload episode thumbnail to Cloudinary
      const epThumb = await downloadAndUpload(
        buildTMDBImageUrl(ep.still_path, 'w300'),
        'episode-thumbs',
        `ep-${tmdbId}-s${s}-e${ep.episode_number}`
      );
      await delay(150);

      // Try to get episode-specific YouTube video from TMDB
      let epVideoUrl = null;
      const epVids = await fetchEpisodeVideosFromTMDB(tmdbId, s, ep.episode_number);
      await delay(200);
      const epKeys = extractYouTubeKeys(epVids);
      if (epKeys.length > 0) {
        epVideoUrl = ytEmbed(epKeys[0].key);
      } else if (ytPool.length > 0) {
        // Rotate through the series-level YouTube pool
        epVideoUrl = ytEmbed(ytPool[globalEpIndex % ytPool.length]);
      } else if (trailerKey) {
        // Fallback to the series trailer
        epVideoUrl = ytEmbed(trailerKey);
      }
      globalEpIndex++;

      const episode = await Episode.findOneAndUpdate(
        { contentId: content._id, season: s, episode: ep.episode_number },
        {
          contentId: content._id,
          season: s,
          episode: ep.episode_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          description: (ep.overview || '').slice(0, 500),
          duration: ep.runtime || 45,
          thumbnailUrl: epThumb || buildTMDBImageUrl(ep.still_path, 'w300'),
          airDate: ep.air_date ? new Date(ep.air_date) : null,
          videoUrl: epVideoUrl,
          introStart: 30,
          introEnd: 120,
        },
        { upsert: true, returnDocument: 'after' }
      );
      episodeIds.push(episode._id);
    }

    seasonsData.push({
      seasonNumber: s,
      title: seasonData.name || `Season ${s}`,
      posterUrl: seasonPosterUrl || buildTMDBImageUrl(seasonData.poster_path, 'w500'),
      airDate: seasonData.air_date ? new Date(seasonData.air_date) : null,
      episodeCount: episodeIds.length,
      episodes: episodeIds,
    });
  }

  // 7. Update content with all seasons
  await Content.findByIdAndUpdate(content._id, { seasons: seasonsData });
  console.log(
    `  ✅ Done: ${data.name || nameHint} — ${totalSeasons} season(s), all images on Cloudinary`
  );
}

// ─── Seed a Movie ────────────────────────────────────────────────────────────
async function seedMovie(tmdbId, nameHint) {
  console.log(`\n🎬 Processing: ${nameHint} (TMDB: ${tmdbId})`);

  const data = await fetchMovieFromTMDB(tmdbId);
  if (!data || data.status_message) {
    console.log(`  ⚠️ TMDB fetch failed for ${nameHint}: ${data?.status_message || 'unknown error'}`);
    return;
  }

  // Download + upload images to Cloudinary
  console.log(`  📸 Uploading images to Cloudinary...`);
  const [thumbnailUrl, backdropUrl] = await Promise.all([
    downloadAndUpload(
      buildTMDBImageUrl(data.poster_path, 'w500'),
      'posters',
      `movie-${tmdbId}-poster`
    ),
    downloadAndUpload(
      buildTMDBImageUrl(data.backdrop_path, 'original'),
      'backdrops',
      `movie-${tmdbId}-backdrop`
    ),
  ]);

  // Upload cast photos
  const cast = [];
  for (const c of (data.credits?.cast || []).slice(0, 10)) {
    const photoUrl = await downloadAndUpload(
      buildTMDBImageUrl(c.profile_path, 'w185'),
      'cast',
      `cast-${c.id}`
    );
    cast.push({ name: c.name, character: c.character, photo: photoUrl });
    await delay(100);
  }

  // Trailer embed URL
  const trailerKey =
    trailerMap[data.title] ||
    trailerMap[nameHint] ||
    getTrailerFromTMDB(data.videos);
  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0`
    : null;

  // Save/update movie in MongoDB (upsert by tmdbId)
  await Content.findOneAndUpdate(
    { tmdbId: tmdbId.toString() },
    {
      tmdbId: tmdbId.toString(),
      title: data.title || data.original_title || nameHint,
      originalTitle: data.original_title,
      type: 'movie',
      description: (data.overview || '').slice(0, 300),
      longDescription: data.overview || '',
      genre: (data.genres || []).map((g) => g.name),
      language: [data.original_language].filter(Boolean),
      year: data.release_date ? new Date(data.release_date).getFullYear() : null,
      duration: data.runtime || 120,
      rating: {
        imdb: parseFloat(data.vote_average?.toFixed(1)) || 0,
        platform: parseFloat(data.vote_average?.toFixed(1)) || 0,
        count: data.vote_count || 0,
      },
      maturityRating: getMaturityRating(data),
      cast,
      director: getDirector(data.credits),
      studio: data.production_companies?.[0]?.name || '',
      thumbnailUrl: thumbnailUrl || buildTMDBImageUrl(data.poster_path, 'w500'),
      backdropUrl: backdropUrl || buildTMDBImageUrl(data.backdrop_path, 'original'),
      trailerUrl,
      videoUrl: trailerUrl || (trailerKey ? ytEmbed(trailerKey) : null),
      tags: [
        data.title || nameHint,
        ...(data.genres || []).map((g) => g.name),
      ].filter(Boolean),
      trending: data.vote_average > 7.5,
      newRelease: data.release_date && new Date(data.release_date) > new Date('2020-01-01'),
      views: Math.floor(Math.random() * 2000000) + 500000,
      likes: Math.floor(Math.random() * 200000) + 50000,
      status: 'active',
    },
    { upsert: true, returnDocument: 'after' }
  );

  console.log(`  ✅ Done: ${data.title || nameHint} — all images on Cloudinary`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTrailerFromTMDB(videos) {
  if (!videos?.results?.length) return null;
  const trailer = videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  return trailer?.key || null;
}

function getDirector(credits) {
  if (!credits?.crew) return '';
  const dir = credits.crew.find((c) => c.job === 'Director');
  return dir?.name || '';
}

function getMaturityRating(data) {
  if (data.adult) return 'R';
  const avg = data.vote_average || 0;
  if (avg >= 8) return 'TV-MA';
  return 'TV-14';
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = { seedSeries, seedMovie };
