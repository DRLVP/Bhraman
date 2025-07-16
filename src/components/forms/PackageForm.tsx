'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Plus, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUpload from '@/hooks/useUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

/**
 * Itinerary item interface
 */
interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  image?: string;
}

/**
 * Package form props interface
 */
interface PackageFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    duration: number;
    location: string;
    price: number;
    discountedPrice?: number;
    images: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: ItineraryItem[];
    featured?: boolean;
    maxGroupSize: number;
  };
  isEditing?: boolean;
}

/**
 * Zod schema for package form validation
 */
const packageFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  shortDescription: z.string().min(1, { message: 'Short description is required' }),
  duration: z.number().min(1, { message: 'Duration must be at least 1 day' }),
  location: z.string().min(1, { message: 'Location is required' }),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  discountedPrice: z.number().optional(),
  maxGroupSize: z.number().min(1, { message: 'Group size must be at least 1' }),
  featured: z.boolean().optional().default(false),
  images: z.array(z.string()).min(1, { message: 'At least one image is required' }),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string().min(1, { message: 'Day title is required' }),
      description: z.string().min(1, { message: 'Day description is required' }),
      image: z.string().optional(),
    }),
  ).min(1, { message: 'At least one itinerary item is required' }),
});

// Define the form values type explicitly to match the schema
interface PackageFormValues {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: number;
  location: string;
  price: number;
  discountedPrice?: number;
  maxGroupSize: number;
  featured?: boolean;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
}

/**
 * PackageForm component for creating and editing travel packages
 */
const PackageForm = ({ initialData, isEditing = false }: PackageFormProps = {}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { uploadFile, uploadMultipleFiles, isUploading, progress, error: uploadError } = useUpload();
  const [error, setError] = useState<string | null>(null);
  
  // Form state for non-react-hook-form fields
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [inclusions, setInclusions] = useState<string[]>(initialData?.inclusions || []);
  const [exclusions, setExclusions] = useState<string[]>(initialData?.exclusions || []);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(initialData?.itinerary || []);

  // Initialize react-hook-form
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      shortDescription: initialData?.shortDescription || '',
      duration: initialData?.duration || 1,
      location: initialData?.location || '',
      price: initialData?.price || 0,
      discountedPrice: initialData?.discountedPrice || 0,
      maxGroupSize: initialData?.maxGroupSize || 10,
      featured: initialData?.featured || false,
      images: initialData?.images || [],
      inclusions: initialData?.inclusions || [],
      exclusions: initialData?.exclusions || [],
      itinerary: initialData?.itinerary || [],
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    form.setValue('slug', generateSlug(title));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {return;}

    try {
      const uploadedImages = await uploadMultipleFiles(Array.from(files), 'packages');
      if (uploadedImages && uploadedImages.length > 0) {
        const imageUrls = uploadedImages.map((img) => img.secure_url);
        const newImages = [...images, ...imageUrls];
        setImages(newImages);
        form.setValue('images', newImages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload images',
      });
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue('images', newImages);
  };

  // Handle inclusions/exclusions
  const handleListItemChange = (type: 'inclusions' | 'exclusions', index: number, value: string) => {
    if (type === 'inclusions') {
      const newInclusions = inclusions.map((item, i) => (i === index ? value : item));
      setInclusions(newInclusions);
      form.setValue('inclusions', newInclusions);
    } else {
      const newExclusions = exclusions.map((item, i) => (i === index ? value : item));
      setExclusions(newExclusions);
      form.setValue('exclusions', newExclusions);
    }
  };

  // Add inclusion/exclusion
  const addListItem = (type: 'inclusions' | 'exclusions') => {
    if (type === 'inclusions') {
      const newInclusions = [...inclusions, ''];
      setInclusions(newInclusions);
      form.setValue('inclusions', newInclusions);
    } else {
      const newExclusions = [...exclusions, ''];
      setExclusions(newExclusions);
      form.setValue('exclusions', newExclusions);
    }
  };

  // Remove inclusion/exclusion
  const removeListItem = (type: 'inclusions' | 'exclusions', index: number) => {
    if (type === 'inclusions') {
      const newInclusions = inclusions.filter((_, i) => i !== index);
      setInclusions(newInclusions);
      form.setValue('inclusions', newInclusions);
    } else {
      const newExclusions = exclusions.filter((_, i) => i !== index);
      setExclusions(newExclusions);
      form.setValue('exclusions', newExclusions);
    }
  };

  // Handle itinerary changes
  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string | number) => {
    const newItinerary = itinerary.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === 'day' ? parseInt(value as string) || 1 : value };
      }
      return item;
    });
    
    setItinerary(newItinerary);
    form.setValue('itinerary', newItinerary);
  };

  // Add itinerary item
  const addItineraryItem = () => {
    const nextDay = itinerary.length + 1;
    const newItinerary = [
      ...itinerary,
      {
        day: nextDay,
        title: '',
        description: '',
      },
    ];
    
    setItinerary(newItinerary);
    form.setValue('itinerary', newItinerary);
  };

  // Remove itinerary item
  const removeItineraryItem = (index: number) => {
    const newItinerary = itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        day: i + 1,
      }));
    
    setItinerary(newItinerary);
    form.setValue('itinerary', newItinerary);
  };

  // Handle itinerary image upload
  const handleItineraryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {return;}

    try {
      const result = await uploadFile(files[0], 'packages/itinerary');
      if (result) {
        handleItineraryChange(index, 'image', result.secure_url);
      }
    } catch (err) {
      setError(`Failed to upload itinerary image: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload itinerary image',
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data: PackageFormValues) => {
    setError(null);

    try {
      // Create or update package
      const url = isEditing ? `/api/admin/packages/${initialData?.id}` : '/api/admin/packages';
      const method = isEditing ? 'PATCH' : 'POST';

      // Ensure the form data includes the latest images, inclusions, exclusions, and itinerary
      // For updates, include the _id field to ensure MongoDB can find the document
      const formData = {
        ...data,
        images,
        inclusions,
        exclusions,
        itinerary,
        // Include _id for MongoDB when updating
        ...(isEditing && initialData?.id ? { _id: initialData.id } : {}),
      };

      await axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Show success toast
      toast({
        title: 'Success',
        description: isEditing ? 'Package updated successfully' : 'Package created successfully',
      });

      // Redirect to packages list
      router.push('/admin/packages');
      router.refresh();
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error ? err.message : 'An error occurred while saving';
      
      setError(errorMessage);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {(error || uploadError) && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || uploadError}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              {...form.register('title')}
              onChange={handleTitleChange}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              required
              {...form.register('slug')}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              required
              {...form.register('location')}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days) *
            </label>
            <input
              type="number"
              id="duration"
              required
              min={1}
              {...form.register('duration', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              required
              min={0}
              {...form.register('price', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Discounted Price (₹)
            </label>
            <input
              type="number"
              id="discountedPrice"
              min={0}
              {...form.register('discountedPrice', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="maxGroupSize" className="block text-sm font-medium text-gray-700 mb-1">
              Max Group Size *
            </label>
            <input
              type="number"
              id="maxGroupSize"
              required
              min={1}
              {...form.register('maxGroupSize', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              {...form.register('featured')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured Package
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description *
          </label>
          <textarea
            id="shortDescription"
            required
            rows={2}
            {...form.register('shortDescription')}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Full Description *
          </label>
          <textarea
            id="description"
            required
            rows={6}
            {...form.register('description')}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Package Images *</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-32 h-32 border rounded-md overflow-hidden group">
                <Image src={image} alt={`Package ${index + 1}`} className="w-full h-full object-cover" width={128} height={128} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <Upload className="h-8 w-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Inclusions & Exclusions</h2>

        {/* Inclusions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Inclusions</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem('inclusions')}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {inclusions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No inclusions added yet.</p>
          ) : (
            <div className="space-y-2">
              {inclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange('inclusions', index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="E.g., Accommodation"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('inclusions', index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exclusions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Exclusions</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem('exclusions')}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {exclusions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No exclusions added yet.</p>
          ) : (
            <div className="space-y-2">
              {exclusions.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange('exclusions', index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="E.g., Flights"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeListItem('exclusions', index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Itinerary</h2>
          <Button
            type="button"
            onClick={addItineraryItem}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Day
          </Button>
        </div>

        {itinerary.length === 0 ? (
          <p className="text-gray-500 italic">No itinerary items added yet. Add days to create your itinerary.</p>
        ) : (
          <div className="space-y-6">
            {itinerary.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Day {item.day}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItineraryItem(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      required
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="E.g., Arrival in Gangtok"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      {item.image ? (
                        <div className="relative w-16 h-16 border rounded-md overflow-hidden group">
                          <Image src={item.image} alt={`Day ${item.day}`} className="w-full h-full object-cover" width={128} height={128} />
                          <button
                            type="button"
                            onClick={() => handleItineraryChange(index, 'image', '')}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleItineraryImageUpload(index, e)}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                    required
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Describe the activities for this day"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/packages')}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
          {form.formState.isSubmitting ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;