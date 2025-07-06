import { useState } from 'react';

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
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      const data = await response.json();
      setProgress(100);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
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

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to upload file ${i + 1}`);
        }

        const data = await response.json();
        results.push(data);

        // Update progress
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
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