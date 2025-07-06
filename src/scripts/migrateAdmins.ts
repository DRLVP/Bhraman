/**
 * Migration script to move existing admin users to the unified User model
 * 
 * Run this script with: npx ts-node -r tsconfig-paths/register src/scripts/migrateAdmins.ts
 */

import connectDB from '../lib/db';
import Admin from '../models/Admin';
import User from '../models/User';

async function migrateAdmins() {
  try {
    console.log('Starting admin migration...');
    
    // Connect to the database
    await connectDB();
    
    // Get all admin users
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin users to migrate`);
    
    // Process each admin
    for (const admin of admins) {
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: admin.clerkId });
      
      if (existingUser) {
        // Update existing user with admin role
        console.log(`Updating existing user ${existingUser.email} to admin role`);
        existingUser.role = 'admin';
        existingUser.permissions = []; // All admins have full access by default
        existingUser.lastLogin = admin.lastLogin || new Date();
        await existingUser.save();
      } else {
        // Create new user with admin data
        console.log(`Creating new user for admin ${admin.email}`);
        await User.create({
          clerkId: admin.clerkId,
          email: admin.email,
          name: admin.email.split('@')[0], // Use part of email as name if not provided
          profileImage: admin.profileImage,
          role: 'admin',
          permissions: [], // All admins have full access by default
          lastLogin: admin.lastLogin || new Date(),
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        });
      }
    }
    
    console.log('Admin migration completed successfully!');
    console.log('Note: The Admin model has not been deleted. You can manually remove it after verifying the migration.');
  } catch (error) {
    console.error('Error during admin migration:', error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
migrateAdmins();