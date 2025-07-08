'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload } from 'lucide-react';
import { useUpload } from '@/hooks/useUpload';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUploader({
  onImageUpload,
  onImageRemove,
  currentImage,
  className = '',
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress, error } = useUpload();
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload the file
    const result = await uploadFile(file);
    
    // If upload was successful, call the onImageUpload callback
    if (result) {
      onImageUpload(result.url);
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded to the server.",
        variant: "default",
      });
    } else if (error) {
      // If there was an error, show it
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
      // Reset the preview
      setPreviewUrl(currentImage || null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Image removed",
      description: "The image has been removed.",
      variant: "default",
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full max-w-md">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto rounded-md object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full max-w-md h-32 border-dashed flex flex-col gap-2"
        >
          <Upload className="h-6 w-6" />
          <span>Upload Image</span>
        </Button>
      )}

      {isUploading && (
        <div className="w-full max-w-md mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Uploading: {progress}%
          </p>
        </div>
      )}

      {error && !isUploading && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}