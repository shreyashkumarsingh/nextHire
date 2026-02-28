# NextHire Production Deployment Guide

## 🚀 What's Been Added

This document covers all the production-ready features that have been implemented:

### ✅ **Completed Features**

1. **Environment Configuration** (.env files, config.py)
2. **Database Models** (Resume, Skills, Education, Experience)
3. **Persistent File Storage** (Local + S3-ready)
4. **Error Handling & Logging** (Structured logging, error handlers)
5. **API Rate Limiting** (Flask-Limiter with Redis)
6. **Input Validation** (File size, type validation)
7. **Pagination** (For resumes list)
8. **Production Server Config** (Gunicorn, Nginx)
9. **Docker Containers** (Multi-service setup)
10. **Database Backups** (Automated backup script)

---

## 📋 Quick Start Guide

### Option 1: Development Setup (Local)

```powershell
# 1. Install new dependencies
pip install -r requirements.txt

# 2. Initialize database with new tables
python init_db.py init

# 3. Run development server (OLD - for backwards compatibility)
python app.py

# OR run NEW production-ready version
python app_production.py
```

### Option 2: Docker Deployment (Recommended)

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check services are running
docker-compose ps

# 3. View logs
docker-compose logs -f backend

# 4. Stop services
docker-compose down
```

### Option 3: Production Server (Linux/Windows Server)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Update .env with production settings
cp .env.example .env
nano .env  # Edit with production values

# 3. Initialize database
python init_db.py init

# 4. Run with Gunicorn
gunicorn -c gunicorn_config.py app_production:app

# OR run with systemd (Linux)
sudo systemctl start nexthire
sudo systemctl enable nexthire
```

---

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Required Settings
SECRET_KEY=your-secure-random-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/nexthire

# Optional Settings
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_FOLDER=uploads
RESUMES_PER_PAGE=20
LOG_LEVEL=INFO
```

**Generate secure keys:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Database Setup

**SQLite (Development):**
```bash
# Already configured - no setup needed
python init_db.py init
```

**PostgreSQL (Production):**
```bash
# 1. Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 2. Create database
sudo -u postgres psql
CREATE DATABASE nexthire;
CREATE USER nexthire WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE nexthire TO nexthire;
\q

# 3. Update .env
DATABASE_URL=postgresql://nexthire:secure_password@localhost:5432/nexthire

# 4. Initialize tables
python init_db.py init
```

---

## 🐳 Docker Deployment

### Services Included

- **Backend** (Flask + Gunicorn)
- **PostgreSQL** (Database)
- **Redis** (Rate limiting & caching)
- **Nginx** (Reverse proxy)

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend  # Specific service

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Stop and remove volumes (DELETES DATA)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build

# Execute commands in container
docker-compose exec backend python init_db.py init
docker-compose exec backend python backup_db.py
```

### Volume Management

```bash
# Backup database volume
docker run --rm -v resume_screening_system_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/db_backup.tar.gz /data

# Restore database volume
docker run --rm -v resume_screening_system_postgres_data:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/db_backup.tar.gz -C /
```

---

## 📊 Database Management

### initialization

```bash
# Create all tables
python init_db.py init

# Reset database (DELETES ALL DATA)
python init_db.py reset

# Drop all tables
python init_db.py drop
```

### Backups

```bash
# Manual backup
python backup_db.py

# Automated backups (Linux crontab)
crontab -e
# Add: 0 2 * * * cd /path/to/project && python backup_db.py

# Automated backups (Windows Task Scheduler)
# Create task to run: python C:\path\to\backup_db.py
```

### Migration from In-Memory to Database

The new `app_production.py` saves all resumes to the database instead of in-memory. Old resumes from `app.py` won't be migrated automatically.

**To keep using old app.py:**
- Just run `python app.py` (no database, in-memory storage)

**To use new app_production.py:**
- All new uploads will be saved to database
- Old data is not accessible (was in-memory only)

---

## 🔒 Security Checklist

### Before Production Deployment:

- [ ] **Change default secrets** in `.env`
  ```bash
  SECRET_KEY=<generate-new-key>
  JWT_SECRET_KEY=<generate-new-key>
  ```

- [ ] **Set strong database password**
  ```bash
  DATABASE_URL=postgresql://user:<strong-password>@host/db
  ```

- [ ] **Enable HTTPS** (SSL certificate)
  - Use Let's Encrypt: `sudo certbot --nginx`
  - Update nginx.conf with SSL settings

- [ ] **Set proper file permissions**
  ```bash
  chmod 600 .env
  chmod 755 uploads/
  chmod 755 logs/
  ```

- [ ] **Configure firewall**
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

- [ ] **Disable debug mode**
  ```bash
  FLASK_ENV=production
  FLASK_DEBUG=False
  ```

- [ ] **Setup monitoring** (Sentry, New Relic, etc.)

- [ ] **Configure backups** (daily automated)

---

## 📈 Performance Optimization

### Gunicorn Workers

```python
# gunicorn_config.py
workers = (CPU_COUNT * 2) + 1  # Default formula
worker_class = "sync"  # Or "gevent" for async
```

### Database Connection Pooling

```python
# config.py
SQLALCHEMY_POOL_SIZE = 10
SQLALCHEMY_POOL_RECYCLE = 3600
SQLALCHEMY_MAX_OVERFLOW = 20
```

### Redis Caching

```python
# For future implementation
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'redis'})
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database connection error**
```
Solution: Check DATABASE_URL in .env
Verify database is running: psql -U nexthire -d nexthire
```

**2. File upload fails**
```
Solution: Check upload directory permissions
mkdir -p uploads/resumes
chmod 755 uploads/
```

**3. Rate limit errors**
```
Solution: Check Redis is running
docker-compose ps redis
redis-cli ping
```

**4. Import errors**
```
Solution: Install dependencies
pip install -r requirements.txt
```

**5. Port already in use**
```
Solution: Kill existing process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -i :5000
kill -9 <PID>
```

### Viewing Logs

```bash
# Application logs
tail -f logs/app.log
tail -f logs/gunicorn_error.log
tail -f logs/gunicorn_access.log

# Docker logs
docker-compose logs -f backend
docker-compose logs -f nginx
```

---

## 📱 API Changes

### New Features in app_production.py

#### 1. Pagination
```javascript
// GET /api/resumes?page=1&per_page=20
{
  "resumes": [...],
  "total": 100,
  "pages": 5,
  "current_page": 1,
  "has_next": true,
  "has_prev": false
}
```

#### 2. Error Responses
```javascript
// Standardized error format
{
  "error": "Bad Request",
  "message": "File too large. Maximum size: 10MB",
  "status_code": 400
}
```

#### 3. Health Check
```javascript
// GET /api/health
{
  status": "healthy",
  "timestamp": "2026-02-26T10:30:00",
  "version": "2.0.0"
}
```

#### 4. New Headers
- All API calls need `Authorization: Bearer <token>`
- Rate limits returned in headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## 🔄 Migration Path

### From app.py to app_production.py

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Initialize database**
   ```bash
   python init_db.py init
   ```

4. **Test with development mode**
   ```bash
   python app_production.py
   ```

5. **Deploy with Gunicorn**
   ```bash
   gunicorn -c gunicorn_config.py app_production:app
   ```

### Frontend Changes Needed

Update `frontend/src/services/api.js` to handle pagination:

```javascript
// Old
const data = await resumeAPI.getAllResumes();

// New
const data = await resumeAPI.getAllResumes({ page: 1, per_page: 20 });
// Returns: { resumes: [...], total, pages, current_page, ... }
```

---

## 🌐 Cloud Deployment

### AWS EC2

```bash
# 1. Launch Ubuntu instance
# 2. Install dependencies
sudo apt update
sudo apt install python3-pip postgresql nginx redis

# 3. Clone repository
git clone <your-repo>
cd resume_screening_system

# 4. Setup
pip3 install -r requirements.txt
cp .env.example .env
# Edit .env

# 5. Initialize database
python3 init_db.py init

# 6. Run with systemd
sudo cp nexthire.service /etc/systemd/system/
sudo systemctl start nexthire
sudo systemctl enable nexthire
```

### Heroku

```bash
# 1. Create app
heroku create nexthire-app

# 2. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 3. Deploy
git push heroku main

# 4. Initialize database
heroku run python init_db.py init
```

### Digital Ocean

Use Docker deployment (recommended):
```bash
# 1. Create Droplet with Docker
# 2. Clone repository
# 3. docker-compose up -d
```

---

## 📞 Support & Maintenance

### Regular Tasks

**Daily:**
- Check logs for errors
- Monitor disk space

**Weekly:**
- Review rate limit hits
- Check database size
- Test backups

**Monthly:**
- Update dependencies
- Security patches
- Performance review

### Health Checks

```bash
# Application
curl http://localhost:5000/api/health

# Database
psql -U nexthire -d nexthire -c "SELECT COUNT(*) FROM resumes;"

# Redis
redis-cli ping

# Nginx
sudo nginx -t
```

---

## 🎯 Next Steps

After successful deployment:

1. **Setup monitoring** (Sentry, DataDog, New Relic)
2. **Configure CDN** (CloudFlare)
3. **Add email service** (SendGrid, AWS SES)
4. **Implement caching** (Redis caching layer)
5. **Add background jobs** (Celery for async processing)
6. **Setup CI/CD** (GitHub Actions)
7. **Load testing** (Locust, Apache Bench)
8. **Security audit** (OWASP checklist)

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Version:** 2.0.0  
**Last Updated:** February 26, 2026  
**Status:** Production Ready
