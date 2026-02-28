# 🚀 FINAL DEPLOYMENT GUIDE - NextHire v2.0.0

**Updated**: February 28, 2026  
**Status**: Production Ready ✅  
**Security Review**: PASSED ✅

---

## Quick Start: Deploy to Production in 5 Steps

### Step 1: Validate Configuration (2 min)
```bash
python check_config.py
```
Must pass before deployment!

### Step 2: Set Production Environment Variables
Create or update `.env.production`:
```bash
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=<run: python -c "import secrets; print(secrets.token_urlsafe(32))">
JWT_SECRET_KEY=<run: python -c "import secrets; print(secrets.token_urlsafe(32))">
DATABASE_URL=postgresql://user:password@db_host:5432/nexthire
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATELIMIT_STORAGE_URL=redis://redis:6379/1
LOG_LEVEL=INFO
```

### Step 3: Frontend Environment
Create `frontend/.env.production`:
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=NextHire
VITE_LOG_LEVEL=error
```

### Step 4: Build & Test Locally
```bash
# Backend test
python app_production.py

# Frontend build
cd frontend
npm run build
cd ..

# Verify no errors in either
```

### Step 5: Deploy with Docker
```bash
# Update docker-compose.yml with production secrets
docker-compose -f docker-compose.yml up -d

# Initialize database
docker-compose exec backend python init_db.py init

# Verify health
curl https://your-domain.com/api/health
```

---

## Security Improvements Made ✅

### 1. **Fixed Hardcoded URLs**
- ✅ Fixed: Signup.jsx hardcoded localhost URL
- ✅ Now uses centralized API client
- Impact: Production deployment will work on any domain

### 2. **Restricted CORS Origins**
- ✅ Updated: CORS now uses environment variable `CORS_ORIGINS`
- ✅ Restricted to specific domains only (security)
- Impact: Prevents CSRF attacks from arbitrary origins

### 3. **Added Security Headers**
- ✅ X-Frame-Options: SAMEORIGIN (clickjacking protection)
- ✅ X-Content-Type-Options: nosniff (MIME sniffing protection)
- ✅ X-XSS-Protection: 1; mode=block (XSS filter)
- ✅ Strict-Transport-Security: HSTS in production (HTTPS enforcement)
- ✅ Content-Security-Policy: Restricts script sources
- Impact: Protects against multiple web attack vectors

### 4. **Secure Session Cookies**
- ✅ SESSION_COOKIE_SECURE: Auto-enabled in production
- ✅ SESSION_COOKIE_HTTPONLY: Always enabled
- ✅ SESSION_COOKIE_SAMESITE: Lax (CSRF protection)
- Impact: Cookies only transmitted over HTTPS in production

### 5. **Environment Validation**
- ✅ Created: check_config.py script
- ✅ Validates all required environment variables
- ✅ Prevents deployment with placeholder values
- Impact: Catches configuration errors before deployment

---

## Deployment Checklist

### Before Deployment
- [ ] Run `python check_config.py` and verify all checks pass
- [ ] Generate new SECRET_KEY and JWT_SECRET_KEY
- [ ] Set production DATABASE_URL (PostgreSQL)
- [ ] Configure Redis for rate limiting
- [ ] Set CORS_ORIGINS to your domain(s)
- [ ] Update frontend .env.production with API URL
- [ ] Run frontend build: `npm run build`
- [ ] Test signup/login flow locally: `python app.py`
- [ ] Check for console errors in browser dev tools

### Deployment Options

#### Option A: Docker (Recommended for Most)
```bash
# Build image
docker build -t nexthire:latest .

# Push to registry (DockerHub)
docker login
docker tag nexthire:latest yourusername/nexthire:latest
docker push yourusername/nexthire:latest

# Deploy on server
docker-compose up -d

# Verify
docker-compose logs backend
curl http://localhost/api/health
```

#### Option B: VPS (DigitalOcean / Linode / AWS EC2)
```bash
# On server
git clone <your-repo>
cd NextHire

# Setup
cp .env.example .env.production
nano .env.production  # Edit with production values
python check_config.py  # Validate

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Start with Gunicorn
gunicorn -c gunicorn_config.py app_production:app --bind 0.0.0.0:5000 --daemon

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Option C: Heroku / Railway / Render
```bash
# These platforms auto-detect Flask apps and build them
# Just set environment variables in dashboard:
# - FLASK_ENV=production
# - SECRET_KEY=<new-value>
# - DATABASE_URL=<postgres-url>
# - JWT_SECRET_KEY=<new-value>
# - CORS_ORIGINS=<your-domain>

# Deploy
git push heroku main
```

---

## Production Architecture

### Recommended Setup
```
┌─────────────────────────────────────────────────────────┐
│                    CloudFlare DNS                        │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                  HTTPS / SSL Cert                        │
│               (Let's Encrypt via Certbot)                │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│                     Nginx                                │
│              (Reverse Proxy + Load Balancer)             │
└────┬────────────────────────┬───────────────────────┬───┘
     │                        │                       │
┌────┴──────┐    ┌───────────┴────┐    ┌──────────────┴──┐
│  Backend   │    │   PostgreSQL   │    │      Redis      │
│ (Gunicorn) │    │    (Database)  │    │   (Rate Limit)  │
│ x3 instances   │   (Managed)     │    │   (Managed)     │
└─────┬──────┘    └────────────────┘    └─────────────────┘
      │
      └─ Uploads to S3 (optional)
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)
```bash
# On server
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Using Nginx Config
The `nginx.conf` includes HTTPS block (commented out):
```nginx
# Uncomment the HTTPS server block
# Update server_name with your domain
# Add valid SSL certificate paths
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# Endpoint response
curl https://yourdomain.com/api/health
# Response: {"status": "healthy", "version": "2.0.0"}

# Database check
curl https://yourdomain.com/api/db-health
```

### Logging
- Backend logs: `/app/logs/app.log` (in Docker)
- Nginx logs: `/var/log/nginx/access.log`
- View logs: `docker-compose logs -f backend`

### Error Tracking
Set up one of these for production error monitoring:
- **Sentry** (free tier available)
- **Rollbar**
- **Bugsnag**
- **LogRocket**

### Performance Monitoring
- **New Relic APM**
- **DataDog**
- **Elastic APM**
- **Prometheus + Grafana**

---

## Database Management

### Backup Strategy
```bash
# Daily backup
docker-compose exec db pg_dump -U nexthire nexthire > backup-$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -T db psql -U nexthire nexthire < backup-20260228.sql

# Or use automated backups
python backup_db.py
```

### Migration (if needed)
```bash
# Copy database to new PostgreSQL instance
docker-compose exec db pg_dump -U nexthire nexthire | \
  PGPASSWORD=password psql -h new-host -U nexthire nexthire
```

---

## Troubleshooting

### Issue: Signup fails with "Cannot connect to backend"
**Solution**: Check that VITE_API_URL in frontend .env.production is correct

### Issue: CORS error in browser console
**Solution**: Ensure CORS_ORIGINS includes your frontend domain with https://

### Issue: "Database connection refused"
**Solution**: 
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Verify credentials

### Issue: Rate limiting not working
**Solution**: 
- Ensure Redis is running
- Check RATELIMIT_STORAGE_URL is correct
- Verify Flask-Limiter is enabled

### Issue: SSL certificate errors
**Solution**:
- Verify certificate path in nginx.conf
- Run `certbot renew` to refresh
- Check certificate hasn't expired with `openssl s_client -connect domain:443`

---

## First 24 Hours Checklist

After going live:
- [ ] Monitor error logs for unexpected failures
- [ ] Test signup/login from different networks
- [ ] Test resume upload with real PDF
- [ ] Verify analytics dashboard works
- [ ] Check email notifications (if enabled)
- [ ] Monitor server resource usage (CPU, RAM, disk)
- [ ] Verify SSL certificate is valid
- [ ] Test on mobile devices
- [ ] Check from different browsers (Chrome, Firefox, Safari)
- [ ] Monitor uptime (StatusPage.io)

---

## Support & Escalation

### Common Issues
1. **High CPU usage**: Scale backend (add more Gunicorn workers)
2. **Database slow**: Add PostgreSQL indexes, enable query caching in Redis
3. **File uploads failing**: Check upload folder permissions, disk space
4. **Rate limiting too aggressive**: Adjust RATELIMIT_DEFAULT if needed

### Performance Optimization (Optional)
- Enable frontend caching with CloudFlare
- Enable database query result caching with Redis
- Optimize PDF parsing with GPU acceleration (advanced)
- Use CDN for static assets (CloudFlare, AWS CloudFront)

---

## Rollback Plan

If production breaks:
```bash
# Stop current deployment
docker-compose down

# Rollback to previous image
docker-compose up -d nexthire:previous

# Restore database from backup
docker-compose exec -T db psql -U nexthire nexthire < backup-latest.sql

# Verify
curl https://yourdomain.com/api/health
```

---

## Success Metrics

Your deployment is successful when:
- ✅ /api/health returns 200 status
- ✅ Signup creates accounts successfully
- ✅ Resume upload works with PDF files
- ✅ Dashboard shows uploaded resumes
- ✅ Rate limiting is working
- ✅ HTTPS/SSL certificate is valid
- ✅ Frontend loads without CORS errors
- ✅ No errors in backend logs

---

## Contact & Support

- **Report Issues**: Create an issue in your repository
- **Security Issues**: Do not post publicly, email security@yourdomain.com
- **Performance Issues**: Check monitoring dashboard first, then contact your DevOps team
- **Database Issues**: Contact your database provider's support

---

**🎉 Congratulations on your production deployment! Now go help people find the right jobs! 🚀**
