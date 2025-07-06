import mongoose, { Document, Schema } from 'mongoose';

/**
 * Admin document interface
 */
export interface IAdmin extends Document {
  clerkId: string;
  email: string;
  profileImage?: string;
  role: 'admin' | 'user';
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin schema definition
 */
const AdminSchema = new Schema<IAdmin>(
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
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    profileImage: {
      type: String,
    },
    permissions: {
      type: [String],
      default: [] // Empty array as all admins have full access by default
    },
    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

// Check if model exists before creating a new one (for Next.js hot reloading)
const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;