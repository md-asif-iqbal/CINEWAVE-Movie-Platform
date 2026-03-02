/**
 * Clear Database — Wipes all Content and Episode documents.
 * Users are kept intact. Run: npm run seed:clear
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Minimal schemas for deletion
const Content =
  mongoose.models.Content ||
  mongoose.model(
    'Content',
    new mongoose.Schema({}, { timestamps: true, strict: false })
  );

const Episode =
  mongoose.models.Episode ||
  mongoose.model(
    'Episode',
    new mongoose.Schema({}, { timestamps: true, strict: false })
  );

const Review =
  mongoose.models.Review ||
  mongoose.model(
    'Review',
    new mongoose.Schema({}, { timestamps: true, strict: false })
  );

async function clear() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅ Connected\n');

  const contentCount = await Content.countDocuments();
  const episodeCount = await Episode.countDocuments();
  const reviewCount = await Review.countDocuments();

  await Content.deleteMany({});
  await Episode.deleteMany({});
  await Review.deleteMany({});

  console.log(`🗑️  Deleted ${contentCount} content items`);
  console.log(`🗑️  Deleted ${episodeCount} episodes`);
  console.log(`🗑️  Deleted ${reviewCount} reviews`);
  console.log('\n✅ Database cleared (users kept intact)');
  console.log('   Now run: npm run seed:force');
  process.exit(0);
}

clear().catch((err) => {
  console.error('❌ Clear failed:', err);
  process.exit(1);
});
