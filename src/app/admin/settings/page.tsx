'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/shared/ImageUploader';

interface HomeConfig {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  featuredPackagesSection: {
    title: string;
    subtitle: string;
  };
  testimonialsSection: {
    title: string;
    subtitle: string;
  };
  aboutSection: {
    title: string;
    subtitle: string;
    content: string;
    image: string;
  };
  contactSection: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<HomeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch the config from the API
      const response = await fetch('/api/admin/home-config');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load settings');
      }
      
      const data = await response.json();
      
      // If we have data, use it
      if (data) {
        setConfig({
          heroSection: {
            title: data.heroSection?.title || 'Explore the Beauty of India',
            subtitle: data.heroSection?.subtitle || 'Discover amazing places and create unforgettable memories with our premium travel packages',
            backgroundImage: data.heroSection?.backgroundImage || 'https://example.com/hero-bg.jpg',
          },
          featuredPackagesSection: {
            title: data.featuredPackagesSection?.title || 'Popular Destinations',
            subtitle: data.featuredPackagesSection?.subtitle || 'Explore our most popular travel packages',
          },
          testimonialsSection: {
            title: data.testimonialsSection?.title || 'What Our Customers Say',
            subtitle: data.testimonialsSection?.subtitle || 'Read testimonials from our satisfied travelers',
          },
          aboutSection: {
            title: data.aboutSection?.title || 'About Bhraman',
            subtitle: data.aboutSection?.subtitle || 'Your Trusted Travel Partner',
            content: data.aboutSection?.content || 'Bhraman is a premier travel agency specializing in curated travel experiences across India.',
            image: data.aboutSection?.image || 'https://example.com/about-image.jpg',
          },
          contactSection: {
            title: data.contactSection?.title || 'Get in Touch',
            subtitle: data.contactSection?.subtitle || 'We\'re here to help plan your perfect trip',
            email: data.contactSection?.email || 'info@bhraman.com',
            phone: data.contactSection?.phone || '+91 9876543210',
            address: data.contactSection?.address || '123 Travel Street, Kolkata, West Bengal, India',
          },
          seo: {
            title: data.seo?.title || 'Bhraman - Premium Travel Packages in India',
            description: data.seo?.description || 'Discover the best travel packages in India with Bhraman.',
            keywords: data.seo?.keywords || 'travel, india, packages, tourism, holiday, vacation, tour',
          },
        });
      } else {
        // If no data, use default values
        setConfig({
          heroSection: {
            title: 'Explore the Beauty of India',
            subtitle: 'Discover amazing places and create unforgettable memories with our premium travel packages',
            backgroundImage: 'https://example.com/hero-bg.jpg',
          },
          featuredPackagesSection: {
            title: 'Popular Destinations',
            subtitle: 'Explore our most popular travel packages',
          },
          testimonialsSection: {
            title: 'What Our Customers Say',
            subtitle: 'Read testimonials from our satisfied travelers',
          },
          aboutSection: {
            title: 'About Bhraman',
            subtitle: 'Your Trusted Travel Partner',
            content: 'Bhraman is a premier travel agency specializing in curated travel experiences across India.',
            image: 'https://example.com/about-image.jpg',
          },
          contactSection: {
            title: 'Get in Touch',
            subtitle: 'We\'re here to help plan your perfect trip',
            email: 'info@bhraman.com',
            phone: '+91 9876543210',
            address: '123 Travel Street, Kolkata, West Bengal, India',
          },
          seo: {
            title: 'Bhraman - Premium Travel Packages in India',
            description: 'Discover the best travel packages in India with Bhraman.',
            keywords: 'travel, india, packages, tourism, holiday, vacation, tour',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setError(error instanceof Error ? error.message : 'Failed to load settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: keyof HomeConfig, field: string, value: string) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    });
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setIsSaving(true);
    setError(null);
    try {
      // Save the config via the API
      const response = await fetch('/api/admin/home-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
      
      // Show success message
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      setError(error instanceof Error ? error.message : 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
        <Button 
          onClick={fetchConfig} 
          variant="outline" 
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Configuration not found
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <Button 
          onClick={saveConfig}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('hero')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'hero' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Hero Section
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'featured' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Featured Packages
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'testimonials' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Testimonials
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              About Section
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Contact Section
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'seo' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              SEO Settings
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Hero Section</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="heroTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.heroSection.title}
                    onChange={(e) => handleInputChange('heroSection', 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="heroSubtitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.heroSection.subtitle}
                    onChange={(e) => handleInputChange('heroSection', 'subtitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="heroBackgroundImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image
                  </label>
                  <div className="mt-1">
                    <ImageUploader
                      currentImageUrl={config.heroSection.backgroundImage}
                      onImageUploaded={(imageUrl) => handleInputChange('heroSection', 'backgroundImage', imageUrl)}
                      folder="bhraman/hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Featured Packages Section */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Featured Packages Section</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="featuredTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="featuredTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.featuredPackagesSection.title}
                    onChange={(e) => handleInputChange('featuredPackagesSection', 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="featuredSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="featuredSubtitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.featuredPackagesSection.subtitle}
                    onChange={(e) => handleInputChange('featuredPackagesSection', 'subtitle', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Testimonials Section */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Testimonials Section</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="testimonialsTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="testimonialsTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.testimonialsSection.title}
                    onChange={(e) => handleInputChange('testimonialsSection', 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="testimonialsSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="testimonialsSubtitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.testimonialsSection.subtitle}
                    onChange={(e) => handleInputChange('testimonialsSection', 'subtitle', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* About Section */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">About Section</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="aboutTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.aboutSection.title}
                    onChange={(e) => handleInputChange('aboutSection', 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="aboutSubtitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.aboutSection.subtitle}
                    onChange={(e) => handleInputChange('aboutSection', 'subtitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="aboutContent"
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.aboutSection.content}
                    onChange={(e) => handleInputChange('aboutSection', 'content', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="aboutImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="mt-1">
                    <ImageUploader
                      currentImageUrl={config.aboutSection.image}
                      onImageUploaded={(imageUrl) => handleInputChange('aboutSection', 'image', imageUrl)}
                      folder="bhraman/about"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Contact Section</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="contactTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="contactTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.contactSection.title}
                    onChange={(e) => handleInputChange('contactSection', 'title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="contactSubtitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.contactSection.subtitle}
                    onChange={(e) => handleInputChange('contactSection', 'subtitle', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.contactSection.email}
                    onChange={(e) => handleInputChange('contactSection', 'email', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="contactPhone"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.contactSection.phone}
                    onChange={(e) => handleInputChange('contactSection', 'phone', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="contactAddress"
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.contactSection.address}
                    onChange={(e) => handleInputChange('contactSection', 'address', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">SEO Settings</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.seo.title}
                    onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 50-60 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.seo.description}
                    onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 150-160 characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="seoKeywords"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={config.seo.keywords}
                    onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}