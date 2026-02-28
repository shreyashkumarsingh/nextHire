# 📋 Complete Installation Guide for NextHire

This document provides step-by-step instructions to set up NextHire from scratch.

## 📌 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PowerShell** (Windows - pre-installed)

### Verify Installation
Open PowerShell and run:

```powershell
# Check Python version
python --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

Expected output:
```
Python 3.8.x or higher
Node.js v16.x.x or higher
npm 8.x.x or higher
```

## 🚀 Installation Steps

### Step 1: Navigate to Project Directory

```powershell
cd C:\Users\KIIT0001\Desktop\resume_screening_system
```

### Step 2: Set Up Python Virtual Environment

```powershell
# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

**Troubleshooting**: If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Python Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- Flask-CORS (cross-origin support)
- PyPDF2 (PDF parsing)
- python-docx (DOCX parsing)

### Step 4: Set Up Frontend

```powershell
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

This will install all React, Tailwind, and other dependencies.

### Step 5: Verify Installation

Check that all packages are installed:

**Python packages:**
```powershell
pip list
```

Look for:
- Flask
- flask-cors
- PyPDF2
- python-docx

**Node packages:**
```powershell
npm list --depth=0
```

Look for:
- react
- tailwindcss
- vite
- recharts
- axios

## ▶️ Running the Application

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```powershell
# From project root
.\venv\Scripts\Activate.ps1
python app.py
```

Output should show:
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

**Terminal 2 - Frontend:**
```powershell
# From project root
cd frontend
npm run dev
```

Output should show:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Option 2: Automated Start (Quick Launch)

```powershell
# From project root
.\start.ps1
```

This script:
1. Checks dependencies
2. Starts backend server
3. Starts frontend server
4. Opens browser automatically

## 🌐 Access the Application

Once both servers are running:

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000

The browser should open automatically to the landing page.

## ✅ Testing the Installation

### 1. Landing Page
- You should see a beautiful blue gradient page
- "NextHire – AI-Powered Resume Screening" headline
- "Get Started" button

### 2. Dashboard
- Click "Get Started"
- You should see the sidebar and navbar
- Mock data in stats cards

### 3. Upload Resume
- Click "Upload Resume" in sidebar
- Drag and drop area should be visible
- Try uploading a test file

### 4. Dark Mode
- Click the moon icon in navbar
- Theme should switch to dark

## 🔧 Configuration

### Backend Configuration (app.py)

Default settings:
```python
debug=True
port=5000
```

To change port:
```python
app.run(debug=True, port=8000)  # Change to 8000
```

### Frontend Configuration (vite.config.js)

Proxy settings point to backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
  }
}
```

If you change backend port, update this.

### Tailwind Configuration

Colors, fonts, and animations are in:
`frontend/tailwind.config.js`

## 📦 Package Versions

### Python Packages
- Flask==3.0.2
- flask-cors==4.0.0
- PyPDF2==3.0.1
- python-docx==1.1.0

### Node Packages
- react@^18.2.0
- react-dom@^18.2.0
- vite@^5.0.8
- tailwindcss@^3.3.6
- recharts@^2.10.3
- axios@^1.6.2

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error**: `Address already in use: 5000` or `3000`

**Solution**:
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue 2: Virtual Environment Not Activating

**Error**: Script execution disabled

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Module Not Found

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```powershell
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 4: npm Install Fails

**Error**: npm errors during installation

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue 5: CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution**:
- Ensure Flask-CORS is installed: `pip install flask-cors`
- Check CORS is enabled in app.py: `CORS(app)`
- Restart backend server

### Issue 6: Blank Page in Browser

**Possible causes**:
1. Backend not running
2. Frontend not properly built
3. Port conflicts

**Solution**:
```powershell
# Check both servers are running
# Backend should show: Running on http://127.0.0.1:5000
# Frontend should show: Local: http://localhost:3000

# Check browser console (F12) for errors
```

## 🔄 Updating Dependencies

### Update Python Packages
```powershell
pip install --upgrade -r requirements.txt
```

### Update Node Packages
```powershell
cd frontend
npm update
```

## 🗑️ Uninstallation

To remove the project:

```powershell
# Deactivate virtual environment
deactivate

# Delete project folder
rm -r C:\Users\KIIT0001\Desktop\resume_screening_system
```

## 📞 Getting Help

If you encounter issues:

1. **Check the console** - Look for error messages
2. **Read error messages** - They usually point to the problem
3. **Check file paths** - Ensure you're in the correct directory
4. **Verify installations** - Run version checks again
5. **Restart servers** - Sometimes a fresh start helps

## ✨ Next Steps

After successful installation:

1. **Upload a Test Resume** - Try the upload functionality
2. **Explore the Dashboard** - See all features
3. **Check Analytics** - View the charts
4. **Toggle Dark Mode** - Test the theme switching
5. **Read DEVELOPMENT.md** - Learn about the codebase

## 📝 Checklist

Use this checklist to ensure everything is set up:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created
- [ ] Virtual environment activated
- [ ] Python dependencies installed
- [ ] Node dependencies installed
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Landing page loads correctly
- [ ] Can navigate to dashboard
- [ ] Dark mode toggle works

## 🎉 Success!

If all checklist items are complete, you're ready to use NextHire!

---

**Installation Support**: Check QUICKSTART.md for rapid setup
**Development Guide**: See DEVELOPMENT.md for technical details
**Main Documentation**: Read README.md for full features
