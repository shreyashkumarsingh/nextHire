import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Database, Save, LogOut } from 'lucide-react';
import { authAPI, profileAPI } from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    name: 'HR Manager',
    email: 'hr@company.com',
    notifications: true,
    emailAlerts: true,
    autoBackup: true,
    dataRetention: '90',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const profile = await profileAPI.getProfile();
        if (!isMounted) {
          return;
        }
        setSettings((prev) => ({
          ...prev,
          name: profile.fullName || prev.name,
          email: profile.email || prev.email,
          notifications: Boolean(profile.notificationPush ?? prev.notifications),
          emailAlerts: Boolean(profile.notificationEmail ?? prev.emailAlerts),
          dataRetention: String(profile.gdprRetentionDays || prev.dataRetention),
        }));
        setTwoFactorEnabled(Boolean(profile.twoFactorEnabled));
      } catch (error) {
        if (isMounted) {
          setStatusMessage('Unable to load profile settings.');
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      await profileAPI.updateProfile({
        fullName: settings.name,
        notificationPush: settings.notifications,
        notificationEmail: settings.emailAlerts,
        gdprRetentionDays: settings.dataRetention,
        twoFactorEnabled: twoFactorEnabled,
      });
      setStatusMessage('Settings saved successfully.');
    } catch (error) {
      setStatusMessage('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    const nextValue = !twoFactorEnabled;
    setIsLoading(true);
    setStatusMessage('');
    try {
      await profileAPI.setTwoFactor(nextValue);
      setTwoFactorEnabled(nextValue);
      setStatusMessage(`Two-factor authentication ${nextValue ? 'enabled' : 'disabled'}.`);
    } catch (error) {
      setStatusMessage('Unable to update two-factor settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setStatusMessage('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setStatusMessage('Please fill out all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMessage('New password and confirmation do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      setStatusMessage('Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      setStatusMessage('Password update failed. Check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
    // Force page reload to reset authentication state
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and application preferences
        </p>
      </div>

      <div className="space-y-6">
        {statusMessage && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
            {statusMessage}
          </div>
        )}
        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for new resume uploads
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get email alerts for high-scoring candidates
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailAlerts ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto Backup</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically backup resume data daily
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoBackup ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention Period (days)
              </label>
              <select
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                className="input-field"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowChangePassword((prev) => !prev)}
              className="btn-secondary w-full"
            >
              {showChangePassword ? 'Cancel Password Change' : 'Change Password'}
            </button>

            {showChangePassword && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="input-field"
                  />
                  <button
                    onClick={handlePasswordChange}
                    className="btn-primary w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleToggleTwoFactor}
              className="btn-secondary w-full"
              disabled={isLoading}
            >
              {twoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
            </button>

            <button 
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary flex items-center space-x-2" disabled={isLoading}>
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
