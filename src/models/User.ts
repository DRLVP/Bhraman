import mongoose, { Document, Schema } from 'mongoose';

/**
 * User document interface
 */
export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  phone?: string;
  role: string;
  permissions?: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true // Allows multiple documents to have no value for this field
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    permissions: {
      type: [String],
      default: []
    },
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

// Check if model exists before creating a new one (for Next.js hot reloading)
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;