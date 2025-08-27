# Backend Setup Guide

## 1. Create Environment File
Create a `.env` file in the backend directory with:

```bash
MONGO_URI=mongodb://localhost:27017/quiz-platform
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
PORT=5000
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Start MongoDB
Make sure MongoDB is running on your system.

## 4. Seed the Database
```bash
npm run seed:frontend
```

## 5. Start the Server
```bash
npm run dev
```

## Troubleshooting

### If quizzes still don't load:
1. Check MongoDB connection in console
2. Verify the `.env` file exists and has correct values
3. Check browser console for API errors
4. Ensure the backend is running on port 5000

### Frontend Fallback
The frontend now has a fallback to use local quiz data if the backend fails, so you can test the UI even without the backend running.
