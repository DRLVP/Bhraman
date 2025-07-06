import { v2 as cloudinary } from 'cloudinary';
import { CldImage } from 'next-cloudinary';
import { serverEnvConfig } from '@/constants/envConfig';

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: serverEnvConfig.cloudinaryCloudName,
  api_key: serverEnvConfig.cloudinaryApiKey,
  api_secret: serverEnvConfig.cloudinaryApiSecret,
});

/**
 * Upload an image to Cloudinary
 * @param file - The file to upload (base64 or file path)
 * @param folder - Optional folder to store the image in
 * @returns The Cloudinary upload response
 */
export const uploadImage = async (file: string, folder = 'bhraman') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns The Cloudinary deletion response
 */
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Get a Cloudinary URL for an image
 * @param publicId - The public ID of the image
 * @returns The Cloudinary URL
 */
export const getImageUrl = (publicId: string) => {
  return cloudinary.url(publicId);
};

// Export the CldImage component for client-side use
export { CldImage };

// Export the cloudinary instance for advanced usage
export default cloudinary;