#!/usr/bin/env node

/**
 * Fallback server.js file in src directory for Render deployment
 * This redirects to the actual backend server
 */

const path = require('path');

console.log('🔄 Starting from src/server.js - redirecting to backend...');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Change to the parent directory (project root) then to backend
const backendPath = path.join(__dirname, '..', 'backend');
console.log('Changing to backend directory:', backendPath);

try {
  process.chdir(backendPath);
  console.log('Successfully changed to:', process.cwd());
  
  // Require the actual backend server
  require(path.join(backendPath, 'server.js'));
} catch (error) {
  console.error('❌ Failed to start backend server:', error.message);
  console.error('Attempted path:', backendPath);
  process.exit(1);
}
