# NextHire - AI-Powered Resume Screening System

A modern, professional full-stack web application for AI-powered resume parsing and candidate screening with a beautiful SaaS-style interface.

![NextHire](https://img.shields.io/badge/NextHire-AI%20Resume%20Parser-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38bdf8)
![Flask](https://img.shields.io/badge/Flask-3.0-000000)

## ✨ Features

### Frontend Features
- 🎨 **Modern Landing Page** - Beautiful hero section with smooth animations
- 📤 **Drag & Drop Upload** - Intuitive file upload with progress tracking
- 📊 **Interactive Dashboard** - Comprehensive table view with search, filter, and sort
- 📈 **Analytics Dashboard** - Visual insights with pie charts and bar graphs
- 🎯 **Resume Results** - Beautifully designed cards showing parsed data
- 🌙 **Dark Mode** - Seamless light/dark theme toggle
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **Fast & Smooth** - Built with Vite for lightning-fast performance

### Backend Features
- 🤖 **AI-Powered Parsing** - Intelligent extraction of resume data
- 🔍 **Skill Matching** - Match candidate skills against job requirements
- 💾 **RESTful API** - Clean API endpoints for frontend integration
- 🔐 **CORS Enabled** - Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling
- **React Router** - Client-side routing
- **Recharts** - Composable charting library
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon set
- **React Dropzone** - File upload component

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin support
- **PyPDF2** - PDF parsing
- **python-docx** - DOCX parsing

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PowerShell (Windows)

### Step 1: Clone the Repository
```powershell
git clone <repository-url>
cd resume_screening_system
```

### Step 2: Backend Setup

1. Create and activate virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Install Python dependencies:
```powershell
pip install -r requirements.txt
```

3. Run the Flask server:
```powershell
python app.py
```

Backend will run on **http://localhost:5000**

### Step 3: Frontend Setup

1. Navigate to frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start development server:
```powershell
npm run dev
```

Frontend will run on **http://localhost:3000**

### Step 4: Access the Application

Open your browser and visit **http://localhost:3000**

## 🎯 Usage Guide

### 1. Landing Page
- Visit the homepage to see the beautiful landing page
- Click "Get Started" to access the application

### 2. Upload Resume
- Navigate to "Upload Resume" from the sidebar
- Drag and drop a PDF, DOCX, or TXT file
- Click "Extract Data" to parse the resume
- View beautifully formatted results

### 3. Dashboard
- See all parsed resumes in a table
- Use the search bar to find specific candidates
- Filter by score (High, Medium, Low)
- Sort by date, score, or match percentage
- Click the eye icon to view full details
- Delete resumes with the trash icon

### 4. Analytics
- View summary cards (Total Resumes, Average Score, etc.)
- Analyze resume scores with bar charts
- See skills distribution with pie charts
- Track top skills with progress bars

### 5. Settings
- Update profile information
- Configure notifications
- Manage data retention
- Security settings

### 6. Dark Mode
- Toggle dark mode using the moon/sun icon in the navbar
- Theme persists across the application

## 📁 Project Structure

```
resume_screening_system/
│
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx    # Main layout wrapper
│   │   │   │   ├── Navbar.jsx    # Top navigation bar
│   │   │   │   └── Sidebar.jsx   # Side navigation menu
│   │   │   └── Resume/
│   │   │       ├── ResumeResults.jsx  # Results display
│   │   │       └── ResumeModal.jsx    # Details modal
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Landing page
│   │   │   ├── Dashboard.jsx     # Admin dashboard
│   │   │   ├── UploadResume.jsx  # Upload interface
│   │   │   ├── Analytics.jsx     # Analytics page
│   │   │   └── Settings.jsx      # Settings page
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── utils/                         # Python utilities
│   ├── __init__.py
│   ├── parser.py                 # Resume parser
│   ├── cleaner.py                # Text cleaner
│   ├── skill_extractor.py        # Skill extraction
│   └── matcher.py                # Skill matcher
│
├── templates/                     # Flask templates (legacy)
│   ├── index.html
│   └── results.html
│
├── static/                        # Static files
│   └── style.css
│
├── uploads/                       # Uploaded files
├── data/                          # Data files
│   └── skills_list.json
│
├── app.py                         # Flask application
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue/Indigo (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Purple (#8b5cf6)

### Typography
- **Font Family**: System fonts (SF Pro, Segoe UI, etc.)
- **Headings**: Bold, 2xl-7xl
- **Body**: Regular, base

### Components
- **Buttons**: Rounded 2xl, shadow-lg
- **Cards**: Rounded 2xl, shadow-md
- **Inputs**: Rounded xl, border

### Spacing
- Consistent padding: 4, 6, 8 units
- Card padding: p-6
- Section margins: mb-6, mb-8

## 🔌 API Endpoints

### POST /api/upload
Upload and parse a resume file
- **Body**: multipart/form-data with 'resume' file
- **Response**: Parsed resume data with skills, score, match percentage

### GET /api/resumes
Get all parsed resumes
- **Response**: Array of resume objects

### GET /api/resumes/:id
Get specific resume by ID
- **Response**: Single resume object

### DELETE /api/resumes/:id
Delete resume by ID
- **Response**: Success message

### GET /api/analytics
Get analytics data
- **Response**: Analytics summary with stats

## 🚀 Build for Production

### Frontend
```powershell
cd frontend
npm run build
```

### Backend
Configure Flask for production deployment (Gunicorn, etc.)

## 🔧 Configuration

### Vite Proxy Configuration
The frontend proxies API requests to the backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

### CORS Configuration
Flask backend allows cross-origin requests from the React frontend.

## 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License
MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Author
NextHire Development Team

## 🙏 Acknowledgments
- Lucide for beautiful icons
- Recharts for amazing charts
- Tailwind CSS for the design system
- React team for the amazing framework

---

**Built with ❤️ using React, Tailwind CSS, and Flask**

For questions or support, please open an issue on GitHub.
