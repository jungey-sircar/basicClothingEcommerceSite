# 🌱 Admin Seeding Script Guide (Production-Ready)

Your backend includes a production-ready admin seeding script. This guide shows you how to use it.

---

## 📍 Script Location
`backend/scripts/seed-admin.mjs`

**Status**: ✅ Production-ready with error handling and safety checks

---

## 🚀 Quick Usage

### Default Admin (No Arguments)
```bash
cd backend
npm run seed-admin
```

Creates admin with:
- **Email**: `admin@production.local`
- **Name**: `Admin User`
- **Role**: `admin`
- **Status**: `active`

### With Custom Credentials
```bash
npm run seed-admin -- --email admin@company.com --name "John Doe"
```

### Production Environment (Via .env)
```bash
# Set in backend/.env:
ADMIN_EMAIL=prod-admin@company.com
ADMIN_NAME="Production Administrator"

# Then run:
npm run seed-admin:prod
```

---

## ✅ Safety Features

The script includes these safety checks:

1. **✓ Duplicate Prevention**: Won't create duplicate admins with same email
2. **✓ Role Correction**: If user exists but isn't admin, upgrades their role
3. **✓ Error Handling**: Clear error messages if connection fails
4. **✓ Clean Disconnect**: Always disconnects from DB after completion
5. **✓ Validation**: Requires MONGODB_URI environment variable

---

## 📋 Step-by-Step Usage

### Step 1: Ensure Backend is Running
```bash
cd backend

# In terminal 1:
npm run dev

# Backend should show:
# ✓ Successfully connected to MongoDB
# Backend running at http://localhost:5000
```

### Step 2: Run Seed Script (In New Terminal)
```bash
cd backend

# Terminal 2:
npm run seed-admin -- --email admin@mycompany.com --name "Admin User"
```

### Step 3: Expected Output
```
🌱 Admin Seed Script

Configuration:
  MongoDB URI: mongodb+srv://user:****@cluster.mongodb.net/garments-production-tracker
  Admin Email: admin@mycompany.com
  Admin Name: Admin User

✓ Connected to MongoDB
✓ Admin user created successfully:
  Email: admin@mycompany.com
  Name: Admin User
  Role: admin
  Status: active

✓ Seed completed successfully
✓ Disconnected from MongoDB
```

---

## 🔧 Configuration Options

### Via Command Line Arguments
```bash
# Email and name
npm run seed-admin -- --email user@example.com --name "Full Name"

# Just email (name defaults)
npm run seed-admin -- --email admin@example.com

# Just name (email defaults)
npm run seed-admin -- --name "Admin Name"
```

### Via Environment Variables (.env)
```bash
# In backend/.env:
ADMIN_EMAIL=my-admin@company.com
ADMIN_NAME=My Administrator

# Then run (uses .env values):
npm run seed-admin
```

### Priority Order
1. Command line arguments (highest priority)
2. Environment variables from .env
3. Default values (lowest priority)

---

## 📊 What the Script Does

### New Admin

✅ Creates user document with:
```javascript
{
  name: "Admin User",
  email: "admin@company.com",
  role: "admin",
  status: "active",
  photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Admin%20User",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Existing Non-Admin User

✅ Updates role to admin:
```
Found user with different role: "buyer" → upgrading to "admin"
Status: "active" → keeping active
```

### Existing Admin

✅ No changes (already admin):
```
⚠ Admin user already exists with email: admin@company.com
  No updates needed.
```

---

## 🔐 Security Notes

1. **Password Storage**: This is Firebase Auth - no password stored in MongoDB
2. **Email Validation**: Email must be valid format (validated by Mongoose)
3. **Role Assignment**: Only email-based, no password required
4. **Access Control**: Admin role has full database access

---

## 🐛 Troubleshooting

### Error: "MONGODB_URI environment variable is required"
```bash
# Solution: Add to backend/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db?...
```

### Error: "Connected to MongoDB" → But fails to create admin
```bash
# Check MongoDB permissions
# Solution: Ensure database user has readWrite permissions
```

### Error: "Failed to seed admin user: User validation failed"
```bash
# Check provided email format
# Solution: Must be valid email format (e.g., admin@example.com)
```

### Script hangs or times out
```bash
# Check MongoDB connection
npm run validate-mongo

# If connection fails, debug:
# 1. Verify IP is whitelisted in MongoDB Atlas
# 2. Check username/password are correct
# 3. Try with local MongoDB first
```

---

## 💡 Use Cases

### Initial Deployment
```bash
# First time setup with real admin
npm run seed-admin -- \
  --email admin@production.company.com \
  --name "System Administrator"
```

### Development Testing
```bash
# Quick setup with default values
npm run seed-admin
```

### Staging Environment
```bash
# Configure via .env
# backend/.env:
# ADMIN_EMAIL=staging-admin@company.com
# ADMIN_NAME=Staging Admin

npm run seed-admin
```

### Production Automation (CI/CD)
```bash
# In your deployment script:
#!/bin/bash

cd /app/backend
npm install
npm run seed-admin -- \
  --email "$ADMIN_EMAIL" \
  --name "$ADMIN_NAME"
```

---

## 🔄 Updating an Existing Admin

The script is **idempotent** - safe to run multiple times:

```bash
# First run:
npm run seed-admin -- --email admin@example.com
# Creates: new admin user

# Second run with same email:
npm run seed-admin -- --email admin@example.com
# Result: No changes (already admin)

# Change non-admin to admin:
npm run seed-admin -- --email buyer@example.com
# Result: Updates role from "buyer" to "admin"
```

---

## 📊 Database Impact

### Collections Created/Modified
- **Users collection**: Creates or updates one document

### Sample Data Included
```javascript
{
  _id: ObjectId("..."),
  name: "Admin User",
  email: "admin@production.local",
  role: "admin",
  status: "active",
  photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Admin%20User",
  createdAt: ISODate("2026-05-31T..."),
  updatedAt: ISODate("2026-05-31T...")
}
```

---

## ✨ Real-World Example

### Scenario: Deploy to Production

```bash
# 1. SSH into server
ssh deploy@production.example.com

# 2. Navigate to application
cd /var/www/garments-app

# 3. Update code
git pull origin main
npm install

# 4. Start backend
npm run dev

# 5. In new terminal on server:
npm run seed-admin -- \
  --email production-admin@company.com \
  --name "Production Administrator"

# 6. Verify admin created
curl http://localhost:5000/api/health

# 7. Login with admin Firebase account
# - Go to app frontend
# - Sign up with: production-admin@company.com
# - Login with Firebase
# - Admin access automatically enabled (no password needed)
```

---

## 📝 Verification Script

After running seed-admin, verify everything:

```bash
# 1. Check admin user exists
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# 2. Check database state
curl http://localhost:5000/api/debug/db-state

# 3. Frontend test
# - Open http://localhost:5173
# - Click "Sign Up"
# - Use admin email from seed script
# - Firebase will authenticate
# - App should grant admin access
```

---

## 🎯 Best Practices

1. **Use strong emails**: `admin@company.com` (not `admin`, `test`, etc.)
2. **Use full names**: `"John Smith"` (not just `"admin"`)
3. **Save credentials**: Note the admin email for team access
4. **Test access**: Verify frontend admin features work
5. **Document setup**: Keep records of when/who seeded admin
6. **Monitor access**: Check admin activity in database
7. **Backup before seed**: In production, backup first

---

## 🚀 Automation Example (Docker)

If using Docker for deployment:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend ./backend

WORKDIR /app/backend

RUN npm install

# Create admin user on container start
CMD npm run dev & \
    sleep 5 && \
    npm run seed-admin -- \
      --email ${ADMIN_EMAIL} \
      --name "${ADMIN_NAME}"
```

---

## 📚 Related Scripts

- **`npm run validate-mongo`**: Test MongoDB connection
- **`npm run smoke`**: Run integration tests
- **`npm run dev`**: Start backend server

---

## 🎓 Learning Resources

The script demonstrates:
- ✅ ES6 modules (`import`/`export`)
- ✅ MongoDB with Mongoose
- ✅ Async/await error handling
- ✅ CLI argument parsing
- ✅ Environment variable usage
- ✅ Database operations (find, update, create)

---

**Happy seeding! 🌱**

For issues, check the backend logs or run `npm run validate-mongo` to verify database connection.

