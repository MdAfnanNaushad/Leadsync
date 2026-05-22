import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../constants/enums';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
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
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.SALES 
    }
  },
  { 
    timestamps: true 
  }
);

export const UserModel = model<IUserDocument>('User', userSchema);