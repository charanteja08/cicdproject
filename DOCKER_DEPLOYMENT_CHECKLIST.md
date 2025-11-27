# 🐳 Docker Desktop Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. **Docker Files & Configuration**
- [x] `docker-compose.yml` exists and configured
- [x] `Backend/Dockerfile` - Multi-stage build (Maven → JRE 21)
- [x] `Frontend/Dockerfile` - Multi-stage build (Node → Nginx)
- [x] `Frontend/nginx.conf` - SPA routing configured
- [x] `otp-auth-backend/Dockerfile` - Node 20 Alpine
- [x] `.dockerignore` - Excludes build artifacts
- [x] `deploy/docker.env.example` - Environment template

### 2. **Database Setup**
- [x] `mysql-init/01-init.sql` - Database initialization script
- [x] MySQL 8.0 image configured in docker-compose
- [x] Health checks configured for MySQL
- [x] Volume persistence for MySQL data
- ⚠️ **ACTION REQUIRED**: Verify `category` column exists in `crop_listings` table

### 3. **Backend (Spring Boot)**
- [x] `Backend/pom.xml` - Maven dependencies configured
- [x] Java 21 compatibility verified
- [x] MySQL connector dependency present
- [x] Environment variables mapped in docker-compose
- [x] Upload directory volume mounted
- [x] Health check endpoint configured (Actuator)

### 4. **Frontend (React)**
- [x] `Frontend/package.json` - Build script present
- [x] Environment variables for API URLs
- [x] Nginx configuration for SPA routing
- [x] Build output served correctly

### 5. **OTP Service (Node.js)**
- [x] `otp-auth-backend/package.json` - Dependencies configured
- [x] ES modules (`"type": "module"`) configured
- [x] Environment variables for Gmail/Nodemailer
- [x] Port 5000 exposed

### 6. **Environment Variables**
- [x] `deploy/docker.env.example` template created
- ⚠️ **ACTION REQUIRED**: Copy to `.env` and fill in:
  - `MYSQL_ROOT_PASSWORD` - Strong password
  - `MYSQL_PASSWORD` - Database user password
  - `GMAIL_USER` - Your Gmail address
  - `GMAIL_APP_PASSWORD` - Gmail App Password (16 chars)
  - `JWT_SECRET` - Long random string
  - `REACT_APP_API_BASE_URL` - Backend API URL
  - `REACT_APP_ADMIN_OTP_API` - OTP service URL

### 7. **Network & Dependencies**
- [x] Services properly linked in docker-compose
- [x] Backend depends on MySQL (health check)
- [x] Frontend depends on Backend & OTP service
- [x] Port mappings configured:
  - MySQL: 3306
  - Backend: 8080
  - Frontend: 3000
  - OTP Service: 5000

### 8. **Volumes & Persistence**
- [x] `mysql_data` volume for database
- [x] `backend_uploads` volume for file uploads
- [x] Host uploads directory mounted

---

## 🚀 Deployment Steps

### Step 1: Environment Setup
```bash
# Copy environment template
cp deploy/docker.env.example .env

# Edit .env file with your actual values
# Required: GMAIL_USER, GMAIL_APP_PASSWORD, JWT_SECRET, MySQL passwords
```

### Step 2: Verify Docker Desktop
- [ ] Docker Desktop is running
- [ ] Docker Desktop has sufficient resources:
  - Minimum 4GB RAM allocated
  - 2 CPU cores minimum
  - 20GB disk space available

### Step 3: Build Images
```bash
# Build all services
docker compose build

# Or build specific service
docker compose build backend
docker compose build frontend
docker compose build otp-service
```

### Step 4: Start Services
```bash
# Start all services in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

### Step 5: Verify Services
- [ ] MySQL is healthy: `docker compose ps mysql`
- [ ] Backend responds: `curl http://localhost:8080/actuator/health`
- [ ] Frontend loads: Open `http://localhost:3000`
- [ ] OTP service responds: `curl http://localhost:5000/api/admin/otp/health` (if endpoint exists)

---

## 🔍 Post-Deployment Verification

### Database Connection
```bash
# Check MySQL logs
docker compose logs mysql

# Connect to MySQL (if needed)
docker compose exec mysql mysql -u agrizen -p agrigrow
```

### Backend Health
```bash
# Check backend logs
docker compose logs backend

# Test API endpoint
curl http://localhost:8080/api/admin/stats
```

### Frontend Access
- [ ] Open `http://localhost:3000` in browser
- [ ] Verify React app loads
- [ ] Check browser console for errors
- [ ] Test API connectivity from frontend

### OTP Service
```bash
# Check OTP service logs
docker compose logs otp-service

# Verify Gmail configuration
# (Check logs for "Gmail transporter ready")
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: MySQL Connection Refused
**Fix**: Wait for MySQL health check to pass before backend starts
- Check: `docker compose ps` - MySQL should show "healthy"
- Solution: Backend has `depends_on` with health check condition

### Issue 2: Frontend Can't Reach Backend
**Fix**: Update `REACT_APP_API_BASE_URL` in `.env`
- For Docker: Use `http://localhost:8080/api` (host network)
- For production: Use actual backend URL

### Issue 3: OTP Emails Not Sending
**Fix**: Verify Gmail App Password
- Check: `docker compose logs otp-service`
- Ensure: `GMAIL_APP_PASSWORD` is correct 16-character password
- Verify: 2-Step Verification enabled on Gmail account

### Issue 4: Build Failures
**Fix**: Check Docker build context
- Backend: Ensure `pom.xml` and `src/` are in `Backend/` directory
- Frontend: Ensure `package.json` and `src/` are in `Frontend/` directory
- OTP: Ensure `package.json` and `src/` are in `otp-auth-backend/` directory

### Issue 5: Port Already in Use
**Fix**: Change port mappings in `.env` or docker-compose.yml
```bash
# Example: Change frontend port to 3001
FRONTEND_PORT=3001
```

---

## 📋 Missing Database Column Fix

If `category` column is missing from `crop_listings` table:

```sql
-- Run this in MySQL container
ALTER TABLE crop_listings 
ADD COLUMN category VARCHAR(50) NULL 
AFTER image_url;
```

Or update `mysql-init/01-init.sql` to include:
```sql
CREATE TABLE IF NOT EXISTS crop_listings (
    ...
    image_url VARCHAR(500),
    category VARCHAR(50),  -- Add this line
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ...
);
```

---

## 🛑 Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# Stop specific service
docker compose stop backend
```

---

## 📊 Monitoring Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Check resource usage
docker stats

# Inspect service
docker compose exec backend sh
docker compose exec mysql mysql -u agrizen -p
```

---

## ✅ Final Checklist Before Production

- [ ] All environment variables set in `.env`
- [ ] Gmail App Password configured correctly
- [ ] JWT_SECRET is strong and random
- [ ] MySQL passwords are secure
- [ ] All services start without errors
- [ ] Frontend can communicate with backend
- [ ] OTP service can send emails
- [ ] Database schema includes `category` column
- [ ] File uploads directory is writable
- [ ] Health checks are passing
- [ ] No sensitive data in docker-compose.yml (use .env)

---

## 🎯 Quick Start Command

```bash
# One-command deployment (after .env is configured)
cp deploy/docker.env.example .env && \
# Edit .env with your values, then:
docker compose up -d --build
```

---

**Status**: ✅ Ready for Docker Desktop deployment
**Last Updated**: 2025-01-25

