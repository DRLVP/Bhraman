'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpload } from '@/hooks/useUpload';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  folder?: string;
  className?: string;
}

/**
 * Image uploader component that handles uploading images to Cloudinary
 */
export function ImageUploader({
  onImageUploaded,
  currentImageUrl,
  folder = 'bhraman',
  className = '',
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress, error } = useUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Upload to Cloudinary
    const result = await uploadFile(file, folder);
    
    if (result) {
      // Call the callback with the Cloudinary URL
      onImageUploaded(result.secure_url);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Uploading... {progress}%</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isUploading && !previewUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Image</span>
        </Button>
      )}
    </div>
  );
}