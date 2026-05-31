# MongoDB Atlas Setup Guide

This guide explains how to set up and use MongoDB Atlas with the Garments Production Tracking System backend.

## Prerequisites

- MongoDB Atlas account (free tier available at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas))
- Node.js installed locally
- Backend repository cloned

## Step 1: Create MongoDB Atlas Cluster

### 1.1 Sign in to MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign in or create a new account
3. Click "Create" to start a new project

### 1.2 Create a Cluster
1. Select **M0 Sandbox** (free tier) for development/testing
2. Choose your cloud provider (AWS, Google Cloud, or Azure)
3. Select a region close to your server location
4. Name your cluster (e.g., `garments-tracking-prod`)
5. Click "Create Cluster"

Wait 5-10 minutes for the cluster to be created.

## Step 2: Configure Database Access

### 2.1 Create Database User
1. In your cluster, go to **Security** → **Database Access**
2. Click **"+ Add New Database User"**
3. Choose "Password" authentication
4. Set a username (e.g., `garments_user`)
5. Set a secure password (or use auto-generated)
6. Click "Add User"

**Save this username and password securely** - you'll need them for the connection string.

### 2.2 Configure Network Access
1. Go to **Security** → **Network Access**
2. Click **"+ Add IP Address"**
3. Choose one of:
   - **Allow Access from Anywhere** (0.0.0.0/0) - for development only
   - **Add Current IP Address** - add your server's static IP
   - **Add IP Address** - manually enter specific IPs

For production, always use specific IP addresses instead of allowing all IPs.

## Step 3: Get Your Connection String

### 3.1 Retrieve Connection String
1. In your cluster, click **"Connect"**
2. Select **"Drivers"** (for application)
3. Choose **"Node.js"** driver
4. Copy the connection string
5. It will look like:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

### 3.2 Customize the Connection String
Replace the placeholders:
- `username` - Your database user
- `password` - Your database user's password (URL-encode special chars)
- `cluster-name` - Your cluster name
- `database-name` - Use `garments-production-tracker`

**Example:**
```
mongodb+srv://garments_user:MyP@ssw0rd@garments-tracking-prod.mongodb.net/garments-production-tracker?retryWrites=true&w=majority
```

If your password contains special characters, URL-encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- Use an online URL encoder if needed

## Step 4: Configure Backend

### 4.1 Update Environment Variables
Create or update `.env` in the backend directory:

```env
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/garments-production-tracker?retryWrites=true&w=majority
NODE_ENV=production
ADMIN_EMAIL=admin@company.com
ADMIN_NAME=Administrator
```

### 4.2 Verify Connection
Start the backend:
```powershell
npm run dev
```

Look for the success message:
```
✓ Successfully connected to MongoDB
Backend running at http://localhost:5000
```

If connection fails, check:
1. Username and password are correct (including URL-encoding)
2. IP address is in the Network Access whitelist
3. Database name is correct
4. Cluster is fully deployed (not still loading)

## Step 5: Seed Initial Data

### 5.1 Auto-Seed (First Run)
On the first server startup, the database is automatically seeded with:
- Demo users (admin, manager, buyer)
- Sample products

### 5.2 Manual Admin Seed
To create a production admin user:

```powershell
# Using environment variables
npm run seed-admin

# With explicit credentials
node scripts/seed-admin.mjs --email admin@company.com --name "John Doe"
```

Verify the admin user was created:
```powershell
curl http://localhost:5000/api/health
```

## Troubleshooting

### Authentication Failed
**Error:** `authentication failed`

**Solutions:**
1. Verify username and password in connection string
2. Check for URL encoding issues with special characters
3. Ensure user has access to the correct database
4. Verify user has readWrite role

### IP Address Not Whitelisted
**Error:** `connection timeout` or `unable to connect`

**Solutions:**
1. Go to **Network Access** in Atlas
2. Add your server's public IP address
3. Or allow 0.0.0.0/0 for development (not recommended for production)
4. Wait a few minutes for changes to take effect

### Cluster Not Available
**Error:** `Server selection timeout`

**Solutions:**
1. Verify cluster is fully deployed (check Atlas dashboard)
2. Ensure cluster tier is not paused/stopped
3. Check cluster is in the same region as your server (for best latency)

### Special Characters in Password
**Error:** `invalid auth credentials`

**Example with special characters:**
Password: `MyP@ssw0rd!123`

Connect string becomes:
```
mongodb+srv://garments_user:MyP%40ssw0rd%21123@cluster.mongodb.net/garments-production-tracker
```

[URL Encoding Reference](https://en.wikipedia.org/wiki/Percent-encoding)

## Connection String Format Reference

### Minimum Required
```
mongodb+srv://user:password@cluster.mongodb.net/database
```

### Production Recommended
```
mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true
```

### Additional Options
- `retryWrites=true` - Retry writes on network failures
- `w=majority` - Wait for all replicas before confirming write
- `ssl=true` - Use SSL encryption (default for Atlas)
- `authSource=admin` - Specify auth database if needed

## Security Best Practices

✅ **DO:**
- Use strong, randomly generated passwords (20+ characters)
- Limit IP whitelist to specific server IPs
- Rotate credentials regularly
- Use different passwords for development and production
- Store credentials in `.env` files (never commit to Git)
- Enable IP whitelist enforcement

❌ **DON'T:**
- Share connection strings via email or chat
- Use `0.0.0.0/0` (allow all IPs) in production
- Commit `.env` files to version control
- Use simple/predictable passwords
- Store credentials in source code

## Performance Tuning

### Connection Pooling
The backend automatically uses appropriate pool sizes:
- **Development:** min 2, max 10 connections
- **Production:** min 5, max 20 connections
- **Test:** min 1, max 2 connections

### Region Selection
Choose a region closest to your server for lowest latency:
- Cluster region matches server region → best performance
- Cross-region connections add 50-200ms latency

### Scaling Up from M0
When your free M0 cluster approaches limits:
1. Go to **Cluster** → **Upgrade**
2. Change to M2 (small paid tier) or higher
3. No downtime required - Atlas handles the upgrade

## Monitoring

### Check Connection Status
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-05-31T12:00:00Z"
}
```

### View Database Statistics
In MongoDB Atlas:
1. Go to **Dashboard** for cluster overview
2. View storage, operations, and network metrics
3. Set up alerts for thresholds

### Application Logs
Check backend logs for connection issues:
```powershell
npm run dev 2>&1 | Tee-Object -FilePath logs.txt
```

## Next Steps

1. [Deploy backend to production](../../README.md#deployment)
2. [Configure frontend to use production backend](../../garments-production-tracking-system-client/README.md)
3. [Set up backup and restore procedures](https://docs.atlas.mongodb.com/backup/cloud-provider-snapshots/)
4. [Enable advanced security features](https://docs.atlas.mongodb.com/security-checklist/)

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Reference](https://docs.atlas.mongodb.com/driver-connection/)
- [Network Access Documentation](https://docs.atlas.mongodb.com/security/ip-access-list/)
- [Backup & Restore Guide](https://docs.atlas.mongodb.com/backup/cloud-provider-snapshots/)

