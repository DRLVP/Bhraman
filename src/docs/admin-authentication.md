# Admin Authentication System

## Overview

This document provides an overview of the Admin authentication system implemented in the Bhraman application. The system is built on top of Clerk authentication and provides role-based access control for admin users.

## Models

### Admin Model

The Admin model extends the User model with additional fields for admin-specific functionality:

- `clerkId`: Unique identifier from Clerk authentication
- `email`: Admin's email address
- `name`: Admin's full name
- `role`: Always set to `admin`
- `permissions`: Empty array as all admins have full access to all features
- `lastLogin`: Timestamp of the admin's last login
- `profileImage`: URL to the admin's profile image (optional)
- `phone`: Admin's phone number (optional)

## Authentication Flow

1. Users authenticate through Clerk authentication
2. The application checks if the authenticated user has an admin role in our database
3. If the user has an admin role, they can access all admin routes and features
4. No specific permission checks are needed as all admins have full access

## Components

### AdminProtected

A component that protects admin routes in the frontend. It redirects to the sign-in page if not authenticated and to the home page if not an admin.

```tsx
<AdminProtected>
  <YourAdminComponent />
</AdminProtected>
```

### useAdminAuth Hook

A custom hook that provides admin authentication state:

```tsx
const { 
  user,
  adminData,
  isAdmin,
  hasPermission  // Always returns true for admins
} = useAdminAuth();

// Check if user is an admin
if (isAdmin) {
  // Allow access to all admin features
}
```

## Server-Side Authentication

### adminAuthMiddleware

A middleware function that protects admin routes on the server side:

```typescript
import { adminAuthMiddleware } from '@/lib/adminAuth';

// In your route handler
const authCheck = await adminAuthMiddleware(req);
if (authCheck) return authCheck; // Redirects if not admin
```

### checkAdminApiAccess

A helper function for API routes to check admin access:

```typescript
import { checkAdminApiAccess } from '@/lib/adminAuth';

export async function GET() {
  // Check if user has admin access
  const accessCheck = await checkAdminApiAccess();
  if (accessCheck) return accessCheck; // Returns 401/403 response if not admin
  
  // Continue with admin-only logic
}
```

## Permissions System

The admin system has been simplified to provide full access to all admin users:

- All users with the 'admin' role have full access to all features and functionality
- No specific permissions need to be assigned or checked
- The `hasPermission` method from the `useAdminAuth` hook will always return true for admin users

## API Endpoints

### `/api/admin`

- `GET`: Retrieve all admins
- `POST`: Create a new admin or promote a user to admin

### `/api/admin/[id]`

- `GET`: Retrieve a specific admin
- `PUT`: Update an admin
- `DELETE`: Remove an admin

### `/api/admin/permissions`

- `GET`: Retrieve available permissions
- `POST`: Update permissions for an admin

## Usage Examples

### Creating a New Admin

```typescript
const response = await fetch('/api/admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    clerkId: 'clerk_user_id',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '+1234567890', // Optional
    // No need to specify permissions as all admins have full access
  }),
});
```

### Checking Admin Permissions in Components

```tsx
import { useAdminAuth } from '@/hooks/useAdminAuth';

function AdminComponent() {
  const { isAdmin } = useAdminAuth();
  
  if (!isAdmin) {
    return <AccessDenied />;
  }
  
  return <SettingsPanel />;
}
```

## Security Considerations

1. All admin routes are protected both on the client and server side
2. Admin API endpoints check for admin authentication before processing requests
3. All admin users have full access to all features and functionality
4. Admin creation is restricted to existing admins