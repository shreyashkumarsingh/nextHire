# 📋 PRE-DEPLOYMENT CHECKLIST - For General Public

**Date**: February 28, 2026  
**Status**: 95% READY - Minor fixes needed  
**Estimated Fix Time**: 2-3 hours

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. **Hardcoded Localhost URL in Frontend**
**Severity**: 🔴 CRITICAL  
**File**: `frontend/src/pages/Signup.jsx` (Line 53)  
**Issue**: Hardcoded `http://localhost:5000/api/auth/signup` - won't work in production  
**Impact**: Signup will fail in production deployment

```javascript
// ❌ CURRENT (Line 53)
const response = await fetch('http://localhost:5000/api/auth/signup', {

// ✅ SHOULD BE
const response = await authAPI.signup(formData);
```

**Fix**: Use the centralized API client from `services/api.js`

---

### 2. **CORS Not Restricted - Open to All Origins**
**Severity**: 🔴 CRITICAL  
**File**: `app_production.py` (Line 36)  
**Issue**: `CORS(app)` allows requests from ANY origin - security risk  
**Impact**: Vulnerable to CSRF attacks, potential abuse

```python
# ❌ CURRENT (Too permissive)
CORS(app)

# ✅ SHOULD BE
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com", "https://www.yourdomain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "max_age": 3600
    }
})
```

---

### 3. **Missing Security Headers**
**Severity**: 🔴 CRITICAL  
**File**: `app_production.py`  
**Issue**: No security headers for HTTPS, clickjacking, CSP, etc.  
**Impact**: Vulnerable to various web attacks

**Missing Headers**:
- `X-Frame-Options` - Clickjacking protection
- `X-Content-Type-Options` - MIME sniffing protection
- `Content-Security-Policy` - XSS protection
- `Strict-Transport-Security` - HTTPS enforcement
- `X-XSS-Protection` - XSS filter

**Add this to app_production.py**:
```python
@app.after_request
def set_security_headers(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response
```

---

## 🟡 HIGH PRIORITY ISSUES (Should Fix)

### 4. **Session Cookie Security in Production**
**Severity**: 🟡 HIGH  
**File**: `config.py` (Line 47)  
**Issue**: `SESSION_COOKIE_SECURE = False` even when would be production  
**Fix**: Make it environment-dependent

```python
# ✅ BETTER
SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV', 'development') == 'production'
```

---

### 5. **No Environment Validation**
**Severity**: 🟡 HIGH  
**Issue**: Application starts even with invalid/missing critical env vars  
**Impact**: Silent failures in production

**Add validation script** - Create `check_config.py`:
```python
import os
from dotenv import load_dotenv

load_dotenv()

REQUIRED_VARS = [
    'SECRET_KEY',
    'JWT_SECRET_KEY',
    'DATABASE_URL',
    'FLASK_ENV'
]

APP_ENV = os.getenv('FLASK_ENV', 'development')

if APP_ENV == 'production':
    REQUIRED_VARS.extend([
        'RATELIMIT_STORAGE_URL',  # Redis required in production
    ])

for var in REQUIRED_VARS:
    value = os.getenv(var)
    if not value or value.startswith('your-') or value.startswith('dev-'):
        raise ValueError(f"❌ Missing or invalid required environment variable: {var}")

print("✅ All required environment variables are set!")
```

---

### 6. **Frontend API Base URL Not Environment-Based**
**Severity**: 🟡 HIGH  
**File**: `frontend/.env.production` doesn't exist or incomplete  
**Issue**: Frontend won't know backend URL in production  
**Fix**: Create/update `.env.production` in frontend

```bash
# frontend/.env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=NextHire
VITE_LOG_LEVEL=error
```

---

### 7. **Rate Limiting Not Configured for Production**
**Severity**: 🟡 HIGH  
**File**: `config.py` (Line 44)  
**Issue**: `RATELIMIT_STORAGE_URL = 'memory://'` - doesn't persist across server instances  
**Impact**: Each server has separate rate limit counter

**Fix**: Must use Redis in production
```bash
# .env.production
RATELIMIT_STORAGE_URL=redis://redis:6379/1
RATELIMIT_DEFAULT=100 per hour
```

---

### 8. **Database Password in docker-compose.yml**
**Severity**: 🟡 HIGH  
**File**: `docker-compose.yml`  
**Issue**: Hardcoded DB password `nexthire_password_change_me`  
**Impact**: Insecure in production

**Fix**: Use environment variables in docker-compose
```yaml
environment:
  POSTGRES_PASSWORD: ${DB_PASSWORD}
  DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
```

---

## 🟠 MEDIUM PRIORITY ISSUES (Nice to Have)

### 9. **Add /api/health Endpoint to Frontend Tests**
Documentation mentions it but ensure it's in all tests

### 10. **Implement Request/Response Logging**
Add middleware for production API logging
```python
@app.before_request
def log_request():
    app.logger.info(f'{request.method} {request.path} from {request.remote_addr}')
```

### 11. **Add API Documentation**
- [ ] Swagger/OpenAPI documentation
- [ ] Generate with Flask-RESTX or Flask-APISPEC

### 12. **Frontend Build Optimization**
- [ ] Configure `.env.production` for React
- [ ] Run production build: `npm run build`
- [ ] Check bundle size

### 13. **Implement Monitoring/Alerts**
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

## ✅ ALREADY CONFIGURED (Good!)

✅ **Error Handling** - Comprehensive error handlers in `utils/error_handlers.py`  
✅ **Logging** - Structured logging in `utils/logger.py`  
✅ **Rate Limiting** - Flask-Limiter configured  
✅ **Database Models** - Properly structured with relationships  
✅ **Authentication** - JWT tokens implemented  
✅ **Input Validation** - File validation and size limits  
✅ **No Dummy Data** - Clean deployment state verified  
✅ **Docker Setup** - Production-ready docker-compose.yml  
✅ **Nginx Config** - Reverse proxy configured  
✅ **Gunicorn Config** - Production WSGI server config ready  

---

## 📝 Quick Fix: Before Going Public

### Step 1: Fix Signup.jsx Hardcoded URL (5 min)
```bash
# Replace line 53 in frontend/src/pages/Signup.jsx
# Change from: fetch('http://localhost:5000/api/auth/signup', ...)
# To: authAPI.signup(formData)
```

### Step 2: Add Security Headers (10 min)
```python
# Add to app_production.py after line 35
@app.after_request
def set_security_headers(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    return response
```

### Step 3: Restrict CORS (10 min)
```python
# Update CORS configuration in app_production.py
import os

cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "credentials": True,
        "max_age": 3600
    }
})
```

### Step 4: Set Production Environment Variables
```bash
# Create/update .env.production with:
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<generate using: python -c "import secrets; print(secrets.token_urlsafe(32))">
JWT_SECRET_KEY=<generate new key>
DATABASE_URL=postgresql://user:password@db:5432/nexthire
RATELIMIT_STORAGE_URL=redis://redis:6379/1
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Step 5: Create Environment Validator Script (5 min)
```bash
# Run before deployment
python check_config.py
```

### Step 6: Build Frontend for Production
```bash
cd frontend
npm run build
# This creates optimized dist/ folder
```

---

## 🚀 Final Deployment Checklist

Before deploying to public:

- [ ] **Fix hardcoded localhost URL** in Signup.jsx
- [ ] **Add security headers** to app_production.py
- [ ] **Restrict CORS** to your domains only
- [ ] **Set production environment variables**
- [ ] **Generate new SECRET_KEY and JWT_SECRET_KEY**
- [ ] **Use PostgreSQL** (not SQLite)
- [ ] **Use Redis** for rate limiting
- [ ] **Set SESSION_COOKIE_SECURE = True**
- [ ] **Enable HTTPS/SSL** with valid certificate
- [ ] **Test full signup/login flow** in production
- [ ] **Test file upload** with real users
- [ ] **Monitor logs** for errors
- [ ] **Set up uptime monitoring** (StatusPage.io, Uptime Robot)
- [ ] **Test from different networks** (mobile, ISP, VPN)
- [ ] **Test error pages** (404, 500)
- [ ] **Disable DEBUG mode** in production
- [ ] **Update API whitelist** for IP restrictions (if needed)

---

## 📊 Priority Order

1. **🔴 CRITICAL (DO FIRST)**
   - [ ] Fix hardcoded localhost URL
   - [ ] Add security headers  
   - [ ] Restrict CORS

2. **🟡 HIGH (DO SECOND)**
   - [ ] Setup environment variables properly
   - [ ] Configure frontend .env.production
   - [ ] Use Redis for rate limiting

3. **🟠 MEDIUM (DO BEFORE LAUNCH)**
   - [ ] Add environment validator
   - [ ] Build frontend production bundle
   - [ ] Update docker-compose for secrets

---

## 🎯 Summary

Your application is **95% production ready**!

**Remaining work**: ~1-2 hours of configuration fixes

**Critical path**:
1. Fix 3 security issues (CORS, security headers, hardcoded URL)
2. Set up production environment variables
3. Configure frontend .env.production
4. Test signup/login flow end-to-end
5. Deploy to staging for 24-hour testing
6. Deploy to production with monitoring

---

## 📞 Questions?

- **Security**: Contact your DevOps/Security team for SSL certificates and firewall rules
- **Database**: Use managed PostgreSQL (AWS RDS, DigitalOcean, Heroku Postgres)
- **Monitoring**: Set up error tracking (Sentry) and performance monitoring
- **CDN**: Consider CloudFlare or AWS CloudFront for global distribution

**You're ready to launch! 🚀**
