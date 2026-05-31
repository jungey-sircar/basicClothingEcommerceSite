# Garments Production Tracking System Backend
This is the standalone backend for the garments production tracking frontend.

## Stack
- Node.js
- Express
- MongoDB with Mongoose
- Zod validation
- Helmet, CORS, Morgan, and rate limiting

## Setup

### Installation
```powershell
cd C:\Users\USER\Desktop\clothing\backend
npm install
```

### Environment Configuration
Create a `.env` file in the backend directory:

**Option 1: Local MongoDB (Development)**
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb://127.0.0.1:27017/garments-production-tracker
```

**Option 2: MongoDB Atlas (Production)**
```env
PORT=5000
CORS_ORIGIN=https://your-domain.com
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/garments-production-tracker?retryWrites=true&w=majority
ADMIN_EMAIL=admin@company.com
ADMIN_NAME=Admin User
```

### MongoDB Atlas Connection String Format
Replace the placeholders in the connection string:
- `username` - Your MongoDB Atlas user
- `password` - Your MongoDB Atlas password (URL-encoded if special characters)
- `cluster-name` - Your Atlas cluster name (e.g., `cluster0`)
- `garments-production-tracker` - Your database name

For Atlas users with IP whitelist, ensure your server's IP is added to the whitelist.

## Running the Server

### Development
```powershell
npm run dev
```

### Production
```powershell
npm start
```

## Seeding Data

### Automatic Seed (On First Run)
On first server startup, the database is automatically seeded with:
- Demo users (admin, manager, buyer)
- Sample products (shirts, pants, jackets, accessories)

### Manual Admin Seed (Production)
Use this script to create or update an admin user in production:

```powershell
# Create admin with environment variables
npm run seed-admin

# Create admin with custom credentials
node scripts/seed-admin.mjs --email admin@company.com --name "John Doe"
```

**Note:** The auto-seed only runs if the database is empty. For subsequent admin additions, use the manual seed script.

## Frontend Connection
Set the client environment variable in the frontend `.env`:
```env
VITE_BACKEND=http://localhost:5000
```

For production, use your deployed backend URL:
```env
VITE_BACKEND=https://api.your-domain.com
```

## Demo Accounts
When the database is first seeded, the following accounts are created:
- `admin@demo.local` → admin (full system access)
- `manager@demo.local` → manager (product & order management)
- `buyer@demo.local` → buyer (place orders, track shipments)

**Note:** These demo accounts are only created if the database is empty. Remove them manually if needed.

## Testing

### Smoke Test
```powershell
npm run smoke
```

### Health Check
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/health
```

## Troubleshooting

### MongoDB Connection Issues
- **Atlas Error**: Verify IP whitelist includes your server IP
- **Local Error**: Ensure MongoDB is running on `localhost:27017`
- **URI Error**: Check for URL-encoded special characters in password

### Environment Variables Not Loading
- Ensure `.env` file is in the backend root directory
- Restart the server after changing `.env`
- Use `echo $env:MONGODB_URI` to verify the variable is set

