/**
 * Deployment script for Budh Bhraman
 * This script automates the pre-deployment checks and deployment process
 */

const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Execute a command and return its output
function execute(command, options = {}) {
  try {
    const output = execSync(command, { encoding: 'utf8', ...options });
    return { success: true, output };
  } catch (error) {
    return { success: false, error };
  }
}

// Main deployment function
async function deploy() {
  log('🚀 Starting deployment process...', colors.cyan);
  
  // Step 1: Run pre-deployment checks
  log('\n📋 Running pre-deployment checks...', colors.blue);
  const checkResult = execute('node pre-deploy-check.js');
  
  if (!checkResult.success) {
    log('❌ Pre-deployment checks failed. Aborting deployment.', colors.red);
    log(checkResult.error.stdout || checkResult.error.message, colors.yellow);
    return;
  }
  
  // Step 2: Normalize line endings
  log('\n📋 Normalizing line endings...', colors.blue);
  const lineEndingResult = execute('node fix-line-endings.js');
  
  if (!lineEndingResult.success) {
    log('❌ Line ending normalization failed. Aborting deployment.', colors.red);
    log(lineEndingResult.error.stdout || lineEndingResult.error.message, colors.yellow);
    return;
  }
  
  // Step 3: Disable telemetry
  log('\n📋 Disabling Next.js telemetry...', colors.blue);
  const telemetryResult = execute('npx next telemetry disable');
  
  if (!telemetryResult.success) {
    log('⚠️ Failed to disable telemetry. Continuing anyway.', colors.yellow);
  } else {
    log('✅ Next.js telemetry disabled', colors.green);
  }
  
  // Step 4: Build the application
  log('\n📋 Building the application...', colors.blue);
  log('This may take a few minutes...', colors.yellow);
  
  const buildResult = execute('npm run build', { stdio: 'inherit' });
  
  if (!buildResult.success) {
    log('❌ Build failed. Aborting deployment.', colors.red);
    return;
  }
  
  log('✅ Build completed successfully', colors.green);
  
  // Step 5: Deploy to Vercel
  log('\n📋 Deploying to Vercel...', colors.blue);
  log('You can deploy using one of the following methods:', colors.yellow);
  log('1. Run: vercel --prod', colors.magenta);
  log('2. Push to your GitHub repository and let Vercel auto-deploy', colors.magenta);
  log('3. Use the Vercel dashboard to deploy manually', colors.magenta);
  
  // Prompt for deployment method
  log('\n📋 Deployment instructions:', colors.blue);
  log('1. Ensure all your changes are committed to git', colors.yellow);
  log('2. Push your changes to GitHub', colors.yellow);
  log('3. Vercel will automatically deploy your application', colors.yellow);
  log('4. Check the Vercel dashboard for deployment status', colors.yellow);
  
  log('\n🎉 Deployment preparation completed successfully!', colors.green);
}

// Run the deployment process
deploy().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});