/**
 * Quick video URL updater — Updates all series/movie/episode videoUrls
 * with real YouTube videos from TMDB. Does NOT re-upload images.
 *
 * Usage: node scripts/updateVideos.js
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { fetchSeriesFromTMDB, fetchSeasonVideosFromTMDB, fetchEpisodeVideosFromTMDB, fetchMovieFromTMDB, extractYouTubeKeys } = require('./helpers/fetchTMDB');
const { trailerMap } = require('./helpers/trailerMap');

// ─── Schemas ─────────────────────────────────────────────────────────────────
const contentSchema = new mongoose.Schema({
  tmdbId: String, title: String, type: String,
  trailerUrl: String, videoUrl: String
}, { strict: false, timestamps: true });

const episodeSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  season: Number, episode: Number, title: String,
  videoUrl: String
}, { strict: false, timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);
const Episode = mongoose.models.Episode || mongoose.model('Episode', episodeSchema);

function ytEmbed(key) {
  return key ? `https://www.youtube.com/embed/${key}` : null;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!process.env.MONGODB_URI || !process.env.TMDB_API_KEY) {
    console.error('❌ Need MONGODB_URI and TMDB_API_KEY in .env.local');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔌 Connected to MongoDB\n');

  const allContent = await Content.find({}).lean();
  console.log(`📋 Found ${allContent.length} content items\n`);

  for (const c of allContent) {
    const tmdbId = c.tmdbId;
    if (!tmdbId) { console.log(`  ⚠️ ${c.title} — no tmdbId, skipping`); continue; }

    if (c.type === 'movie') {
      // ─── Movie: use trailer as videoUrl ─────────────────────────
      console.log(`🎬 ${c.title}`);
      const data = await fetchMovieFromTMDB(tmdbId);
      await delay(300);

      const trailerKey = trailerMap[c.title] || getTrailerKey(data?.videos);
      const allKeys = extractYouTubeKeys(data?.videos);
      
      // Use first clip/featurette if available, else trailer
      const videoKey = allKeys.length > 0 ? allKeys[0].key : trailerKey;
      const trailerUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0`
        : c.trailerUrl;
      const videoUrl = ytEmbed(videoKey) || trailerUrl;

      await Content.findByIdAndUpdate(c._id, { videoUrl, trailerUrl: trailerUrl || c.trailerUrl });
      console.log(`   ✅ videoUrl = ${videoUrl}`);

    } else if (c.type === 'series') {
      // ─── Series: trailer for content + real YT per episode ──────
      console.log(`📺 ${c.title}`);
      const data = await fetchSeriesFromTMDB(tmdbId);
      await delay(300);

      const trailerKey = trailerMap[c.title] || trailerMap[c.originalTitle] || getTrailerKey(data?.videos);
      const trailerUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`
        : c.trailerUrl;
      
      // Set series-level videoUrl to trailer
      await Content.findByIdAndUpdate(c._id, { videoUrl: trailerUrl, trailerUrl: trailerUrl || c.trailerUrl });
      console.log(`   ✅ series videoUrl = trailer`);

      // Collect YouTube pool from series + season level
      const ytPool = [];
      const seen = new Set();
      const seriesKeys = extractYouTubeKeys(data?.videos);
      for (const v of seriesKeys) {
        if (!seen.has(v.key)) { ytPool.push(v.key); seen.add(v.key); }
      }

      const totalSeasons = Math.min(data?.number_of_seasons || 1, 5);
      for (let s = 1; s <= totalSeasons; s++) {
        const seasonVids = await fetchSeasonVideosFromTMDB(tmdbId, s);
        await delay(200);
        const keys = extractYouTubeKeys(seasonVids);
        for (const v of keys) {
          if (!seen.has(v.key)) { ytPool.push(v.key); seen.add(v.key); }
        }
      }
      console.log(`   🎥 Found ${ytPool.length} YouTube videos in pool`);

      // Update each episode
      const episodes = await Episode.find({ contentId: c._id }).sort({ season: 1, episode: 1 }).lean();
      let epIdx = 0;

      for (const ep of episodes) {
        let epVideoUrl = null;

        // Try episode-specific videos from TMDB
        const epVids = await fetchEpisodeVideosFromTMDB(tmdbId, ep.season, ep.episode);
        await delay(150);
        const epKeys = extractYouTubeKeys(epVids);

        if (epKeys.length > 0) {
          epVideoUrl = ytEmbed(epKeys[0].key);
        } else if (ytPool.length > 0) {
          epVideoUrl = ytEmbed(ytPool[epIdx % ytPool.length]);
        } else if (trailerKey) {
          epVideoUrl = ytEmbed(trailerKey);
        }

        await Episode.findByIdAndUpdate(ep._id, { videoUrl: epVideoUrl });
        epIdx++;
      }
      console.log(`   ✅ Updated ${episodes.length} episodes with YouTube videos`);
    }
    console.log('');
  }

  console.log('🎉 All video URLs updated!');
  process.exit(0);
}

function getTrailerKey(videos) {
  if (!videos?.results?.length) return null;
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer?.key || null;
}

main().catch(e => { console.error(e); process.exit(1); });
