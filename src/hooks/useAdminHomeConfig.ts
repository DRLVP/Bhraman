'use client';

import { useState, useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

// Site settings interface
interface SiteSettings {
  logo: string;
}

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
  workingHours?: string;
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

// Return type for the hook
interface UseAdminHomeConfigReturn {
  homeConfig: HomeConfig | null;
  isLoading: boolean;
  error: string | null;
  fetchHomeConfig: () => Promise<HomeConfig | null>;
  updateHomeConfig: (configData: Partial<HomeConfig>) => Promise<HomeConfig | null>;
  updateSiteSettings: (siteSettingsData: Partial<SiteSettings>) => Promise<HomeConfig | null>;
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
  const { toast } = useToast();

  const fetchHomeConfig = useCallback(async (): Promise<HomeConfig | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('/api/admin/home-config');
      setHomeConfig(response.data.data);
      return response.data.data;
    } catch (err: unknown) {
      setError(
        (err as any)?.response?.data?.message || 
        (err as Error)?.message || 
        'Failed to fetch home config'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const updateHomeConfig = useCallback(async (configData: Partial<HomeConfig>): Promise<HomeConfig | null> => {
    if (!isAdmin) {
      setError('Admin access required');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.patch('/api/admin/home-config', configData);
      setHomeConfig(response.data.data);
      toast({
        title: 'Update successful',
        description: 'Home configuration has been updated successfully.',
        variant: 'default',
      });
      return response.data.data;
    } catch (err: unknown) {
      const errorMessage = 
        (err as any)?.response?.data?.message || 
        (err as Error)?.message || 
        'Failed to update home config';
      setError(errorMessage);
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, toast]);

  const updateSiteSettings = useCallback(async (siteSettingsData: Partial<SiteSettings>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ siteSettings: siteSettingsData });
  }, [updateHomeConfig]);

  const updateHeroSection = useCallback(async (heroData: Partial<HeroSection>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ heroSection: heroData });
  }, [updateHomeConfig]);

  const updateFeaturedPackagesSection = useCallback(async (featuredData: Partial<FeaturedPackagesSection>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ featuredPackagesSection: featuredData });
  }, [updateHomeConfig]);

  const updateTestimonialsSection = useCallback(async (testimonialsData: Partial<TestimonialsSection>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ testimonialsSection: testimonialsData });
  }, [updateHomeConfig]);

  const updateAboutSection = useCallback(async (aboutData: Partial<AboutSection>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ aboutSection: aboutData });
  }, [updateHomeConfig]);

  const updateContactSection = useCallback(async (contactData: Partial<ContactSection>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ contactSection: contactData });
  }, [updateHomeConfig]);

  const updateSEO = useCallback(async (seoData: Partial<SEO>): Promise<HomeConfig | null> => {
    return updateHomeConfig({ seo: seoData });
  }, [updateHomeConfig]);

  const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      setError('Home config not loaded');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials, testimonial];
    return updateTestimonialsSection({ testimonials: updatedTestimonials });
  }, [homeConfig, updateTestimonialsSection]);

  const removeTestimonial = useCallback(async (index: number): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      setError('Home config not loaded');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials];
    updatedTestimonials.splice(index, 1);
    return updateTestimonialsSection({ testimonials: updatedTestimonials });
  }, [homeConfig, updateTestimonialsSection]);

  const updateTestimonial = useCallback(async (index: number, testimonial: Partial<Testimonial>): Promise<HomeConfig | null> => {
    if (!homeConfig) {
      setError('Home config not loaded');
      return null;
    }

    const updatedTestimonials = [...homeConfig.testimonialsSection.testimonials];
    updatedTestimonials[index] = { ...updatedTestimonials[index], ...testimonial };
    return updateTestimonialsSection({ testimonials: updatedTestimonials });
  }, [homeConfig, updateTestimonialsSection]);

  return {
    homeConfig,
    isLoading,
    error,
    fetchHomeConfig,
    updateHomeConfig,
    updateSiteSettings,
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