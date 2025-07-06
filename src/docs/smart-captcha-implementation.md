# Smart Captcha Implementation in Bhraman

## Overview

This document explains how the Smart Captcha feature has been implemented in the Bhraman application using Clerk's authentication system. The Smart Captcha helps protect the application from bot sign-ups and automated attacks while providing a seamless user experience.

## Implementation Details

### 1. Captcha Configuration

The Smart Captcha is configured directly on the captcha elements in both sign-up and sign-in pages using data attributes:

```tsx
<div 
  id="clerk-captcha" 
  ref={setCaptchaRef} 
  className="mt-4"
  data-cl-theme="auto"
  data-cl-size="normal"
></div>
```

These data attributes control the appearance and behavior of the captcha widget:

- `data-cl-theme`: Controls the theme of the captcha widget ("light", "dark", or "auto")
- `data-cl-size`: Controls the size of the captcha widget ("normal", "flexible", or "compact")

### 2. Sign-Up Implementation

The sign-up page (`src/app/sign-up/page.tsx`) includes:

- A captcha reference using React's useState hook
- A dedicated div with the required `id="clerk-captcha"` for rendering the captcha widget
- The `captchaToken: true` parameter in the `signUp.create()` method to enable captcha verification

```tsx
// Captcha reference
const [captchaRef, setCaptchaRef] = useState<HTMLDivElement | null>(null);

// In the form JSX
<div 
  id="clerk-captcha" 
  ref={setCaptchaRef} 
  className="mt-4"
  data-cl-theme="auto"
  data-cl-size="normal"
></div>

// In the submit handler
await signUp.create({
  // other fields...
  captchaToken: true, // Enable smart captcha verification
});
```

### 3. Sign-In Implementation

Similarly, the sign-in page (`src/app/sign-in/page.tsx`) includes:

- A captcha reference using React's useState hook
- A dedicated div with the required `id="clerk-captcha"` for rendering the captcha widget
- The `captchaToken: true` parameter in the `signIn.create()` method to enable captcha verification

## How It Works

1. When a user attempts to sign up or sign in, Clerk's Smart Captcha system automatically assesses the risk level of the request <mcreference link="https://clerk.com/glossary/captcha" index="4">4</mcreference>
2. For most legitimate users, the captcha verification happens invisibly in the background without requiring any user interaction
3. If the system detects suspicious behavior, it will display an interactive captcha challenge for the user to complete
4. The captcha widget is rendered in the designated `<div id="clerk-captcha">` element
5. The `captchaToken: true` parameter tells Clerk to include captcha verification in the authentication process

Clerk uses Cloudflare Turnstile for its CAPTCHA implementation, which provides a modern approach to bot detection <mcreference link="https://clerk.com/glossary/captcha" index="4">4</mcreference>. The Smart CAPTCHA option is designed to balance security with user experience by:

- Only showing verification challenges to suspicious traffic
- Allowing legitimate users who might be falsely identified as bots to prove they are human
- Providing an accessible verification method that works across different devices and browsers

## Enabling Bot Protection in Clerk Dashboard

To fully enable the Smart Captcha feature, you need to configure it in the Clerk Dashboard <mcreference link="https://clerk.com/docs/custom-flows/bot-sign-up-protection" index="1">1</mcreference>:

1. Navigate to the **Attack protection** page in the Clerk Dashboard
2. Enable the **Bot sign-up protection** toggle
3. Select the **Smart** option for the captcha type (recommended over the deprecated Invisible option) <mcreference link="https://clerk.com/changelog/2024-04-19-visual-captcha" index="5">5</mcreference>

> **Note**: If you previously had Bot Protection enabled, your settings might be automatically set to "Invisible" as this was the previous default. It's highly recommended to switch to the "Smart" option, as the "Invisible" option is deprecated and will be removed in a future update. <mcreference link="https://clerk.com/docs/custom-flows/bot-sign-up-protection" index="1">1</mcreference>

## Customization Options

The captcha appearance can be further customized by modifying the data attributes on the captcha element:

- `data-cl-theme`: "light", "dark", or "auto" (default: "auto")
- `data-cl-size`: "normal", "flexible", or "compact" (default: "normal")
- `data-cl-language`: Language code like "en-US", "es-ES", etc. or "auto" to use the visitor's language

## Troubleshooting

If users experience issues with the captcha:

1. Ensure the `id="clerk-captcha"` div is properly rendered in the DOM before calling `signUp.create()` or `signIn.create()` <mcreference link="https://clerk.com/docs/custom-flows/bot-sign-up-protection" index="1">1</mcreference>
2. Check browser console for any errors related to the captcha widget
3. Verify that the Clerk API keys are correctly configured
4. Consider adjusting the captcha size or theme if users report visibility issues
5. If the captcha element is not found, Clerk will fall back to an invisible widget, but this is not recommended as it may block legitimate users without giving them a way to verify themselves <mcreference link="https://clerk.com/docs/custom-flows/bot-sign-up-protection" index="1">1</mcreference>

### Common Issues

1. **Captcha not appearing**: Make sure the `<div id="clerk-captcha">` element exists in the DOM when `signUp.create()` or `signIn.create()` is called. If this element is missing, you should see a relevant error in your browser's console.

2. **Users being blocked**: If legitimate users report being unable to sign up or sign in, ensure you're using the "Smart" captcha type rather than "Invisible" in the Clerk Dashboard. The Smart option allows users who might be falsely identified as bots to prove they are human.

3. **Styling issues**: If the captcha widget doesn't match your application's theme, adjust the `data-cl-theme` attribute on the captcha element. Valid values are "light", "dark", or "auto".

4. **Language issues**: For international users, you can set the `data-cl-language` attribute to "auto" or a specific language code (e.g., "en-US", "es-ES") to display the captcha in the appropriate language.

## References

1. [Custom Flows: Add Bot Protection to Your Custom Sign-up Flow](https://clerk.com/docs/custom-flows/bot-sign-up-protection) <mcreference link="https://clerk.com/docs/custom-flows/bot-sign-up-protection" index="1">1</mcreference>
2. [Clerk Environment Variables](https://clerk.com/docs/deployments/clerk-environment-variables) <mcreference link="https://clerk.com/docs/deployments/clerk-environment-variables" index="3">3</mcreference>
3. [CAPTCHA - Clerk Glossary](https://clerk.com/glossary/captcha) <mcreference link="https://clerk.com/glossary/captcha" index="4">4</mcreference>
4. [Visual CAPTCHA for Bot Protection - Clerk Changelog](https://clerk.com/changelog/2024-04-19-visual-captcha) <mcreference link="https://clerk.com/changelog/2024-04-19-visual-captcha" index="5">5</mcreference>
5. [Implementing reCAPTCHA in React - Clerk Blog](https://clerk.com/blog/implementing-recaptcha-in-react) <mcreference link="https://clerk.com/blog/implementing-recaptcha-in-react" index="2">2</mcreference>