import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'userProfile';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState('');
  const [initials, setInitials] = useState('HR');

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!saved) {
        return;
      }
      try {
        const parsed = JSON.parse(saved);
        setProfilePhoto(parsed.photo || '');
        const name = parsed.fullName || 'HR Manager';
        const nextInitials = name
          .split(' ')
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase();
        setInitials(nextInitials || 'HR');
      } catch (error) {
        console.error('Failed to read profile data:', error);
      }
    };

    loadProfile();
    window.addEventListener('storage', loadProfile);
    return () => window.removeEventListener('storage', loadProfile);
  }, []);
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome to NextHire
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/app/profile')}
              className="w-10 h-10 rounded-full bg-primary-500 text-white font-semibold overflow-hidden border border-white/20 hover:scale-105 transition-transform"
              aria-label="Open profile"
              title="Profile"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="inline-flex w-full h-full items-center justify-center">
                  {initials}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
