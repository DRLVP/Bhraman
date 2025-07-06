import mongoose, { Document, Schema } from 'mongoose';

/**
 * Package document interface
 */
export interface IPackage extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: number; // in days
  location: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
  featured: boolean;
  maxGroupSize: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Package schema definition
 */
const PackageSchema = new Schema<IPackage>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    images: [{
      type: String,
      required: true,
    }],
    inclusions: [{
      type: String,
    }],
    exclusions: [{
      type: String,
    }],
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    maxGroupSize: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

// Check if model exists before creating a new one (for Next.js hot reloading)
const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;