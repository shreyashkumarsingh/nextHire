# NextHire - AI-Powered Resume Screening

A modern, professional web application for AI-powered resume parsing and candidate screening.

## 🚀 Features

- **Landing Page**: Beautiful hero section with smooth scrolling
- **Resume Upload**: Drag-and-drop file upload with progress tracking
- **Smart Parsing**: AI-powered extraction of candidate information
- **Dashboard**: Comprehensive view of all parsed resumes with search and filter
- **Analytics**: Visual insights with charts and statistics
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Recharts (for analytics)
- Lucide Icons
- Axios
- Vite

### Backend
- Flask
- Python 3.8+

## 📦 Installation

### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to the root directory:
```powershell
cd ..
```

2. Create a virtual environment (if not already created):
```powershell
python -m venv venv
```

3. Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

4. Install Python dependencies:
```powershell
pip install -r requirements.txt
```

5. Run the Flask server:
```powershell
python app.py
```

The backend API will run on `http://localhost:5000`

## 🎨 Project Structure

```
resume_screening_system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── Resume/
│   │   │       ├── ResumeResults.jsx
│   │   │       └── ResumeModal.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadResume.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── app.py
├── requirements.txt
└── utils/
    ├── parser.py
    ├── cleaner.py
    ├── skill_extractor.py
    └── matcher.py
```

## 🎯 Usage

1. **Landing Page**: Visit the root URL to see the landing page
2. **Get Started**: Click "Get Started" to access the dashboard
3. **Upload Resume**: Navigate to "Upload Resume" and drag-and-drop a resume file
4. **Extract Data**: Click "Extract Data" to parse the resume
5. **View Results**: See the parsed information in a beautiful card layout
6. **Dashboard**: View all parsed resumes in a table with search and filter
7. **Analytics**: Check insights and statistics from your resume database

## 🌙 Dark Mode

Toggle dark mode using the moon/sun icon in the top navbar.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Configuration

### API Proxy

The Vite dev server is configured to proxy API requests to the Flask backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

## 🎨 Theme Colors

- Primary: Blue/Indigo
- Success: Green
- Warning: Orange
- Error: Red
- Info: Purple

## 📄 License

MIT License

## 👨‍💻 Author

NextHire Team

---

Built with ❤️ using React and Tailwind CSS
