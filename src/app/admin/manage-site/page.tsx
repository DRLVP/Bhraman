'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminHomeConfig, ContactSection } from '@/hooks/useAdminHomeConfig';
import ImageUploader from '@/components/shared/ImageUploader';
import { useToast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/errorUtils';

export default function ManageSitePage() {
  const {
    homeConfig,
    isLoading,
    error,
    fetchHomeConfig,
    updateSiteSettings,
    updateHeroSection,
    updateFeaturedPackagesSection,
    updateAboutSection,
    updateContactSection,
    updateSEO,
  } = useAdminHomeConfig();

  const { toast } = useToast();

  // State for each section
  const [siteSettings, setSiteSettings] = useState({
    logo: '',
    socialMediaLinks: [] as Array<{
      platform: string;
      url: string;
      icon: string;
    }>,
  });

  const [heroSection, setHeroSection] = useState({
    heading: '',
    subheading: '',
    backgroundImage: '',
    ctaText: '',
    ctaLink: '',
  });

  const [featuredPackagesSection, setFeaturedPackagesSection] = useState({
    heading: '',
    subheading: '',
    packageIds: [] as string[],
  });

  const [aboutSection, setAboutSection] = useState({
    heading: '',
    content: '',
    image: '',
  });

  const [contactSection, setContactSection] = useState<ContactSection>({
    heading: '',
    subheading: '',
    email: '',
    phone: '',
    address: '',
    workingHours: undefined,
  });

  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: [] as string[],
  });

  // Initialize state from homeConfig
  useEffect(() => {
    fetchHomeConfig();
  }, [fetchHomeConfig]);

  useEffect(() => {
    if (homeConfig) {
      setSiteSettings({
        logo: homeConfig.siteSettings.logo || '',
        socialMediaLinks: homeConfig.siteSettings.socialMediaLinks || [],
      });
      setHeroSection({
        heading: homeConfig.heroSection.heading || '',
        subheading: homeConfig.heroSection.subheading || '',
        backgroundImage: homeConfig.heroSection.backgroundImage || '',
        ctaText: homeConfig.heroSection.ctaText || '',
        ctaLink: homeConfig.heroSection.ctaLink || '',
      });
      setFeaturedPackagesSection({
        heading: homeConfig.featuredPackagesSection.heading || '',
        subheading: homeConfig.featuredPackagesSection.subheading || '',
        packageIds: homeConfig.featuredPackagesSection.packageIds || [],
      });
      setAboutSection({
        heading: homeConfig.aboutSection.heading || '',
        content: homeConfig.aboutSection.content || '',
        image: homeConfig.aboutSection.image || '',
      });
      setContactSection({
        heading: homeConfig.contactSection.heading || '',
        subheading: homeConfig.contactSection.subheading || '',
        email: homeConfig.contactSection.email || '',
        phone: homeConfig.contactSection.phone || '',
        address: homeConfig.contactSection.address || '',
        workingHours: homeConfig.contactSection.workingHours,
      });
      setSeo({
        title: homeConfig.seo.title || '',
        description: homeConfig.seo.description || '',
        keywords: homeConfig.seo.keywords || [],
      });
    }
  }, [homeConfig]);

  // Handle save for each section
  const handleSave = async (section: string) => {
    try {
      switch (section) {
        case 'siteSettings':
          await updateSiteSettings(siteSettings);
          toast({
            title: 'Site settings updated',
            description: 'Your site settings have been saved successfully.',
            variant: 'default',
          });
          break;
        case 'heroSection':
          await updateHeroSection(heroSection);
          toast({
            title: 'Hero section updated',
            description: 'Your hero section has been saved successfully.',
            variant: 'default',
          });
          break;
        case 'featuredPackagesSection':
          await updateFeaturedPackagesSection(featuredPackagesSection);
          toast({
            title: 'Featured packages section updated',
            description: 'Your featured packages section has been saved successfully.',
            variant: 'default',
          });
          break;
        case 'aboutSection':
          await updateAboutSection(aboutSection);
          toast({
            title: 'About section updated',
            description: 'Your about section has been saved successfully.',
            variant: 'default',
          });
          break;
        case 'contactSection':
          await updateContactSection(contactSection);
          toast({
            title: 'Contact section updated',
            description: 'Your contact section has been saved successfully.',
            variant: 'default',
          });
          break;
        case 'seo':
          await updateSEO(seo);
          toast({
            title: 'SEO settings updated',
            description: 'Your SEO settings have been saved successfully.',
            variant: 'default',
          });
          break;
        default:
          break;
      }
    } catch (err: unknown) {
      toast({
        title: 'Update failed',
        description: getErrorMessage(err) || 'An error occurred while saving changes.',
        variant: 'destructive',
      });
    }
  };

  const handleKeywordsChange = (value: string) => {
    // Split by commas and trim whitespace
    const keywordsArray = value.split(',').map((keyword) => keyword.trim());
    setSeo((prev) => ({ ...prev, keywords: keywordsArray }));
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Site Content</h1>
      
      <Tabs defaultValue="siteSettings">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="siteSettings">Site Settings</TabsTrigger>
          <TabsTrigger value="socialMediaLinks">Social Media Links</TabsTrigger>
          <TabsTrigger value="heroSection">Hero Section</TabsTrigger>
          <TabsTrigger value="featuredPackagesSection">Featured Packages</TabsTrigger>
          <TabsTrigger value="aboutSection">About Section</TabsTrigger>
          <TabsTrigger value="contactSection">Contact Section</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>
        
        {/* Site Settings */}
        <TabsContent value="siteSettings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure general site settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Logo</label>
                  <ImageUploader
                    currentImage={siteSettings.logo}
                    onImageUpload={(url) => setSiteSettings({ ...siteSettings, logo: url })}
                    onImageRemove={() => setSiteSettings({ ...siteSettings, logo: '' })}
                  />
                </div>
                
                <Button onClick={() => handleSave('siteSettings')}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Social Media Links */}
        <TabsContent value="socialMediaLinks">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Configure social media links for your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {siteSettings.socialMediaLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-md">
                      <div className="flex-1">
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-1">Platform</label>
                          <Input
                            value={link.platform}
                            onChange={(e) => {
                              const updatedLinks = [...siteSettings.socialMediaLinks];
                              updatedLinks[index].platform = e.target.value;
                              setSiteSettings({ ...siteSettings, socialMediaLinks: updatedLinks });
                            }}
                            placeholder="e.g. Facebook, Twitter, Instagram"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <Input
                            value={link.url}
                            onChange={(e) => {
                              const updatedLinks = [...siteSettings.socialMediaLinks];
                              updatedLinks[index].url = e.target.value;
                              setSiteSettings({ ...siteSettings, socialMediaLinks: updatedLinks });
                            }}
                            placeholder="https://"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Icon</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={link.icon}
                            onChange={(e) => {
                              const updatedLinks = [...siteSettings.socialMediaLinks];
                              updatedLinks[index].icon = e.target.value;
                              setSiteSettings({ ...siteSettings, socialMediaLinks: updatedLinks });
                            }}
                          >
                            <option value="">Select an icon</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="LinkedIn">LinkedIn</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedLinks = [...siteSettings.socialMediaLinks];
                          updatedLinks.splice(index, 1);
                          setSiteSettings({ ...siteSettings, socialMediaLinks: updatedLinks });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSiteSettings({
                      ...siteSettings,
                      socialMediaLinks: [
                        ...siteSettings.socialMediaLinks,
                        { platform: '', url: '', icon: '' },
                      ],
                    });
                  }}
                >
                  Add Social Media Link
                </Button>
                
                <Button onClick={() => handleSave('siteSettings')}>Save Social Media Links</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Hero Section */}
        <TabsContent value="heroSection">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the main hero section on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <Input
                    value={heroSection.heading}
                    onChange={(e) => setHeroSection({ ...heroSection, heading: e.target.value })}
                    placeholder="Enter heading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subheading</label>
                  <Input
                    value={heroSection.subheading}
                    onChange={(e) => setHeroSection({ ...heroSection, subheading: e.target.value })}
                    placeholder="Enter subheading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">CTA Text</label>
                  <Input
                    value={heroSection.ctaText}
                    onChange={(e) => setHeroSection({ ...heroSection, ctaText: e.target.value })}
                    placeholder="Enter call-to-action text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">CTA Link</label>
                  <Input
                    value={heroSection.ctaLink}
                    onChange={(e) => setHeroSection({ ...heroSection, ctaLink: e.target.value })}
                    placeholder="Enter call-to-action link"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Background Image</label>
                  <ImageUploader
                    currentImage={heroSection.backgroundImage}
                    onImageUpload={(url) => setHeroSection({ ...heroSection, backgroundImage: url })}
                    onImageRemove={() => setHeroSection({ ...heroSection, backgroundImage: '' })}
                  />
                </div>
                
                <Button onClick={() => handleSave('heroSection')}>Save Hero Section</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Featured Packages Section */}
        <TabsContent value="featuredPackagesSection">
          <Card>
            <CardHeader>
              <CardTitle>Featured Packages Section</CardTitle>
              <CardDescription>Configure the featured packages section on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <Input
                    value={featuredPackagesSection.heading}
                    onChange={(e) => setFeaturedPackagesSection({ ...featuredPackagesSection, heading: e.target.value })}
                    placeholder="Enter heading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subheading</label>
                  <Input
                    value={featuredPackagesSection.subheading}
                    onChange={(e) => setFeaturedPackagesSection({ ...featuredPackagesSection, subheading: e.target.value })}
                    placeholder="Enter subheading"
                  />
                </div>
                
                <Button onClick={() => handleSave('featuredPackagesSection')}>Save Featured Packages Section</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About Section */}
        <TabsContent value="aboutSection">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Configure the about section on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <Input
                    value={aboutSection.heading}
                    onChange={(e) => setAboutSection({ ...aboutSection, heading: e.target.value })}
                    placeholder="Enter heading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={aboutSection.content}
                    onChange={(e) => setAboutSection({ ...aboutSection, content: e.target.value })}
                    placeholder="Enter content"
                    rows={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <ImageUploader
                    currentImage={aboutSection.image}
                    onImageUpload={(url) => setAboutSection({ ...aboutSection, image: url })}
                    onImageRemove={() => setAboutSection({ ...aboutSection, image: '' })}
                  />
                </div>
                
                <Button onClick={() => handleSave('aboutSection')}>Save About Section</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Section */}
        <TabsContent value="contactSection">
          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
              <CardDescription>Configure the contact section on the homepage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <Input
                    value={contactSection.heading}
                    onChange={(e) => setContactSection({ ...contactSection, heading: e.target.value })}
                    placeholder="Enter heading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subheading</label>
                  <Input
                    value={contactSection.subheading}
                    onChange={(e) => setContactSection({ ...contactSection, subheading: e.target.value })}
                    placeholder="Enter subheading"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={contactSection.email}
                    onChange={(e) => setContactSection({ ...contactSection, email: e.target.value })}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={contactSection.phone}
                    onChange={(e) => setContactSection({ ...contactSection, phone: e.target.value })}
                    placeholder="Enter phone"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Textarea
                    value={contactSection.address}
                    onChange={(e) => setContactSection({ ...contactSection, address: e.target.value })}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Working Hours</label>
                  <Textarea
                    value={contactSection.workingHours}
                    onChange={(e) => setContactSection({ ...contactSection, workingHours: e.target.value })}
                    placeholder="Enter working hours (e.g. Monday - Friday: 9:00 AM - 6:00 PM)"
                    rows={3}
                  />
                </div>
                
                <Button onClick={() => handleSave('contactSection')}>Save Contact Section</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure SEO settings for better search engine visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={seo.title}
                    onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={seo.description}
                    onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                  <Textarea
                    value={seo.keywords.join(', ')}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    placeholder="Enter keywords, separated by commas"
                    rows={3}
                  />
                </div>
                
                <Button onClick={() => handleSave('seo')}>Save SEO Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}