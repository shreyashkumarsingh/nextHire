import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart3, Settings, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/upload', icon: Upload, label: 'Upload Resume' },
    { path: '/app/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 fixed left-0 top-0 h-full z-20">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            NextHire
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
