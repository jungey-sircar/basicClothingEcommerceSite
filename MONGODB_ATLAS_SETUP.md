# 🗄️ MongoDB Atlas Setup Checklist

## Complete Production-Ready Setup

### ✅ Step 1: Create MongoDB Atlas Account & Cluster
- [ ] Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create a free or paid account
- [ ] Create an Organization (optional but recommended)
- [ ] Create a Project named "Garments Production Tracker"
- [ ] Create a M0 (Free) or M5 (Paid) cluster
  - Region: Choose closest to your server
  - Cluster name: `garments-prod-cluster`
- [ ] Wait for cluster to be deployed (5-10 minutes)

### ✅ Step 2: Network & Security Setup

#### IP Whitelist (Critical!)
- [ ] Go to: **Network Access** → **IP Whitelist**
- [ ] Add your development IP: `0.0.0.0/0` (for development only!)
  - ⚠️ **For Production**: Add only specific server IP addresses
  - Examples: `203.0.113.42/32` (single IP)
- [ ] Add entries for:
  - Your development machine IP
  - Your production server IP
  - Any CI/CD server IPs

#### Database Users
- [ ] Go to: **Database Users** → **Add New Database User**
- [ ] Set Authentication Method: **Password**
- [ ] Username: `garments_app_user`
- [ ] Password: Generate strong password (20+ characters)
  - Use: Uppercase, lowercase, numbers, symbols
  - Example: `Kp#9@mL2$vQz*8xW&nD4!jR`
- [ ] Privilege: **Database User**
- [ ] Select Role: **Built-in Role** → **Read and write to any database**
- [ ] Add User

### ✅ Step 3: Get Connection String

- [ ] Go to: **Clusters** → **Connect**
- [ ] Select: **Drivers**
- [ ] Choose:
  - Language: **Node.js**
  - Driver: **Latest**
- [ ] Copy the connection string
  - Format: `mongodb+srv://garments_app_user:<password>@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority`

### ✅ Step 4: Configure Backend .env

```bash
# File: backend/.env

MONGODB_URI=mongodb+srv://garments_app_user:YOUR_PASSWORD_HERE@garments-prod-cluster.mongodb.net/garments-production-tracker?retryWrites=true&w=majority

# Replace YOUR_PASSWORD_HERE with the actual password
# DO NOT commit this file!
```

### ✅ Step 5: Test Connection

```bash
cd backend

# Validate connection string
npm run validate-mongo

# Should output ✓ Valid MongoDB Atlas connection string
```

### ✅ Step 6: Initialize Database

```bash
cd backend
npm install
npm run dev
```

### ✅ Step 7: Seed Initial Data

```bash
# In a new terminal (keep backend running)
cd backend
npm run seed-admin -- --email admin@company.com --name "Admin User"

# Should output:
# ✓ Admin user created successfully:
#   Email: admin@company.com
#   Name: Admin User
#   Role: admin
#   Status: active
```

---

## 🔒 Production Security Checklist

### Network Security
- [ ] **IP Whitelist**: Only specific server IPs, NOT 0.0.0.0/0
- [ ] **VPC Peering**: Consider for enterprise
- [ ] **SSL/TLS**: Always enabled (automatic with MongoDB Atlas)
- [ ] **Authentication**: Enabled with strong username/password

### Database Security
- [ ] **Database User**: Limited to required databases only
- [ ] **Roles**: Use minimal required roles (not admin)
- [ ] **Password**: Changed from default, stored in secure vault
- [ ] **Rotation**: Plan password rotation schedule

### Application Security
- [ ] **Env Variables**: Never committed to git
- [ ] **Connection String**: Masked in logs (automated)
- [ ] **Error Handling**: Don't expose connection details in errors
- [ ] **Backup**: Enable automatic backups
- [ ] **Monitoring**: Enable performance monitoring

### Backup & Recovery
- [ ] **Atlas Backups**: Enable automatic backups (M1+ clusters)
- [ ] **Backup Frequency**: Set to daily or hourly
- [ ] **Retention**: Keep 30 days of backups minimum
- [ ] **Test Recovery**: Practice restoring from backup
- [ ] **Disaster Plan**: Document recovery procedures

---

## 📊 Monitoring & Maintenance

### Atlas Dashboard Checks
- [ ] Monitor **Database Usage** regularly
- [ ] Check **Performance Advisor** for optimization tips
- [ ] Review **Query Profiler** for slow queries
- [ ] Monitor **Disk Usage** to prevent overages
- [ ] Set up **Alert Settings** for:
  - High CPU usage
  - Connection count spikes
  - Disk space warnings
  - Backup failures

### Connection String Format Reference

```
mongodb+srv://username:password@cluster.mongodb.net/database?options
              ^^^^^^^^  ^^^^^^^^  ^^^^^^^                ^^^^^^^
              user      pass      cluster              database
```

### Common Connection Issues

| Issue | Solution |
|-------|----------|
| `ENOTFOUND` | IP not whitelisted; add it to IP Whitelist |
| `authentication failed` | Wrong username/password |
| `unresolved address` | Wrong cluster name in connection string |
| `read ECONNREFUSED` | Cluster not in running state |

---

## 🚀 Scaling Considerations

### When to Upgrade from M0
- [ ] Evaluate when reaching 1GB storage limit
- [ ] Monitor daily writes (M0 = development only)
- [ ] Consider M5 or M10 for production workloads

### Multi-Region Setup (Advanced)
- [ ] Create replica sets across regions for HA
- [ ] Enable sharding for horizontal scaling
- [ ] Configure global write capability

---

## 📝 Connection String Examples

### Development (Local)
```
MONGODB_URI=mongodb://127.0.0.1:27017/garments-production-tracker
```

### Production (Atlas)
```
MONGODB_URI=mongodb+srv://garments_app_user:password@garments-prod-cluster.mongodb.net/garments-production-tracker?retryWrites=true&w=majority&maxPoolSize=20&minPoolSize=5
```

### With Options
```
mongodb+srv://user:pass@cluster.mongodb.net/db?
  retryWrites=true&             # Automatic retry on transient errors
  w=majority&                   # Wait for majority replica confirmation
  maxPoolSize=20&               # Maximum connection pool
  minPoolSize=5&                # Minimum connection pool
  serverSelectionTimeoutMS=10000&  # Server selection timeout
  connectTimeoutMS=10000&       # Connection timeout
  socketTimeoutMS=45000         # Socket timeout
```

---

## 📞 Support & Resources

- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [Connection Troubleshooting](https://docs.mongodb.com/atlas/troubleshoot-connection/)
- [Security Best Practices](https://docs.mongodb.com/atlas/security/)
- [Atlas Administration API](https://docs.atlas.mongodb.com/)

---

## ✨ Verification Checklist

After setup, verify with:

```bash
# 1. Test connection
npm run validate-mongo

# 2. Seed data
npm run seed-admin

# 3. Check database
curl http://localhost:5000/api/debug/db-state

# Response should show:
# {"success":true,"counts":{"users":1,"products":n,"orders":0}}

# 4. Check health
curl http://localhost:5000/api/health

# Response should show:
# {"success":true,"status":"ok","timestamp":"..."}
```

---

**Setup Date**: May 31, 2026  
**Status**: ✅ Ready for production

