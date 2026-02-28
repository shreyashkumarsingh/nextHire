import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="ml-64 pt-20 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
