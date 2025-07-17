import mongoose, { Document, Schema } from 'mongoose';

/**
 * Hero section interface
 */
interface IHeroSection {
  heading: string;
  subheading: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * Featured packages section interface
 */
interface IFeaturedPackagesSection {
  heading: string;
  subheading: string;
  packageIds: mongoose.Types.ObjectId[];
}

/**
 * Testimonial interface
 */
interface ITestimonial {
  name: string;
  location: string;
  image?: string;
  rating: number;
  text: string;
}

/**
 * Testimonials section interface
 */
interface ITestimonialsSection {
  heading: string;
  subheading: string;
  testimonials: ITestimonial[];
}

/**
 * About section interface
 */
interface IAboutSection {
  heading: string;
  content: string;
  image: string;
}

/**
 * Contact section interface
 */
interface IContactSection {
  heading: string;
  subheading: string;
  email: string;
  phone: string;
  address: string;
  workingHours?: string;
}

/**
 * SEO interface
 */
interface ISEO {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * Social Media Link interface
 */
interface ISocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

/**
 * Site settings interface
 */
interface ISiteSettings {
  logo: string;
  socialMediaLinks?: ISocialMediaLink[];
}

/**
 * HomeConfig document interface
 */
export interface IHomeConfig extends Document {
  siteSettings: ISiteSettings;
  heroSection: IHeroSection;
  featuredPackagesSection: IFeaturedPackagesSection;
  testimonialsSection: ITestimonialsSection;
  aboutSection: IAboutSection;
  contactSection: IContactSection;
  seo: ISEO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * HomeConfig schema definition
 */
const HomeConfigSchema = new Schema<IHomeConfig>(
  {
    siteSettings: {
      logo: {
        type: String,
        default: '',
      },
      socialMediaLinks: [
        {
          platform: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          icon: {
            type: String,
            required: true,
          },
        },
      ],
    },
    heroSection: {
      heading: {
        type: String,
        required: true,
      },
      subheading: {
        type: String,
        required: true,
      },
      backgroundImage: {
        type: String,
        required: true,
      },
      ctaText: {
        type: String,
        required: true,
      },
      ctaLink: {
        type: String,
        required: true,
      },
    },
    featuredPackagesSection: {
      heading: {
        type: String,
        required: true,
      },
      subheading: {
        type: String,
        required: true,
      },
      packageIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Package',
        },
      ],
    },
    testimonialsSection: {
      heading: {
        type: String,
        required: true,
      },
      subheading: {
        type: String,
        required: true,
      },
      testimonials: [
        {
          name: {
            type: String,
            required: true,
          },
          location: {
            type: String,
            required: true,
          },
          image: {
            type: String,
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
    },
    aboutSection: {
      heading: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
    contactSection: {
      heading: {
        type: String,
        required: true,
      },
      subheading: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      workingHours: {
        type: String,
        required: false,
      },
    },
    seo: {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      keywords: [
        {
          type: String,
          required: true,
        },
      ],
    },
  },
  { timestamps: true },
);

// Check if model exists before creating a new one (for Next.js hot reloading)
const HomeConfig = mongoose.models.HomeConfig || mongoose.model<IHomeConfig>('HomeConfig', HomeConfigSchema);

export default HomeConfig;