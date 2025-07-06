import { getCurrentUser } from './auth';
import { getCurrentAdmin } from './adminUtils';

/**
 * Permission types that can be assigned to users
 */
export type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_content' | 'view_analytics';

/**
 * Check if the current user has a specific permission
 * @param permission - The permission to check
 * @returns Boolean indicating if the user has the permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  try {
    // First try to get the user as an admin
    const admin = await getCurrentAdmin();
    
    if (admin) {
      // All admins have all permissions
      return true;
    }
    
    // If not an admin, check regular user permissions
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    // Regular users might have specific permissions
    return user.permissions?.includes(permission) || false;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
}

/**
 * Check if the current user has admin access
 * @returns Boolean indicating if the user has admin access
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.role === 'admin' || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// All admin users have full access, no need for superadmin check