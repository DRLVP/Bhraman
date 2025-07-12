/**
 * Pre-deployment check script
 * This script performs various checks to ensure the codebase is ready for deployment
 */

const fs = require('fs');
const path = require('path');
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

// Check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Main function to run all checks
async function runChecks() {
  log('🔍 Starting pre-deployment checks...', colors.cyan);
  let allPassed = true;
  
  // Check 1: Verify .env.production exists
  log('\n📋 Checking environment files...', colors.blue);
  if (fileExists('.env.production')) {
    log('✅ .env.production file exists', colors.green);
  } else {
    log('❌ .env.production file is missing', colors.red);
    allPassed = false;
  }
  
  // Check 2: Run ESLint to check for syntax errors
  log('\n📋 Running ESLint to check for syntax errors...', colors.blue);
  try {
    // Focus on the file that had deployment issues
    execSync('npx eslint "src/app/api/admin/home-config/route.ts" --max-warnings=0', { stdio: 'pipe' });
    log('✅ ESLint passed for home-config route file', colors.green);
  } catch (error) {
    log('❌ ESLint found issues in home-config route file', colors.red);
    log(error.stdout.toString(), colors.yellow);
    allPassed = false;
  }
  
  // Check 3: Verify line endings in critical files
  log('\n📋 Checking line endings in critical files...', colors.blue);
  const criticalFiles = [
    'src/app/api/admin/home-config/route.ts',
    'next.config.ts',
  ];
  
  for (const file of criticalFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('\r\n')) {
        log(`❌ File ${file} has CRLF line endings`, colors.red);
        allPassed = false;
      } else {
        log(`✅ File ${file} has correct LF line endings`, colors.green);
      }
    } catch (error) {
      log(`❌ Error checking ${file}: ${error.message}`, colors.red);
      allPassed = false;
    }
  }
  
  // Check 4: Verify .gitattributes exists
  log('\n📋 Checking .gitattributes file...', colors.blue);
  if (fileExists('.gitattributes')) {
    log('✅ .gitattributes file exists', colors.green);
  } else {
    log('❌ .gitattributes file is missing', colors.red);
    allPassed = false;
  }
  
  // Check 5: Verify .vercelignore exists
  log('\n📋 Checking .vercelignore file...', colors.blue);
  if (fileExists('.vercelignore')) {
    log('✅ .vercelignore file exists', colors.green);
  } else {
    log('❌ .vercelignore file is missing', colors.red);
    allPassed = false;
  }
  
  // Final result
  log('\n📋 Pre-deployment check summary:', colors.magenta);
  if (allPassed) {
    log('✅ All checks passed! Your code is ready for deployment.', colors.green);
  } else {
    log('❌ Some checks failed. Please fix the issues before deploying.', colors.red);
  }
}

// Run the checks
runChecks().catch(error => {
  log(`\n❌ Error running checks: ${error.message}`, colors.red);
  process.exit(1);
});