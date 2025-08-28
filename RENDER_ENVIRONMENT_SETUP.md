# 🔧 Render Environment Variables Setup

## 🚨 Current Issue
Your Render deployment is failing because it's trying to connect to `localhost:27017` instead of your MongoDB Atlas database.

**Error:** `connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017`

## ✅ Solution: Set Environment Variables on Render

### Step 1: Go to Render Dashboard
1. Open [render.com](https://render.com) and log in
2. Find your `quiz-platform-backend` service
3. Click on the service name

### Step 2: Navigate to Environment Tab
1. Click on **"Environment"** in the left sidebar
2. You should see a list of environment variables

### Step 3: Set Required Environment Variables

Add these **exact** environment variables:

| Variable Name | Value | Notes |
|---------------|--------|--------|
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `10000` | Or leave empty (Render sets automatically) |
| `MONGO_URI` | `mongodb+srv://arpitmahajan856_db_user:SUk6uJMH66ZCbrcK@quiz-pro.vp0qh2y.mongodb.net/?retryWrites=true&w=majority&appName=Quiz-Pro` | **CRITICAL** - Your MongoDB Atlas connection |
| `JWT_SECRET` | `secretpassword123` | Or use a more secure secret |

### Step 4: Critical - MongoDB Atlas Connection String

**Make sure the MONGO_URI is set to:**
```
mongodb+srv://arpitmahajan856_db_user:SUk6uJMH66ZCbrcK@quiz-pro.vp0qh2y.mongodb.net/?retryWrites=true&w=majority&appName=Quiz-Pro
```

**DO NOT use:**
- `mongodb://localhost:27017/quiz-platform` ❌
- `mongodb://127.0.0.1:27017/quiz-platform` ❌

### Step 5: Save and Redeploy
1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Monitor the build logs

## 🔍 Verification - What to Look For

### ✅ Success Logs:
```
🔗 Attempting to connect to MongoDB...
Environment: production
MongoDB URI provided: Yes
✅ MongoDB Connected: quiz-pro-shard-00-00.vp0qh2y.mongodb.net
📊 Database: [your-database-name]
🚀 Server running on port 10000
```

### ❌ Failure Logs:
```
❌ MongoDB Connection Error: connect ECONNREFUSED ::1:27017
- MONGO_URI: NOT SET
🚨 PRODUCTION DEPLOYMENT ERROR:
Please check your Render environment variables
```

## 🛠️ Troubleshooting

### If Still Getting localhost Error:
1. **Double-check MONGO_URI:** Make sure it's the Atlas connection string, not localhost
2. **Clear Environment:** Remove any old/duplicate MONGO_URI variables
3. **Redeploy:** Always redeploy after changing environment variables

### If MongoDB Atlas Connection Fails:
1. **Check IP Whitelist:** Add `0.0.0.0/0` to MongoDB Atlas network access
2. **Verify Credentials:** Ensure username/password are correct
3. **Check Database Name:** Ensure the database exists in Atlas

### If Service Won't Start:
1. **Check Build Logs:** Look for npm install errors
2. **Verify Dependencies:** Ensure all packages in package.json are valid
3. **Check Start Command:** Should be `npm start` or your custom start command

## 📋 Environment Variables Checklist

Before redeploying, verify these are ALL set in Render:

- [ ] `NODE_ENV` = `production`
- [ ] `MONGO_URI` = `mongodb+srv://...` (Atlas connection string)
- [ ] `JWT_SECRET` = `secretpassword123` (or your secure secret)
- [ ] `PORT` = `10000` (or empty/auto)

## 🚀 Quick Fix Commands

If you need to update your MongoDB Atlas connection string:

1. **Current Working URI:**
```
mongodb+srv://arpitmahajan856_db_user:SUk6uJMH66ZCbrcK@quiz-pro.vp0qh2y.mongodb.net/?retryWrites=true&w=majority&appName=Quiz-Pro
```

2. **Test Locally:**
```bash
cd backend
MONGO_URI="mongodb+srv://..." npm start
```

## 📞 Need Help?

If the deployment still fails after setting environment variables:
1. Check MongoDB Atlas cluster is running
2. Verify network access allows all IPs (0.0.0.0/0)
3. Try creating a new database user in MongoDB Atlas
4. Copy the exact connection string from MongoDB Atlas dashboard
