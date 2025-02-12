import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: String,
  role: String,
  twitter: String,
  website: String,
  niches: [String],
  image: String,
});

const investmentProfileSchema = new mongoose.Schema({
  isInvestor: String,
  roundTypes: [String],
  ticketSize: [String],
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: String,
  lastname: String,
  primary_city: String,
  secondary_city: [String],
  roles: [String],
  projects: [projectSchema],
  isContentCreator: mongoose.Schema.Types.Mixed,
  contentCreatorDescription: String,
  contentPlatforms: [String],
  contentTypes: [String],
  platformLinks: { type: Map, of: String },
  FDV: [String],
  criterias: [String],
  equityOrToken: String,
  investmentProfile: investmentProfileSchema,
  bio: String,
  short_bio: String,
  extensive_bio: String,
  onboarding_completed: { type: Boolean, default: false },
  onboarding_step: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema); 