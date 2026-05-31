# Production Deployment Checklist

Use this checklist when deploying the backend to production with MongoDB Atlas.

## Pre-Deployment (1-2 days before)

### MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created and fully deployed (check status in dashboard)
- [ ] Choose appropriate tier (M0=free, M2/M5+ for production)
- [ ] Region selected (closest to server for best latency)
- [ ] Backups enabled in Cluster Settings

### Database Security
- [ ] Database user created with strong password (20+ chars, mixed case, numbers, symbols)
- [ ] IP whitelist configured with server's static IP (NOT 0.0.0.0/0 for production)
- [ ] Database user has minimal required roles (readWrite to specific database)
- [ ] Connection string copied and tested locally

### Local Testing
- [ ] `.env` created in backend directory with MongoDB Atlas URI
- [ ] Run `npm install` to ensure all dependencies are available
- [ ] Run `npm run validate-mongo` to verify connection string format
- [ ] Run `npm run dev` to test backend starts successfully
- [ ] Run `npm run seed-admin` to create initial admin user
- [ ] Run `curl http://localhost:5000/api/health` to verify API responds
- [ ] Run `npm run smoke` to run smoke tests

## Day of Deployment

### Pre-Deployment Final Check
- [ ] Production `.env` file ready with final settings
- [ ] Database backups created in Atlas
- [ ] Team notified of deployment window
- [ ] Rollback plan documented

### Deployment Steps
1. **Stop Current Service** (if applicable)
   ```powershell
   # If running as a service, stop it
   # If running in development, stop the process
   ```

2. **Update Environment Variables**
   ```powershell
   # Copy production .env
   Copy-Item .env.production .env
   # Or set environment variables directly
   $env:MONGODB_URI = "mongodb+srv://..."
   $env:CORS_ORIGIN = "https://your-domain.com"
   $env:NODE_ENV = "production"
   ```

3. **Start Backend Service**
   ```powershell
   npm start
   # Or restart if running as a service
   ```

4. **Verify Connection**
   ```bash
   # Check health endpoint
   curl https://api.your-domain.com/health
   
   # Expected response:
   # {"success":true,"status":"ok","timestamp":"..."}
   ```

5. **Create Production Admin (if needed)**
   ```powershell
   npm run seed-admin -- --email admin@company.com --name "Administrator"
   ```

6. **Run Smoke Tests**
   ```powershell
   npm run smoke
   ```

### Post-Deployment Verification
- [ ] Backend health check passes (`/api/health`)
- [ ] Database connection is active and responding
- [ ] Admin user successfully created and can login
- [ ] Products are visible in API (`/api/products`)
- [ ] Frontend can connect to backend
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] Error handling is working (test with invalid request)

### Monitoring Setup
- [ ] MongoDB Atlas monitoring enabled
  - [ ] CPU utilization alerts set (threshold: >70%)
  - [ ] Disk utilization alerts set (threshold: >80%)
  - [ ] Memory utilization alerts set (threshold: >80%)
  
- [ ] Backend application monitoring
  - [ ] Error logging configured
  - [ ] Performance metrics tracked
  - [ ] Health check endpoint monitored (every 5 minutes)

- [ ] Logs accessible
  - [ ] Application logs stored and rotated
  - [ ] MongoDB Atlas has logging enabled
  - [ ] Error logs can be easily searched

## Post-Deployment (First Week)

### Daily Checks
- [ ] Backend service is running and responding
- [ ] Database connection is stable
- [ ] No error spikes in logs
- [ ] Response times are acceptable (<200ms for most routes)

### Weekly Review
- [ ] Database size and growth rate are normal
- [ ] Connection pool utilization is healthy
- [ ] No unauthorized access attempts in logs
- [ ] Backup and restore procedures tested
- [ ] Performance metrics reviewed

### Performance Tuning
- [ ] Connection pool size adjusted if needed
- [ ] Database indexes verified in Atlas
- [ ] Slow query logs reviewed
- [ ] Cache strategies evaluated if needed

## Monitoring Commands

### Check Backend Health
```bash
# Health check (public endpoint)
curl http://your-server/api/health

# Debug DB state (if enabled)
curl http://your-server/api/debug/db-state
```

### Check MongoDB Connection Status
```powershell
# Use the validation script
npm run validate-mongo

# Or in your application
# Look for "✓ Successfully connected to MongoDB" in logs
```

### Verify Admin User
```bash
# Login with admin credentials
curl -X POST http://your-server/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"..."}'
```

## Troubleshooting During Deployment

### Connection Timeout Error
```
Failed to connect to MongoDB: connect ENOTFOUND
```

**Solution:**
1. Verify IP address is in MongoDB Atlas whitelist
2. Check cluster is fully deployed
3. Verify connection string format with `npm run validate-mongo`

### Authentication Failed
```
authentication failed
```

**Solution:**
1. Verify username and password in connection string
2. Check for URL-encoded special characters (e.g., @ becomes %40)
3. Test connection locally first

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Update `CORS_ORIGIN` environment variable to include frontend URL
2. Restart backend service
3. Clear browser cache

### Database Locked
```
E11000 duplicate key error
```

**Solution:**
1. This usually indicates seeding issues
2. Check if initial seed already ran with `npm run smoke`
3. Don't run seed-admin multiple times with same email
4. Use `npm run seed-admin` for different admin accounts only

## Rollback Procedure

If deployment fails and you need to rollback:

1. **Revert Backend Code** (if changed)
   ```powershell
   git revert <commit-hash>
   npm install
   ```

2. **Restore MongoDB** (if database was modified)
   ```
   In MongoDB Atlas:
   1. Go to Cluster → Backups
   2. Select latest successful backup
   3. Click "Restore from Snapshot"
   4. Choose to replace current cluster
   ```

3. **Restart Services**
   ```powershell
   npm start
   ```

4. **Verify Rollback**
   ```bash
   curl http://your-server/api/health
   npm run smoke
   ```

## Environment Variables Reference

### Required
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/garments-production-tracker
PORT=5000
```

### Recommended
```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
ADMIN_EMAIL=admin@company.com
ADMIN_NAME=Administrator
```

### Optional
```env
# Logging
LOG_LEVEL=info

# Performance
MAX_REQUEST_SIZE=2mb
REQUEST_TIMEOUT=30s
```

## Security Checklist

- [ ] MongoDB credentials not in source code
- [ ] `.env` file added to `.gitignore`
- [ ] IP whitelist restricts access to known servers only
- [ ] HTTPS enforced for API endpoints (reverse proxy/SSL termination)
- [ ] Rate limiting enabled (default: 300 requests/minute)
- [ ] Helmet security headers enabled
- [ ] CORS only allows trusted domains
- [ ] No debug endpoints exposed in production
- [ ] Error messages don't leak sensitive information
- [ ] Database backups are regularly tested and verified

## Contact & Escalation

- **MongoDB Support:** [support.mongodb.com](https://support.mongodb.com)
- **Backend Issues:** [Create issue in repository]
- **Database Issues:** Check MongoDB Atlas dashboard for alerts
- **Emergency Contact:** [Add contact info here]

---

**Last Updated:** 2024-05-31
**Version:** 1.0
**Maintained By:** [Your Team]

