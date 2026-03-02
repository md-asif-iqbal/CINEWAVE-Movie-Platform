import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '/avatars/default.png' },
    isKidsProfile: { type: Boolean, default: false },
    language: { type: String, default: 'bn' },
    maturityRating: { type: String, default: 'ALL' },
    preferences: {
      genres: [String],
      autoplay: { type: Boolean, default: true },
      autoplayPreviews: { type: Boolean, default: false },
    },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    watchHistory: [
      {
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
        episode: { type: mongoose.Schema.Types.ObjectId, ref: 'Episode' },
        watchedAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 },
        duration: { type: Number, default: 0 },
      },
    ],
    likedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 });

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
