# API Configuration

This project now uses environment-based API configuration to switch between local development and production environments automatically.

## Configuration Files

- `.env.development` - Used during development
- `.env.production` - Used during production builds

## Current Configuration

### Development (local)
- API URL: `http://localhost:5000`

### Production  
- API URL: `https://quiz-platform-dxx0.onrender.com`

## How It Works

The frontend uses Vite's environment variable system (`import.meta.env.VITE_API_BASE_URL`) to automatically determine which API URL to use based on the build mode.

## Files Updated

- `src/config/api.js` - Central API configuration utility
- `src/pages/Dashboard.jsx` - Updated API calls
- `src/pages/Login.jsx` - Updated API calls  
- `src/pages/Signup.jsx` - Updated API calls
- `src/pages/QuizAttempt.jsx` - Updated API calls
- `src/pages/QuizResult.jsx` - Updated API calls

## Usage in Components

Instead of hardcoded URLs, components now use:

```javascript
import { getApiUrl } from '../config/api';

const response = await fetch(getApiUrl('api/auth/login'), {
  // ... request options
});
```

This ensures all API calls automatically use the correct base URL for the current environment.
