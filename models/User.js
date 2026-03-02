import mongoose from 'mongoose';

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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('isTrialActive').get(function () {
  return new Date() < this.trialEndDate;
});

userSchema.virtual('trialDaysRemaining').get(function () {
  const diff = this.trialEndDate - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ trialEndDate: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
