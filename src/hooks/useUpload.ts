import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for uploading files to Cloudinary
 * @returns Upload state and functions
 */
export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Cloudinary
   * @param file - The file to upload
   * @param folder - Optional folder to store the file in
   * @returns The Cloudinary upload response or null if there was an error
   */
  const uploadFile = async (file: File, folder = 'bhraman') => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload to our API endpoint
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setProgress(100);
      return response.data;
    } catch (err: unknown) {
      console.error('Error uploading file:', err);
      setError((err as any).response?.data?.message || (err as Error).message || 'Failed to upload file');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Upload multiple files to Cloudinary
   * @param files - The files to upload
   * @param folder - Optional folder to store the files in
   * @returns Array of Cloudinary upload responses
   */
  const uploadMultipleFiles = async (files: File[], folder = 'bhraman') => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const results = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        results.push(response.data);

        // Update progress
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      return results;
    } catch (err: unknown) {
      console.error('Error uploading multiple files:', err);
      setError((err as any).response?.data?.message || (err as Error).message || 'Failed to upload files');
      return results; // Return any successful uploads
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    error,
  };
};

export default useUpload;