'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Define interfaces for the home config sections
interface SiteSettings {
  logo: string;
}

interface HeroSection {
  heading: string;
  subheading: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

interface FeaturedPackagesSection {
  heading: string;
  subheading: string;
  packageIds: string[];
}

interface Testimonial {
  name: string;
  location: string;
  image?: string;
  rating: number;
  text: string;
}

interface TestimonialsSection {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

interface AboutSection {
  heading: string;
  content: string;
  image: string;
}

interface ContactSection {
  heading: string;
  subheading: string;
  email: string;
  phone: string;
  address: string;
  workingHours?: string;
}

interface SEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface HomeConfig {
  _id: string;
  siteSettings: SiteSettings;
  heroSection: HeroSection;
  featuredPackagesSection: FeaturedPackagesSection;
  testimonialsSection: TestimonialsSection;
  aboutSection: AboutSection;
  contactSection: ContactSection;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

interface UseHomeConfigReturn {
  homeConfig: HomeConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchHomeConfig: () => Promise<HomeConfig | null>;
}

export function useHomeConfig(): UseHomeConfigReturn {
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeConfig = useCallback(async (): Promise<HomeConfig | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/home-config');
      setHomeConfig(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error('Error fetching home config:', err);
      setError(err.response?.data?.message || 'Failed to fetch home configuration');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeConfig();
  }, [fetchHomeConfig]);

  return {
    homeConfig,
    isLoading,
    error,
    fetchHomeConfig,
  };
}