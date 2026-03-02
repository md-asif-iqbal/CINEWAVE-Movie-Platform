/**
 * Seed Demo Users
 * ═══════════════
 * Creates 3 demo accounts: admin, test user, expired user.
 * Uses upsert — safe to run multiple times.
 *
 * Run standalone: node scripts/seedUsers.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// ─── User Schema (matches /models/User.js) ──────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String },
    firebaseUid: { type: String, sparse: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    trialStartDate: { type: Date, default: Date.now },
    trialEndDate: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    trialExtendedBy: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Seed Function ───────────────────────────────────────────────────────────
async function seedDemoUsers() {
  console.log('\n👤 Seeding demo users...');

  const users = [
    {
      name: 'Admin',
      email: 'admin@cinewave.com',
      password: 'Admin@123',
      role: 'admin',
      trialStartDate: new Date(),
      trialEndDate: new Date('2099-01-01'),
      isEmailVerified: true,
    },
    {
      name: 'Test User',
      email: 'test@cinewave.com',
      password: 'Test@123',
      role: 'user',
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      isEmailVerified: true,
    },
    {
      name: 'Expired User',
      email: 'expired@cinewave.com',
      password: 'Test@123',
      role: 'user',
      trialStartDate: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000),
      trialEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      isEmailVerified: true,
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.findOneAndUpdate(
      { email: u.email },
      {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        trialStartDate: u.trialStartDate,
        trialEndDate: u.trialEndDate,
        isEmailVerified: u.isEmailVerified,
      },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`  ✅ User: ${u.email} (${u.role})`);
  }
}

// ─── Standalone runner ───────────────────────────────────────────────────────
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }
  mongoose
    .connect(MONGODB_URI)
    .then(() => seedDemoUsers())
    .then(() => {
      console.log('\n✅ Demo users seeded!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = { seedDemoUsers };
