/**
 * CineWave Database Seeder — Main Runner
 * ═══════════════════════════════════════
 * Fetches REAL content from TMDB, downloads all images, uploads to Cloudinary,
 * and saves everything to MongoDB. Runs ONCE — auto-skips if already seeded.
 *
 * Usage:
 *   npm run seed          →  seed (skips if already done)
 *   npm run seed:force    →  force re-seed everything
 *   npm run seed:clear    →  wipe content from DB, then re-seed
 *   npm run seed:users    →  seed only demo users
 *
 * Prerequisites:
 *   - MONGODB_URI in .env.local (already configured)
 *   - CLOUDINARY_* keys in .env.local (already configured)
 *   - TMDB_API_KEY in .env.local (get free at themoviedb.org/settings/api)
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const { seedSeries, seedMovie } = require('./seedContent');
const { seedDemoUsers } = require('./seedUsers');

// ─── Data sources ────────────────────────────────────────────────────────────
const { koreanDramas } = require('./data/koreanDramas');
const { turkishDramas } = require('./data/turkishDramas');
const { hindiSeries } = require('./data/hindiSeries');
const { internationalSeries } = require('./data/international');
const { movies } = require('./data/movies');

// ─── Content Schema (for counting — matches /models/Content.js) ──────────────
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
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

// ─── Validate env ────────────────────────────────────────────────────────────
function validateEnv() {
  const required = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'TMDB_API_KEY'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing environment variables in .env.local:\n   ${missing.join(', ')}`);
    if (missing.includes('TMDB_API_KEY')) {
      console.error('\n   Get a free TMDB API key at: https://www.themoviedb.org/settings/api');
    }
    process.exit(1);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  validateEnv();

  // Connect to MongoDB (same URI as lib/db.js)
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  console.log('✅ MongoDB connected');
  console.log('☁️  Cloudinary: using existing config from .env.local\n');

  // ── Auto-skip check ──
  const forceReseed = process.argv.includes('--force');
  if (!forceReseed) {
    const count = await Content.countDocuments();
    if (count >= 20) {
      console.log(`✅ Already seeded (${count} content items found). Skipping.`);
      console.log('   To force re-seed: npm run seed:force');
      process.exit(0);
    }
  }

  const startTime = Date.now();
  console.log('🌱 Starting CineWave database seed...\n');

  // ── 1. Seed demo users ──
  await seedDemoUsers();

  // ── 2. Seed all series ──
  const allSeries = [
    ...koreanDramas,
    ...turkishDramas,
    ...hindiSeries,
    ...internationalSeries,
  ];
  console.log(`\n📺 Seeding ${allSeries.length} series...`);
  for (const item of allSeries) {
    try {
      await seedSeries(item.tmdbId, item.name);
      await delay(600); // rate limit protection
    } catch (err) {
      console.error(`  ❌ Failed to seed ${item.name}: ${err.message}`);
    }
  }

  // ── 3. Seed movies ──
  console.log(`\n🎬 Seeding ${movies.length} movies...`);
  for (const movie of movies) {
    try {
      await seedMovie(movie.tmdbId, movie.name);
      await delay(600);
    } catch (err) {
      console.error(`  ❌ Failed to seed ${movie.name}: ${err.message}`);
    }
  }

  // ── 4. Mark featured content ──
  await markFeatured();

  // ── Done ──
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const finalCount = await Content.countDocuments();
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ Seeding complete! ${finalCount} content items in ${elapsed} minutes.`);
  console.log(`${'═'.repeat(60)}`);
  console.log('\n📧 Demo accounts:');
  console.log('   Admin:     admin@cinewave.com   / Admin@123');
  console.log('   User:      test@cinewave.com    / Test@123');
  console.log('   Expired:   expired@cinewave.com / Test@123');
  console.log('');

  process.exit(0);
}

// ─── Mark Featured Content ───────────────────────────────────────────────────
async function markFeatured() {
  const featuredTitles = [
    'Squid Game',
    'Breaking Bad',
    'Money Heist',
    'Mirzapur',
    'Crash Landing on You',
    'Parasite',
    'Dark',
  ];
  const result = await Content.updateMany(
    { title: { $in: featuredTitles } },
    { featured: true, trending: true }
  );
  console.log(`\n⭐ Marked ${result.modifiedCount || 0} items as featured/trending`);
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
