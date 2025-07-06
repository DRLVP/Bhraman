import connectDB from './db';
import Package from '@/models/Package';
import { slugify } from './utils';

/**
 * Generate a unique slug for a package
 * @param title - The package title
 * @returns A unique slug
 */
export async function generateSlug(title: string): Promise<string> {
  // Generate the base slug
  let slug = slugify(title);
  
  // Connect to the database
  await connectDB();
  
  // Check if the slug already exists
  let exists = await Package.findOne({ slug });
  let counter = 1;
  
  // If the slug exists, append a number to make it unique
  while (exists) {
    slug = `${slugify(title)}-${counter}`;
    exists = await Package.findOne({ slug });
    counter++;
  }
  
  return slug;
}