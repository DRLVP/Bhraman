# Separate Admin Authentication Setup

## Overview

This document provides instructions for setting up separate authentication for admin users in the Bhraman application. The system uses Clerk for authentication but maintains separate sessions for regular users and admin users, allowing admins to log in with different credentials even when a user is already logged in.

## Prerequisites

1. Clerk account with API keys
2. MongoDB database
3. Node.js and npm/yarn installed

## Environment Variables

Add the following environment variables to your `.env.local` file:

```
# Regular User Authentication (existing variables)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

# Admin Authentication (new variables)
NEXT_PUBLIC_ADMIN_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
ADMIN_CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

You can use the same Clerk keys for both user and admin authentication, but for better separation and security, it's recommended to create a separate Clerk application for admin authentication.

## How It Works

### Authentication Flow

1. Regular users authenticate through the standard Clerk authentication flow
2. Admin users authenticate through a separate authentication flow that uses a different Clerk instance
3. The middleware routes requests to the appropriate authentication flow based on the URL path
4. Admin routes are protected by the admin middleware
5. Admin API endpoints check for admin authentication before processing requests

### Directory Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── sign-in/
│   │   │   └── page.tsx       # Admin sign-in page
│   │   └── layout.tsx         # Admin layout with authentication check
│   └── api/
│       └── admin-auth/
│           ├── me/
│           │   └── route.ts    # Get current admin user
│           └── sign-out/
│               └── route.ts    # Sign out admin user
├── hooks/
│   └── useAdminClerkAuth.ts   # Hook for admin authentication
├── lib/
│   └── adminClerk.ts          # Admin Clerk client and middleware
└── middleware/
    └── adminMiddleware.ts     # Middleware for admin routes
```

## Usage

### Admin Sign-In

Admins can sign in at `/admin/sign-in` even when a regular user is already signed in. The system will check if the user has admin privileges and redirect accordingly.

### Protecting Admin Routes

All routes under `/admin/*` are automatically protected by the admin middleware. If a user is not authenticated as an admin, they will be redirected to the admin sign-in page.

### Admin API Endpoints

API endpoints for admin operations should be placed under `/api/admin/*` and should use the `checkAdminClerkApiAccess` function to verify admin authentication:

```typescript
import { checkAdminClerkApiAccess } from '@/lib/adminClerk';

export async function GET() {
  // Check if user has admin access
  const accessCheck = await checkAdminClerkApiAccess();
  if (accessCheck) return accessCheck;

  // Continue with admin API logic
  // ...
}
```

### Using Admin Authentication in Components

Use the `useAdminClerkAuth` hook to access admin authentication state in components:

```typescript
import { useAdminClerkAuth } from '@/hooks/useAdminClerkAuth';

export default function AdminComponent() {
  const { user, isLoaded, isSignedIn, permissions } = useAdminClerkAuth();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Admin component content */}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Session conflicts**: If you're experiencing issues with sessions conflicting, make sure the middleware is correctly configured to handle admin routes separately.

2. **Authentication errors**: Check your Clerk API keys and make sure they are correctly set in the `.env.local` file.

3. **Redirect loops**: If you're experiencing redirect loops, check the admin middleware and make sure it's correctly handling the admin sign-in page.

4. **MongoDB connection issues**: Verify your MongoDB URI and make sure the database is accessible.

## Security Considerations

1. The admin authentication is protected by Clerk's authentication system.
2. Admin API endpoints are protected by middleware that checks if the user has admin privileges.
3. Sensitive operations should be performed only by users with the appropriate permissions.
4. Consider using different Clerk applications for user and admin authentication for better security.