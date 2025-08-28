# 🚀 Render Deployment Fix Guide

## Problem
Render is looking for `/opt/render/project/src/server.js` but the actual server file is located in the `backend` directory.

**Error:** `Cannot find module '/opt/render/project/src/server.js'`

## Solution Options (in order of preference)

### Option 1: Use the Updated render.yaml (Recommended)
The main `render.yaml` has been updated to explicitly specify the backend directory:

```yaml
services:
  - type: web
    name: quiz-platform-backend
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && node server.js
    plan: free
    env: node
    region: ohio
```

**To deploy with this option:**
1. Commit and push your changes
2. In your Render dashboard, make sure your service is using the `render.yaml` file
3. Trigger a new deployment

### Option 2: Use the Root server.js (Fallback)
I've created a `server.js` file in the project root that automatically redirects to the backend server.

**To deploy with this option:**
1. In your Render service settings, set:
   - Build Command: `npm install`
   - Start Command: `npm start`
2. The root `server.js` will handle the redirection

### Option 3: Use src/server.js (Emergency Fallback)
Created `src/server.js` as a direct fallback for Render's expected path.

### Option 4: Manual Render Configuration
If the above don't work, manually configure your Render service:

1. **Build Command:** `cd backend && npm install`
2. **Start Command:** `cd backend && npm start`
3. **Root Directory:** Leave empty or set to `.`

## Verification Steps

### Local Testing
```bash
# Test the root server.js
cd C:\Quiz-Platform
node server.js

# Test the src fallback
node src/server.js

# Test direct backend
cd backend
npm start
```

### Environment Variables
Make sure these are set in your Render service:
- `NODE_ENV=production`
- `PORT=10000` (or let Render set this automatically)
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_jwt_secret`

## Troubleshooting

### If still failing:
1. Check Render logs for the exact error
2. Verify your GitHub repository has all files committed
3. Try creating a new Render service instead of updating existing one
4. Use the `render-simple.yaml` configuration

### Common Issues:
- **Missing dependencies:** Make sure `package.json` in backend has all required packages
- **Environment variables:** Ensure MongoDB and JWT secrets are properly set
- **Node version:** Backend uses Node.js - verify compatibility in Render settings

## Files Modified/Created:
- ✅ `render.yaml` - Updated with explicit cd commands
- ✅ `server.js` (root) - Fallback redirector to backend
- ✅ `src/server.js` - Emergency fallback for Render's expected path
- ✅ `package.json` (root) - Added start script and postinstall hook
- ✅ `render-simple.yaml` - Alternative configuration without rootDir

## Next Steps:
1. Commit all changes to Git
2. Push to your repository
3. Redeploy on Render
4. Monitor the deployment logs
5. Test the deployed application

If you continue to have issues, the problem might be with:
- Render service configuration (try creating a new service)
- GitHub repository not properly synced
- Missing environment variables
- Outdated Render service settings
