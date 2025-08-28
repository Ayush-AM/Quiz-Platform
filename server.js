#!/usr/bin/env node

/**
 * Root server.js file for Render deployment compatibility
 * This file redirects to the actual backend server
 */

// If we're in a situation where Render is looking for server.js in the root
// but our actual server is in the backend directory, this file will handle that

const path = require('path');
const fs = require('fs');

// Check if we're in the correct directory structure
const backendServerPath = path.join(__dirname, 'backend', 'server.js');
const srcServerPath = path.join(__dirname, 'src', 'server.js');

if (fs.existsSync(backendServerPath)) {
  console.log('🚀 Redirecting to backend/server.js...');
  // Change working directory to backend
  process.chdir(path.join(__dirname, 'backend'));
  // Require and run the backend server
  require('./backend/server.js');
} else if (fs.existsSync(srcServerPath)) {
  console.log('🚀 Redirecting to src/server.js...');
  require('./src/server.js');
} else {
  console.error('❌ Could not find server.js in expected locations:');
  console.error('  - backend/server.js');
  console.error('  - src/server.js');
  console.error('Current directory:', __dirname);
  console.error('Files in current directory:', fs.readdirSync(__dirname));
  process.exit(1);
}
