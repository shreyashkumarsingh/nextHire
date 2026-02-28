# 🚀 QUICKSTART - Resume Screening System v2.0

## ⚡ START IN 30 SECONDS

### **Copy and paste this command:**

```powershell
& ".\venv\Scripts\Activate.ps1"; python app_production.py
```

Then open: **http://localhost:5000**

---

## 📋 SETUP CHECKLIST

✅ If you ran `.\setup.ps1`, everything is ready!

Otherwise, do this:

```powershell
# 1. Create virtual environment (first time only)
python -m venv venv

# 2. Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize database (first time only)
python init_db.py init

# 5. Run the app
python app_production.py
```

---

## 🎯 WHAT'S INCLUDED

### **NEW Production Features (v2.0):**
- ✅ Persistent database (users, resumes, skills, education, experience)
- ✅ Secure file uploads and storage
- ✅ User authentication with JWT
- ✅ API rate limiting (prevent abuse)
- ✅ Structured logging and error handling
- ✅ Pagination (handle 1000s of resumes)
- ✅ Production server configuration (Gunicorn)
- ✅ Docker containerization ready
- ✅ Backup and restore functionality

### **All Original Features Still Work:**
- Resume parsing (PDF, DOCX)
- Skill extraction
- Job description matching
- Beautiful dashboard

---

## 🧪 TEST IT

1. **Open browser:** http://localhost:5000
2. **Click "Upload Resume"**
3. **Select a PDF or DOCX file**
4. **View results**

---

## 🛠️ IF SOMETHING GOES WRONG

### **Error: `ModuleNotFoundError: flask_limiter`**

```powershell
# Make sure you activated the virtual environment:
& ".\venv\Scripts\Activate.ps1"

# Then reinstall:
pip install -r requirements.txt

# Try again:
python app_production.py
```

### **Error: `Port 5000 already in use`**

```powershell
# Kill the existing process:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Try a different port:
$env:FLASK_PORT=5001
python app_production.py
```

### **Error: `Database not found`**

```powershell
# Reinitialize database:
python init_db.py init

# Then run app:
python app_production.py
```

---

## 📂 PROJECT STRUCTURE

```
resume_screening_system/
├── app_production.py       ← Main app (USE THIS!)
├── models.py               ← Database models
├── config.py               ← Configuration
├── .env                    ← Environment variables
├── requirements.txt        ← Dependencies
├── venv/                   ← Virtual environment
├── instance/               ← Database (SQLite)
├── logs/                   ← Application logs
├── uploads/                ← Uploaded resumes
└── utils/                  ← Helper functions
```

---

## 📚 DOCUMENTATION

| Document | Purpose |
|----------|---------|
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | What was done & what's ready |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | All 10 features explained |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Cloud deployment (Docker, AWS, etc) |
| [PROJECT_BREAKDOWN.md](PROJECT_BREAKDOWN.md) | Technical deep dive |

---

## 💾 ENVIRONMENT SETUP (Optional)

Edit `.env` to customize:

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=sqlite:///instance/resumeai.db

# File uploads (max 10MB)
MAX_CONTENT_LENGTH=10485760

# Rate limiting
RATELIMIT_ENABLED=True
```

---

## 🔧 USEFUL COMMANDS

```powershell
# List installed packages
pip list

# Update all packages
pip install --upgrade -r requirements.txt

# Check Python version
python --version

# View application logs
Get-Content logs/app.log -Tail 50

# Reset database
python init_db.py drop
python init_db.py init
```

---

## ✨ YOU'RE DONE!

Everything is production-ready. Your system now has:

- 🗄️ **Real database** (not in-memory)
- 📁 **File storage** (permanent uploads)
- 🔐 **Authentication** (user accounts)
- ⚡ **Rate limiting** (prevent abuse)
- 📊 **Logging** (track everything)
- 📄 **Pagination** (scale to thousands)

Next steps:
1. Upload a resume → Test the system
2. Check logs → See what's happening
3. Edit `.env` → Customize settings
4. [Deploy](DEPLOYMENT_GUIDE.md) → Put it online

---

**Status: ✅ PRODUCTION READY** 🎉
