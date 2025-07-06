import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { serverEnvConfig } from '@/constants/envConfig';

// Configure Cloudinary
cloudinary.config({
  cloud_name: serverEnvConfig.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: serverEnvConfig.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
  api_secret: serverEnvConfig.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Process the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'bhraman';
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64
    const base64 = buffer.toString('base64');
    const fileType = file.type;
    const dataURI = `data:${fileType};base64,${base64}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
    });
    
    // Return the Cloudinary response
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return new NextResponse('Error uploading file', { status: 500 });
  }
}