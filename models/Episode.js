import mongoose from 'mongoose';

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

episodeSchema.index({ contentId: 1, season: 1, episode: 1 });

export default mongoose.models.Episode || mongoose.model('Episode', episodeSchema);
