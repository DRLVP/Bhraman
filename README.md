# Budh Bhraman - Your Partner for Every Trip

A warm welcome to Budh Bhraman, your trusted companion for travel planning.

## Deployment Guide

### Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- Clerk account for authentication
- Cloudinary account for image storage
- Razorpay account for payment processing (if applicable)

### Local Development

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/bhraman.git
   cd bhraman
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.sample`
   ```bash
   cp .env.sample .env.local
   ```

4. Update the environment variables in `.env.local` with your credentials

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment on Vercel

1. **Prepare for deployment**
   - Ensure all your code changes are committed to your repository
   - Make sure you have a Vercel account connected to your GitHub/GitLab/Bitbucket

2. **Configure environment variables**
   - In your Vercel dashboard, go to your project settings
   - Add all the required environment variables from `.env.production`
   - Make sure to use production API keys for Clerk, Cloudinary, and other services

3. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Configure the build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`
     - Node.js Version: 18.x (or later)

4. **Troubleshooting deployment issues**
   - Check Vercel build logs for any errors
   - Ensure all environment variables are correctly set
   - Verify that your MongoDB Atlas IP whitelist includes Vercel's IP ranges
   - Make sure your Clerk, Cloudinary, and other service configurations are correct

5. **Post-deployment verification**
   - Test all functionality on the deployed site
   - Verify that authentication works correctly
   - Check that image uploads and retrievals work
   - Test the booking and payment flows

### Performance Optimizations

The application includes several performance optimizations:

- Image optimization with next/image
- Font optimization
- CSS optimization
- Server-side rendering for improved SEO
- API route caching
- MongoDB connection pooling

### Security Considerations

- All API keys and secrets are stored as environment variables
- Authentication is handled by Clerk, a secure authentication provider
- API routes are protected with proper authentication checks
- MongoDB connection is secured with username/password authentication
- HTTPS is enforced in production

## License

This project is licensed under the MIT License - see the LICENSE file for details.
