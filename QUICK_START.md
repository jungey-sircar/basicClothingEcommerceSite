# 🚀 Quick Start Guide

## What Was Fixed

✅ **Critical Bug Fixed**: AuthProvider context provider syntax error that was causing the blank page.

The issue: `<AuthContext value={...}>` should be `<AuthContext.Provider value={...}>`

---

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Firebase account

### Step 1: Backend Setup (5 minutes)

```bash
cd backend

# Install dependencies
npm install

# Configure MongoDB Atlas
# EDIT .env file with your MongoDB credentials:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garments-production-tracker?retryWrites=true&w=majority

# Start backend
npm run dev
```

**Backend ready at**: http://localhost:5000

### Step 2: Frontend Setup (5 minutes)

```bash
cd garments-production-tracking-system-client

# Install dependencies
npm install

# Configure Firebase
# EDIT .env file with your Firebase credentials:
# VITE_apiKey=...
# VITE_authDomain=...
# (etc.)

# Start frontend
npm run dev
```

**Frontend ready at**: http://localhost:5173

---

## 📋 .env Files Required

### Backend: `.backend/.env`
```
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/garments-production-tracker?retryWrites=true&w=majority
ADMIN_EMAIL=admin@production.local
ADMIN_NAME=System Administrator
```

### Frontend: `.garments-production-tracking-system-client/.env`
```
VITE_apiKey=your_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_bucket.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_BACKEND=http://localhost:5000
VITE_IMGBB_API_KEY=your_imgbb_key
```

---

## 🔍 Verify Everything is Working

### Check Backend
```bash
# From backend directory
curl http://localhost:5000/api/health
# Should return: {"success":true,"status":"ok",...}
```

### Check Database Connection
```bash
# From backend directory
npm run validate-mongo
```

### Seed Admin User
```bash
# From backend directory (after backend is running)
npm run seed-admin
```

### Open Frontend
- Navigate to http://localhost:5173
- Should see the application (no blank page!)

---

## 🐛 If You See a Blank Page

1. ✅ AuthProvider bug has been fixed
2. Check browser console (F12) for errors
3. Verify Firebase credentials in `.env`
4. Ensure backend is running and accessible
5. Check VITE_BACKEND URL in `.env`

---

## 📚 Project Structure

```
clothing/
├── backend/
│   ├── src/
│   │   ├── server.js (Express app)
│   │   ├── db.js (MongoDB connection)
│   │   ├── seed.js (Database seeding)
│   │   ├── models/ (Mongoose schemas)
│   │   └── auth.js (JWT authentication)
│   ├── scripts/
│   │   ├── seed-admin.mjs (Admin user seeding)
│   │   └── validate-mongo.mjs (Connection validator)
│   └── .env (Configuration - NEVER commit!)
│
└── garments-production-tracking-system-client/
    ├── src/
    │   ├── main.jsx (Entry point)
    │   ├── firebase/
    │   ├── context/ (React Context for auth)
    │   ├── routes/ (React Router setup)
    │   ├── pages/ (Page components)
    │   └── hooks/ (Custom hooks)
    └── .env (Configuration - NEVER commit!)
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Blank page on frontend | ✅ FIXED! AuthProvider bug corrected |
| MongoDB connection fails | Check MONGODB_URI in .env, verify IP whitelist |
| Firebase auth not working | Verify Firebase credentials in .env |
| CORS errors | Check CORS_ORIGIN in backend .env |
| Port already in use | Change PORT in backend .env |

---

## 📖 Full Documentation

See `SETUP_GUIDE.md` for detailed setup instructions.

---

## 🎯 Next Steps

1. Fill in your `.env` files with actual credentials
2. Start the backend: `npm run dev` (in backend directory)
3. Start the frontend: `npm run dev` (in client directory)
4. Seed the admin user: `npm run seed-admin` (in backend directory)
5. Login to the application

---

**Happy coding! 🎉**

