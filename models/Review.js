import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String },
    likes: { type: Number, default: 0 },
    spoiler: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ contentId: 1 });
reviewSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
