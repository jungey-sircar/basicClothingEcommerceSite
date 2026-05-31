# Garments Production Tracking System Backend

This is the standalone backend for the garments production tracking frontend.

## Stack
- Node.js
- Express
- Zod validation
- Helmet, CORS, Morgan, and rate limiting
- JSON file storage for local development

## Local setup

```powershell
cd C:\Users\USER\Desktop\clothing\backend
npm install
npm run dev
```

The server listens on `http://localhost:5000` by default.

## Environment variables

Create a `.env` file if you need to override defaults:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

## Frontend connection
Set the client environment variable:

```env
VITE_BACKEND=http://localhost:5000
```

## Demo accounts

The backend seeds a few local users:
- `admin@demo.local` → admin
- `manager@demo.local` → manager
- `buyer@demo.local` → buyer

## Quick smoke test

```powershell
cd C:\Users\USER\Desktop\clothing\backend
npm run smoke
```

