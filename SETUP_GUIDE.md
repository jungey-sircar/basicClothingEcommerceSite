# Environment Setup Guide

## Overview
This guide helps you set up the frontend and backend with MongoDB Atlas and Firebase.

---

## 🎯 Critical Issue Fixed

### ✅ Frontend - AuthProvider Context Bug (FIXED)
**File**: `garments-production-tracking-system-client/src/context/AuthProvider.jsx`

**Problem**: The context was not being provided correctly to the app.
```javascript
// ❌ BEFORE (Wrong)
<AuthContext value={AuthInfo}>
  {children}
</AuthContext>

// ✅ AFTER (Correct)
<AuthContext.Provider value={AuthInfo}>
  {children}
</AuthContext.Provider>
```

This was causing the blank page issue by preventing the context from being available to child components.

---

## 📋 Setup Instructions

### 1. Frontend Setup

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add a Web app to your project
4. Copy the Firebase config
5. Fill in your `.env` file with these values:

```bash
# File: .env (already created, update with your values)
VITE_apiKey=YOUR_API_KEY_HERE
VITE_authDomain=YOUR_PROJECT.firebaseapp.com
VITE_projectId=YOUR_PROJECT_ID
VITE_storageBucket=YOUR_PROJECT.appspot.com
VITE_messagingSenderId=YOUR_MESSAGING_ID
VITE_appId=YOUR_APP_ID
VITE_BACKEND=http://localhost:5000
VITE_IMGBB_API_KEY=YOUR_IMGBB_KEY_HERE
```

#### ImageBB API Key
1. Go to [ImageBB](https://imgbb.com/)
2. Sign up for an account
3. Get your API key from [here](https://api.imgbb.com/)
4. Add it to your `.env` file

#### Start Frontend
```bash
cd garments-production-tracking-system-client
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

### 2. Backend Setup

#### MongoDB Atlas Configuration
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with strong password
4. Get your connection string from "Connect" > "Drivers"
5. Update your `.env` file:

```bash
# File: .env (already created, update with your values)
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/garments-production-tracker?retryWrites=true&w=majority
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=System Administrator
```

#### Start Backend
```bash
cd backend
npm install
npm run dev
```

The backend will be available at: `http://localhost:5000`

#### Validate MongoDB Connection
```bash
npm run validate-mongo
```

This will check your MongoDB connection string and configuration.

#### Seed Admin User (After Backend is Running)
```bash
npm run seed-admin
# Or with custom credentials:
npm run seed-admin -- --email admin@yourcompany.com --name "John Doe"
```

---

## 🧪 Testing

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Check Database State
```bash
curl http://localhost:5000/api/debug/db-state
```

### Run Smoke Tests
```bash
cd backend
npm run smoke
```

---

## 🔒 Security Checklist (MongoDB Atlas)

- [ ] IP whitelist configured with your server IP
- [ ] Strong database password (20+ chars, mixed case, numbers, symbols)
- [ ] Database user has minimal required roles
- [ ] Connection string NOT committed to version control
- [ ] `.env` file added to `.gitignore`
- [ ] Backup strategy documented

---

## 📝 Environment Variables Summary

### Frontend (.env)
- Firebase API credentials (6 values)
- Backend URL (local: http://localhost:5000)
- ImageBB API key for image uploads

### Backend (.env)
- PORT (default: 5000)
- CORS_ORIGIN (frontend URLs)
- MONGODB_URI (Atlas or Local)
- ADMIN_EMAIL (for seeding)
- ADMIN_NAME (for seeding)

---

## ✅ Verification Steps

1. **Frontend Running**: Visit `http://localhost:5173`
2. **Backend Running**: Visit `http://localhost:5000/api/health`
3. **Database Connected**: Run `npm run validate-mongo` in backend
4. **Admin User Created**: Run `npm run seed-admin` in backend
5. **Can Login**: Try logging in or registering on frontend

---

## 🆘 Troubleshooting

### Blank Page on Frontend
- ✅ Fixed the AuthProvider context provider issue
- Check browser console for errors (F12)
- Verify Firebase credentials in `.env` are correct
- Check if backend is accessible from frontend

### MongoDB Connection Failed
- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Verify username and password
- Run `npm run validate-mongo`

### CORS Errors
- Check FRONTEND_URL matches CORS_ORIGIN in backend
- Ensure backend is running on port 5000

---

## 📚 Additional Resources

- [MongoDB Atlas Setup Guide](https://docs.mongodb.com/atlas/)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

Generated: May 31, 2026

