import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: string; // Dynamic wallet address
  title: string;
  description: string;
  platform: string;
  deliverables: string[];
  status: 'PENDING' | 'NEGOTIATION' | 'IN_PROGRESS' | 'SUBMITTED' | 'ACCEPTED' | 'DECLINED';
  submission?: {
    link: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    trim: true
  },
  deliverables: [{
    type: String,
    required: [true, 'At least one deliverable is required']
  }],
  status: {
    type: String,
    enum: ['PENDING', 'NEGOTIATION', 'IN_PROGRESS', 'SUBMITTED', 'ACCEPTED', 'DECLINED'],
    default: 'PENDING'
  },
  submission: {
    link: String,
    description: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for faster queries
TaskSchema.index({ projectId: 1, userId: 1 });
TaskSchema.index({ status: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema); 