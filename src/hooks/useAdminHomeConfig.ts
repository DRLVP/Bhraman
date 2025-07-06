'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';

// Hero section interface
interface HeroSection {
  heading: string;
  subheading: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

// Featured packages section interface
interface FeaturedPackagesSection {
  heading: string;
  subheading: string;
  packageIds: string[];
}

// Testimonial interface
interface Testimonial {
  name: string;
  location: string;
  image?: string;
  rating: number;
  text: string;
}

// Testimonials section interface
interface TestimonialsSection {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

// About section interface
interface AboutSection {
  heading: string;
  content: string;
  image: string;
}

// Contact section interface
interface ContactSection {
  heading: string;
  subheading: string;
  email: string;
  phone: string;
  address: string;
}

// SEO interface
interface SEO {
  title: string;
  description: string;
  keywords: string[];
}

// HomeConfig interface
interface HomeConfig {
  _id: string;
  heroSection: HeroSection;
  featuredPackagesSection: FeaturedPackagesSection;
  testimonialsSection: TestimonialsSection;
  aboutSection: AboutSection;
  contactSection: ContactSection;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

interface UseAdminHomeConfigReturn {
  homeConfig: HomeConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchHomeConfig: () => Promise<HomeConfig | null>;
  updateHomeConfig: (configData: Partial<HomeConfig>) => Promise<HomeConfig | null>;
  updateHeroSection: (heroData: Partial<HeroSection>) => Promise<HomeConfig | null>;
  updateFeaturedPackagesSection: (featuredData: Partial<FeaturedPackagesSection>) => Promise<HomeConfig | null>;
  updateTestimonialsSection: (testimonialsData: Partial<TestimonialsSection>) => Promise<HomeConfig | null>;
  updateAboutSection: (aboutData: Partial<AboutSection>) => Promise<HomeConfig | null>;
  updateContactSection: (contactData: Partial<ContactSection>) => Promise<HomeConfig | null>;
  updateSEO: (seoData: Partial<SEO>) => Promise<HomeConfig | null>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<HomeConfig | null>;
  removeTestimonial: (index: number) => Promise<HomeConfig | null>;
  updateTestimonial: (index: number, testimonial: Partial<Testimonial>) => Promise<HomeConfig | null>;
}

export function useAdminHomeConfig(): UseAdminHomeConfigReturn {
  const { isAdmin } = useAdminAuth();
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeConfig = useCallback(async (): Promise<HomeConfig | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/home-config');

      if (!response.ok) {
        throw new Error('Failed to fetch home configuration');
      }

      const { data } = await response.json();
      setHomeConfig(data);
      return data;
    } catch (err) {
      console.error('Error fetching home config:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updateHomeConfig = useCallback(async (
    configData: Partial<HomeConfig>
  ): Promise<HomeConfig | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/home-config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update home configuration');
      }

      const { data } = await response.json();
      setHomeConfig(data);
      return data;
    } catch (err) {
      console.error('Error updating home config:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Helper function to update a specific section
  const updateSection = useCallback(async <T>(sectionName: string, sectionData: Partial<T>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ [sectionName]: sectionData } as Partial<HomeConfig>);
  }, [updateHomeConfig]);

  // Section-specific update functions
  const updateHeroSection = useCallback(async (heroData: Partial<HeroSection>): Promise<HomeConfig | null> => {
    return updateSection<HeroSection>('heroSection', heroData);
  }, [updateSection]);

  const updateFeaturedPackagesSection = useCallback(async (featuredData: Partial<FeaturedPackagesSection>): Promise<HomeConfig | null> => {
    return updateSection<FeaturedPackagesSection>('featuredPackagesSection', featuredData);
  }, [updateSection]);

  const updateTestimonialsSection = useCallback(async (testimonialsData: Partial<TestimonialsSection>): Promise<HomeConfig | null> => {
    return updateSection<TestimonialsSection>('testimonialsSection', testimonialsData);
  }, [updateSection]);

  const updateAboutSection = useCallback(async (aboutData: Partial<AboutSection>): Promise<HomeConfig | null> => {
    return updateSection<AboutSection>('aboutSection', aboutData);
  }, [updateSection]);

  const updateContactSection = useCallback(async (contactData: Partial<ContactSection>): Promise<HomeConfig | null> => {
    return updateSection<ContactSection>('contactSection', contactData);
  }, [updateSection]);

  const updateSEO = useCallback(async (seoData: Partial<SEO>): Promise<HomeConfig | null> => {
    return updateSection<SEO>('seo', seoData);
  }, [updateSection]);

  // Testimonial-specific functions
  const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      await fetchHomeConfig();
    }

    if (!homeConfig) {
      setError('Home configuration not loaded');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials, testimonial];
    
    return updateTestimonialsSection({
      testimonials: updatedTestimonials
    });
  }, [homeConfig, fetchHomeConfig, updateTestimonialsSection]);

  const removeTestimonial = useCallback(async (index: number): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      setError('Home configuration not loaded');
      return null;
    }

    if (index < 0 || index >= homeConfig.testimonialsSection.testimonials.length) {
      setError('Invalid testimonial index');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials];
    updatedTestimonials.splice(index, 1);
    
    return updateTestimonialsSection({
      testimonials: updatedTestimonials
    });
  }, [homeConfig, updateTestimonialsSection]);

  const updateTestimonial = useCallback(async (index: number, testimonial: Partial<Testimonial>): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      setError('Home configuration not loaded');
      return null;
    }

    if (index < 0 || index >= homeConfig.testimonialsSection.testimonials.length) {
      setError('Invalid testimonial index');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      ...testimonial
    };
    
    return updateTestimonialsSection({
      testimonials: updatedTestimonials
    });
  }, [homeConfig, updateTestimonialsSection]);

  return {
    homeConfig,
    isLoading,
    error,
    fetchHomeConfig,
    updateHomeConfig,
    updateHeroSection,
    updateFeaturedPackagesSection,
    updateTestimonialsSection,
    updateAboutSection,
    updateContactSection,
    updateSEO,
    addTestimonial,
    removeTestimonial,
    updateTestimonial,
  };
}