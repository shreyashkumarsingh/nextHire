import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobDescription from './pages/JobDescription';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Layout from './components/Layout/Layout';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log('Checking authentication, token:', token ? 'exists' : 'missing');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (from other tabs/instances)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading...</p></div>;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className={darkMode ? 'dark' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/signup" element={<Signup onSignupSuccess={() => setIsAuthenticated(true)} />} />
          
          {/* Protected Routes */}
          <Route
            path="/app/*"
            element={
              isAuthenticated ? (
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="job-description" element={<JobDescription />} />
                    <Route path="upload" element={<UploadResume />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
