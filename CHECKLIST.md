# 🎯 NextHire - Getting Started Checklist

Use this checklist to get NextHire running on your machine!

## ✅ Pre-Installation Checklist

- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PowerShell available
- [ ] Internet connection available (for package downloads)

## 📦 Installation Checklist

### Backend Setup
- [ ] Navigate to project directory
- [ ] Virtual environment created (`python -m venv venv`)
- [ ] Virtual environment activated (`.\venv\Scripts\Activate.ps1`)
- [ ] Python packages installed (`pip install -r requirements.txt`)
- [ ] Verify Flask installed (`pip list | findstr Flask`)

### Frontend Setup
- [ ] Navigate to frontend folder (`cd frontend`)
- [ ] Node packages installed (`npm install`)
- [ ] node_modules folder exists
- [ ] Verify React installed (`npm list react`)

## 🚀 Launch Checklist

### Option 1: Quick Start
- [ ] Run `.\start.ps1` from project root
- [ ] Backend window opens
- [ ] Frontend window opens
- [ ] Browser opens automatically

### Option 2: Manual Start
- [ ] **Terminal 1**: Backend running (`python app.py`)
- [ ] Backend shows: "Running on http://127.0.0.1:5000"
- [ ] **Terminal 2**: Frontend running (`npm run dev`)
- [ ] Frontend shows: "Local: http://localhost:3000"
- [ ] Open browser to http://localhost:3000

## 🧪 Testing Checklist

### Landing Page
- [ ] Page loads without errors
- [ ] Hero section visible
- [ ] "NextHire" branding shows
- [ ] "Get Started" button works
- [ ] Smooth scroll to features works
- [ ] Responsive on mobile (resize browser)

### Dashboard
- [ ] Click "Get Started" navigates to dashboard
- [ ] Sidebar visible with logo
- [ ] Navbar visible with dark mode toggle
- [ ] Stats cards show data
- [ ] Empty table or mock data visible

### Upload Resume
- [ ] Click "Upload Resume" in sidebar
- [ ] Drag-drop area visible
- [ ] File selection works
- [ ] Upload button enabled after file selection
- [ ] Progress bar shows during upload
- [ ] Results display after parsing

### Analytics
- [ ] Click "Analytics" in sidebar
- [ ] Summary cards visible
- [ ] Bar chart renders
- [ ] Pie chart renders
- [ ] Charts are responsive

### Settings
- [ ] Click "Settings" in sidebar
- [ ] Form fields editable
- [ ] Toggle switches work
- [ ] "Save Changes" button visible

### Dark Mode
- [ ] Click moon icon in navbar
- [ ] Theme switches to dark
- [ ] All pages update
- [ ] Click sun icon to return to light
- [ ] All components properly styled

### Responsive Design
- [ ] Works at 1920px (desktop)
- [ ] Works at 1024px (laptop)
- [ ] Works at 768px (tablet)
- [ ] Works at 375px (mobile)

## 🔧 Troubleshooting Checklist

If something doesn't work:

- [ ] Check both servers are running
- [ ] Verify no port conflicts (5000, 3000)
- [ ] Open browser console (F12) - check for errors
- [ ] Verify virtual environment is activated
- [ ] Clear browser cache (Ctrl + Shift + Delete)
- [ ] Restart both servers
- [ ] Check network tab for failed API calls

## 📝 First-Time Setup Tasks

After installation:

- [ ] Upload a test resume (create a dummy .txt file)
- [ ] Explore all pages
- [ ] Test search functionality
- [ ] Test filter and sort
- [ ] Test dark mode toggle
- [ ] View resume details in modal
- [ ] Try deleting a resume
- [ ] Check analytics charts

## 🎨 Customization Checklist

Want to customize? Check these:

- [ ] Change primary color (tailwind.config.js)
- [ ] Update logo (Sidebar.jsx, LandingPage.jsx)
- [ ] Modify landing page text (LandingPage.jsx)
- [ ] Add more features to sidebar (Sidebar.jsx)
- [ ] Change app name from "NextHire" (multiple files)

## 🚀 Deployment Checklist

Ready for production?

- [ ] Build frontend (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Replace mock data with real API calls
- [ ] Add environment variables
- [ ] Set up user authentication
- [ ] Configure CORS for production domain
- [ ] Set up cloud storage for resumes
- [ ] Deploy backend (Heroku/AWS)
- [ ] Deploy frontend (Vercel/Netlify)

## 📚 Documentation Checklist

Files to read:

- [ ] README.md (main documentation)
- [ ] QUICKSTART.md (quick start guide)
- [ ] INSTALLATION.md (detailed setup)
- [ ] DEVELOPMENT.md (developer guide)
- [ ] PROJECT_SUMMARY.md (overview)
- [ ] frontend/README.md (frontend docs)

## ✨ Features to Explore

- [ ] Landing page hero section
- [ ] Drag-and-drop file upload
- [ ] Resume parsing results
- [ ] Dashboard table with search
- [ ] Filter by score
- [ ] Sort by different fields
- [ ] View resume details modal
- [ ] Delete with confirmation
- [ ] Analytics charts
- [ ] Dark mode toggle
- [ ] Responsive on mobile
- [ ] Smooth animations

## 🎯 Next Steps

After exploring:

- [ ] Read codebase to understand structure
- [ ] Modify a component to see hot reload
- [ ] Add a new feature
- [ ] Integrate real AI/NLP
- [ ] Connect to database
- [ ] Add authentication
- [ ] Deploy to production

## ✅ Completion

When all checkboxes are complete, you have:
- ✅ Fully installed NextHire
- ✅ Tested all features
- ✅ Ready to customize or deploy

## 🎉 Success Criteria

You know it's working when:
1. ✅ Landing page loads beautifully
2. ✅ Can navigate all pages via sidebar
3. ✅ Can upload a file (even if mock data returns)
4. ✅ Charts render in Analytics
5. ✅ Dark mode works smoothly
6. ✅ No console errors
7. ✅ Responsive on all screen sizes

---

**Congratulations! You're ready to use NextHire! 🎊**

For help, refer to:
- INSTALLATION.md for setup issues
- DEVELOPMENT.md for code questions
- README.md for feature documentation
