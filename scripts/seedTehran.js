/**
 * Tehran Series Seeder — Self-contained, no Cloudinary / no TMDB API needed
 * ═════════════════════════════════════════════════════════════════════════════
 * All metadata hardcoded. Images from TMDB CDN + YouTube thumbnails.
 * Episode video URLs point to YOUR unlisted YouTube uploads.
 *
 * Usage:   npm run seed:tehran
 *
 * To add more episodes later, just add entries to EPISODES array below.
 *
 * Prerequisites:
 *   - MONGODB_URI in .env.local
 *   - YouTube videos set to "Unlisted" (not Private)
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════════
// EPISODE LIST — Add/remove episodes here. YouTube ID is auto-extracted.
// Naming format from your uploads: "Tehran S01E02 1080p ATVP WEBRip ..."
// ═══════════════════════════════════════════════════════════════════════════════

const EPISODES = [
  // ── Season 1 ──────────────────────────────────────────────
  { season: 1, episode: 2, youtubeId: 'GVj8ScxeIAM' },
  { season: 1, episode: 3, youtubeId: 'Bp4Itd0E3CE' },
  { season: 1, episode: 4, youtubeId: 'FX4yi5QHR3U' },
  { season: 1, episode: 5, youtubeId: 'W_Ok23PgIlQ' },
  { season: 1, episode: 7, youtubeId: 'OYdU45AF4fo' },
  { season: 1, episode: 8, youtubeId: 'c2zdBBngwWU' },

  // ── Season 2 ──────────────────────────────────────────────
  { season: 2, episode: 1, youtubeId: 'smMkkOTm1_A' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SERIES METADATA — Hardcoded (no API calls needed)
// ═══════════════════════════════════════════════════════════════════════════════

const SERIES_META = {
  tmdbId: '97218',
  title: 'Tehran',
  originalTitle: 'טהרן',
  type: 'series',
  description:
    'A Mossad agent goes deep undercover on a dangerous mission in Tehran that places her and everyone around her in jeopardy.',
  longDescription:
    "Tamar is a Mossad hacker agent who infiltrates Tehran under a false identity to help destroy Iran's nuclear reactor. But when her mission fails and she is stuck in Tehran, she must find a way to survive while keeping her true identity hidden. As she navigates the dangerous streets of Tehran, she becomes entangled in a complex web of political intrigue, personal relationships, and life-threatening situations that challenge everything she thought she knew.",
  genre: ['Drama', 'Action & Adventure', 'War & Politics', 'Thriller'],
  language: ['he', 'fa', 'en'],
  year: 2020,
  duration: 45,
  rating: { imdb: 7.5, platform: 7.5, count: 450 },
  maturityRating: 'TV-MA',
  cast: [
    { name: 'Niv Sultan',       character: 'Tamar Rabinyan', photo: 'https://image.tmdb.org/t/p/w185/hViVOEv7upsoRGylzRmqKMSeHVd.jpg' },
    { name: 'Shaun Toub',       character: 'Faraz Kamali',   photo: 'https://image.tmdb.org/t/p/w185/iJmAMWjTfFssgqBvCd8ByOzHlHh.jpg' },
    { name: 'Navid Negahban',   character: 'Masoud Tabrizi', photo: 'https://image.tmdb.org/t/p/w185/aTzZMxFEtrl3QpOfkZlFQmnXdDC.jpg' },
    { name: 'Shervin Alenabi',  character: 'Milad',          photo: 'https://image.tmdb.org/t/p/w185/5rQRq4RM7axFYBXGlIJFEprunVi.jpg' },
    { name: 'Liraz Charhi',     character: 'Yael Kadosh',    photo: 'https://image.tmdb.org/t/p/w185/d1r6g3bXNcBGuvhqvXMiMYSjhJQ.jpg' },
    { name: 'Menashe Noy',      character: 'Meir Gorev',     photo: 'https://image.tmdb.org/t/p/w185/bBtVRPNjp6SStBbkzHQa5VnZrQB.jpg' },
  ],
  director: 'Daniel Syrkin',
  studio: 'Apple TV+',
  thumbnailUrl: 'https://image.tmdb.org/t/p/w500/wrBWeNEeMnkQ0seEkNxJJjL1YJG.jpg',
  backdropUrl: 'https://image.tmdb.org/t/p/original/nm0bIZSExJmSOr5q7JuFZmUCZJ0.jpg',
  tags: ['Tehran', 'Spy', 'Thriller', 'Israel', 'Iran', 'Mossad', 'Espionage', 'Apple TV+', 'Drama'],
};

// Episode titles & descriptions from TMDB (hardcoded)
const EP_META = {
  '1-1': { title: 'Pilot',                 desc: "Tamar, a Mossad hacker-Loss agent, infiltrates Tehran under a false identity to help carry out a mission that could change the balance of power." },
  '1-2': { title: 'Someday We\'ll Tell Each Other Everything', desc: "Tamar tries to complete her hacking mission while Faraz, an IRGC intelligence officer, picks up unusual activity and starts investigating." },
  '1-3': { title: 'Deadline',              desc: "With her cover at risk, Tamar races against the clock. Faraz closes in on the trail of the infiltrator while Tamar faces unexpected complications." },
  '1-4': { title: 'The Boyfriend',         desc: "Tamar becomes involved with Milad and must balance personal feelings with her mission. Faraz interrogates people connected to suspicious activities." },
  '1-5': { title: 'The Other Side',        desc: "With her cover under threat, Tamar faces an impossible choice between completing her mission and protecting the people she cares about." },
  '1-6': { title: 'Tehrangeles',           desc: "Alliances shift as both Israeli and Iranian intelligence make critical moves. Tamar must adapt to survive as her mission takes a dangerous turn." },
  '1-7': { title: 'Friends',              desc: "Faraz discovers a crucial lead that could expose the entire Mossad operation. Trusted relationships are tested to their breaking point." },
  '1-8': { title: 'Kill Tamar',           desc: "In the heart-pounding season finale, Tamar must make her most difficult choice yet. With enemies closing in, she risks everything in a desperate gambit." },
  '2-1': { title: 'Change of Plans',      desc: "Tamar returns to Tehran on a new mission. The stakes are higher than ever and she faces new threats from both expected and unexpected sources." },
  '2-2': { title: 'The Prodigal Daughter', desc: "Tamar navigates a complex web of relationships in Tehran while trying to accomplish her new objective. Faraz deals with the consequences of past events." },
  '2-3': { title: 'Roya',                 desc: "A new alliance is formed. Tamar goes deeper undercover as the situation in Tehran becomes more volatile and her loyalties are tested." },
  '2-4': { title: 'Exposed',              desc: "A major reveal threatens everything. Tamar scrambles to protect herself and her allies as the walls close in around her." },
  '2-5': { title: 'Operation Big Hug',    desc: "Mossad launches a daring operation. Tamar takes center stage in a high-risk plan that could succeed brilliantly or fail catastrophically." },
  '2-6': { title: 'Goodbye, Faraz',       desc: "Faraz faces a life-changing moment. The power dynamics shift as loyalties are revealed and betrayals come to light." },
  '2-7': { title: 'Don\'t Think Twice',    desc: "The final pieces fall into place. Tamar and her team face their greatest challenge as the mission reaches its climax." },
  '2-8': { title: 'The Mole',             desc: "In an explosive season finale, secrets are revealed and scores are settled. Nothing will ever be the same for Tamar or those around her." },
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

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

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log('✅ MongoDB connected\n');

  // Figure out which seasons we have
  const seasonNumbers = [...new Set(EPISODES.map((e) => e.season))].sort();
  const totalSeasons = Math.max(...seasonNumbers);
  console.log(`📺 Seeding Tehran — ${EPISODES.length} episodes across ${totalSeasons} season(s)\n`);

  const s = SERIES_META;

  // Use first available episode as trailer
  const trailerKey = EPISODES[0].youtubeId;
  const trailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`;

  // 1. Save Content
  const content = await Content.findOneAndUpdate(
    { tmdbId: s.tmdbId },
    {
      tmdbId: s.tmdbId,
      title: s.title,
      originalTitle: s.originalTitle,
      type: s.type,
      description: s.description,
      longDescription: s.longDescription,
      genre: s.genre,
      language: s.language,
      year: s.year,
      duration: s.duration,
      rating: s.rating,
      maturityRating: s.maturityRating,
      cast: s.cast,
      director: s.director,
      studio: s.studio,
      thumbnailUrl: s.thumbnailUrl,
      backdropUrl: s.backdropUrl,
      trailerUrl,
      videoUrl: trailerUrl,
      totalSeasons,
      tags: s.tags,
      featured: true,
      trending: true,
      newRelease: true,
      views: Math.floor(Math.random() * 500000) + 100000,
      likes: Math.floor(Math.random() * 50000) + 10000,
      status: 'active',
    },
    { upsert: true, returnDocument: 'after' }
  );
  console.log(`  ✅ Content: ${s.title} (ID: ${content._id})\n`);

  // 2. Save Episodes by season
  const seasonsData = [];

  for (const sNum of seasonNumbers) {
    const seasonEps = EPISODES.filter((e) => e.season === sNum).sort((a, b) => a.episode - b.episode);
    console.log(`  📅 Season ${sNum} (${seasonEps.length} episodes):`);

    const episodeIds = [];

    for (const ep of seasonEps) {
      const key = `${ep.season}-${ep.episode}`;
      const meta = EP_META[key] || { title: `Episode ${ep.episode}`, desc: `Tehran S${ep.season}E${ep.episode}` };
      const videoUrl = `https://www.youtube.com/embed/${ep.youtubeId}`;
      // YouTube auto-generates thumbnails for every video — works for unlisted too
      const thumbnailUrl = `https://i.ytimg.com/vi/${ep.youtubeId}/hqdefault.jpg`;

      const savedEp = await Episode.findOneAndUpdate(
        { contentId: content._id, season: ep.season, episode: ep.episode },
        {
          contentId: content._id,
          season: ep.season,
          episode: ep.episode,
          title: meta.title,
          description: meta.desc,
          duration: 45,
          thumbnailUrl,
          videoUrl,
          airDate: ep.season === 1 ? new Date('2020-06-22') : new Date('2022-05-06'),
          introStart: 30,
          introEnd: 120,
        },
        { upsert: true, returnDocument: 'after' }
      );

      episodeIds.push(savedEp._id);
      console.log(`    ✅ S${String(sNum).padStart(2, '0')}E${String(ep.episode).padStart(2, '0')}: "${meta.title}" → youtu.be/${ep.youtubeId}`);
    }

    seasonsData.push({
      seasonNumber: sNum,
      title: `Season ${sNum}`,
      posterUrl: s.thumbnailUrl,
      airDate: sNum === 1 ? new Date('2020-06-22') : new Date('2022-05-06'),
      episodeCount: episodeIds.length,
      episodes: episodeIds,
    });
  }

  // 3. Update content with seasons
  await Content.findByIdAndUpdate(content._id, { seasons: seasonsData });

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ Tehran seeded — ${EPISODES.length} episodes, ${totalSeasons} season(s)`);
  console.log(`   Thumbnails: YouTube auto-thumbnails (i.ytimg.com)`);
  console.log(`   Poster/Backdrop: TMDB CDN (no Cloudinary)`);
  console.log(`${'═'.repeat(60)}`);

  // Check for missing episodes
  const missing = [];
  for (let s = 1; s <= totalSeasons; s++) {
    const have = EPISODES.filter((e) => e.season === s).map((e) => e.episode);
    const max = Math.max(...have, 8);
    for (let e = 1; e <= max; e++) {
      if (!have.includes(e)) missing.push(`S${String(s).padStart(2, '0')}E${String(e).padStart(2, '0')}`);
    }
  }
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing episodes (add YouTube IDs to EPISODES array):`);
    console.log(`   ${missing.join(', ')}`);
  }

  console.log('');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
