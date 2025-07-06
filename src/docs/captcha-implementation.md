# Smart Captcha Implementation in Bhraman

## Overview

This document explains how the Smart Captcha feature has been implemented in the Bhraman application using Clerk's authentication system. The Smart Captcha helps protect the application from bot sign-ups and automated attacks while providing a seamless user experience.

## Implementation Details

### 1. ClerkProvider Configuration

The Smart Captcha is configured at the application level in the `ClerkProvider` component in `src/app/layout.tsx`. This ensures that the captcha settings are applied consistently across all authentication flows.

```tsx
<ClerkProvider
  publishableKey={envConfig.clerkPublishableKey}
  appearance={{
    captcha: {
      theme: 'auto',  // Automatically adapts to light/dark mode
      size: 'normal'  // Standard size for better visibility
    }
  }}
>
  {/* ... */}
</ClerkProvider>
```

### 2. Sign-Up Implementation

The sign-up page (`src/app/sign-up/page.tsx`) has been updated to include:

- A captcha reference using React's useState hook
- A dedicated div with the required `id="clerk-captcha"` for rendering the captcha widget
- The `captchaToken: true` parameter in the `signUp.create()` method to enable captcha verification

### 3. Sign-In Implementation

Similarly, the sign-in page (`src/app/sign-in/page.tsx`) has been updated with:

- A captcha reference using React's useState hook
- A dedicated div with the required `id="clerk-captcha"` for rendering the captcha widget
- The `captchaToken: true` parameter in the `signIn.create()` method to enable captcha verification

## How It Works

1. When a user attempts to sign up or sign in, Clerk's Smart Captcha system automatically assesses the risk level of the request
2. For most legitimate users, the captcha verification happens invisibly in the background without requiring any user interaction
3. If the system detects suspicious behavior, it will display an interactive captcha challenge for the user to complete
4. The captcha widget is rendered in the designated `<div id="clerk-captcha">` element
5. The `captchaToken: true` parameter tells Clerk to include captcha verification in the authentication process

## Customization Options

The captcha appearance can be further customized by modifying the `appearance.captcha` object in the `ClerkProvider` configuration:

- `theme`: 'light', 'dark', or 'auto' (default: 'auto')
- `size`: 'compact', 'normal', or 'invisible' (default: 'normal')
- `language`: Specify a language code like 'en-US', 'es-ES', etc.

## Troubleshooting

If users experience issues with the captcha:

1. Ensure the `id="clerk-captcha"` div is properly rendered in the DOM
2. Check browser console for any errors related to the captcha widget
3. Verify that the Clerk API keys are correctly configured
4. Consider adjusting the captcha size or theme if users report visibility issues

## References

- [Clerk Captcha Documentation](https://clerk.com/docs/customization/captcha)
- [Bot Protection for Custom Sign-Up Flows](https://clerk.com/docs/custom-flows/bot-sign-up-protection)