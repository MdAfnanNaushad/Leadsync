import { Schema, model, Document } from 'mongoose';
import { LeadStatus, LeadSource } from '../constants/enums';

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    status: { 
      type: String, 
      enum: Object.values(LeadStatus), 
      default: LeadStatus.NEW 
    },
    source: { 
      type: String, 
      enum: Object.values(LeadSource), 
      required: true 
    }
  },
  { 
    timestamps: true 
  }
);

// High-Performance Pipeline Compound Scanning Indexes
leadSchema.index({ status: 1, source: 1 });

// Text indices enabling flexible multi-property regex parsing inside repositories
leadSchema.index({ name: 'text', email: 'text' });

export const LeadModel = model<ILeadDocument>('Lead', leadSchema);