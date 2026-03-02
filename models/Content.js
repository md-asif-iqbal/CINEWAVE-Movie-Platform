import mongoose from 'mongoose';

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
    cast: [
      {
        name: String,
        character: String,
        photo: String,
      },
    ],
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

contentSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { language_override: 'textSearchLang' }
);
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ genre: 1 });
contentSchema.index({ trending: 1 });
contentSchema.index({ featured: 1 });
contentSchema.index({ newRelease: 1 });
contentSchema.index({ createdAt: -1 });

export default mongoose.models.Content || mongoose.model('Content', contentSchema);
