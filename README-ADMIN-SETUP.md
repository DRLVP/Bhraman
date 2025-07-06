# Admin Registration Setup

## Overview

This document provides instructions on how to set up and use the custom admin registration system for the Budh Bhraman application. The system allows users to register as admins who can perform CRUD operations on the application data.

## Prerequisites

1. Clerk account with API keys
2. MongoDB database
3. Node.js and npm/yarn installed

## Setup Instructions

### 1. Environment Variables

Make sure your `.env.local` file contains the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_uri

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Custom Pages
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Replace `your_mongodb_uri`, `your_clerk_publishable_key`, and `your_clerk_secret_key` with your actual credentials.

### 2. Clerk Setup

1. Log in to your Clerk dashboard (https://dashboard.clerk.dev/)
2. Go to the "Authentication" section
3. Enable "Email/Password" authentication method
4. Make sure "Email verification" is enabled

## How It Works

### Admin Registration Flow

1. User navigates to `/sign-up`
2. User enters email and password
3. User checks the "Register as Admin" checkbox
4. User submits the form
5. Clerk creates a new user account
6. The application registers the user as an admin in MongoDB
7. User is redirected to the dashboard

### Admin Authentication Flow

1. User navigates to `/sign-in`
2. User enters email and password
3. User submits the form
4. Clerk authenticates the user
5. The application checks if the user is an admin in MongoDB
6. If the user is an admin, they can access admin features

## API Endpoints

### `/api/auth/me`

- **Method**: GET
- **Description**: Gets the current user's information
- **Authentication**: Required
- **Response**: User object with role information

### `/api/admin`

- **Method**: POST
- **Description**: Creates a new admin or promotes a user to admin
- **Authentication**: Required (admin only)
- **Request Body**:
  ```json
  {
    "clerkId": "clerk_user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "phone": "+1234567890", // Optional
    "permissions": ["read", "write", "delete"] // Optional
  }
  ```
- **Response**: Admin object

## Troubleshooting

### Common Issues

1. **User not registered as admin**: Make sure the API call to `/api/admin` is successful during registration.
2. **Authentication errors**: Check your Clerk API keys and make sure they are correctly set in the `.env.local` file.
3. **MongoDB connection issues**: Verify your MongoDB URI and make sure the database is accessible.

## Security Considerations

1. The admin registration is protected by Clerk's authentication system.
2. Admin API endpoints are protected by middleware that checks if the user has admin privileges.
3. Sensitive operations should be performed only by users with the appropriate permissions.

## Next Steps

1. Implement more granular permission controls for admin users.
2. Add audit logging for admin actions.
3. Implement two-factor authentication for admin accounts.