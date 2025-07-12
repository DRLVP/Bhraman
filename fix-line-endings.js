/**
 * This script normalizes line endings in all JavaScript and TypeScript files
 * to use LF (\n) instead of CRLF (\r\n), which helps prevent syntax errors
 * during deployment to Vercel.
 */

const fs = require('fs');
const path = require('path');

// File extensions to process
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md'];

// Directories to exclude
const excludeDirs = ['node_modules', '.next', '.git', 'public'];

// Function to normalize line endings in a file
function normalizeLineEndings(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const normalizedContent = content.replace(/\r\n/g, '\n');
    
    if (content !== normalizedContent) {
      fs.writeFileSync(filePath, normalizedContent, 'utf8');
      console.log(`Normalized: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively process files in a directory
function processDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      if (!excludeDirs.includes(item)) {
        processDirectory(itemPath);
      }
    } else if (stats.isFile() && extensions.includes(path.extname(item))) {
      normalizeLineEndings(itemPath);
    }
  }
}

// Start processing from the current directory
const rootDir = process.cwd();
console.log(`Starting line ending normalization in ${rootDir}`);
processDirectory(rootDir);
console.log('Line ending normalization complete');