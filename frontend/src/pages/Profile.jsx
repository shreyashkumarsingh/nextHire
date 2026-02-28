import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Link2,
  Globe,
  Settings,
  Bell,
  Shield,
  Users,
  FileText,
  BarChart3,
  Upload,
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react';

const PROFILE_STORAGE_KEY = 'userProfile';

const defaultProfile = {
  fullName: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  location: '',
  about: '',
  website: '',
  linkedIn: '',
  github: '',
  photo: '',
  timezone: 'UTC',
  language: 'English',
  theme: 'System',
  notificationEmail: true,
  notificationPush: true,
  twoFactorEnabled: false,
  teamName: '',
  department: '',
  role: '',
  manager: '',
  emailSignature: '',
  companyLogo: '',
  jobTemplate: '',
  integrations: {
    slack: false,
    gmail: false,
    outlook: false,
    calendar: false,
    linkedIn: false
  },
  accessLevel: 'Admin',
  dataExportEnabled: true,
  gdprRetentionDays: '90',
  savedFilters: []
};

const Profile = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFilterName, setNewFilterName] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      if (!token) {
        setError('Not authenticated. Profile will be saved locally.');
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved) {
          setProfile({ ...defaultProfile, ...JSON.parse(saved) });
        }
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      setProfile({
        fullName: data.fullName || defaultProfile.fullName,
        title: data.title || '',
        company: data.company || defaultProfile.company,
        email: data.email || defaultProfile.email,
        phone: data.phone || '',
        location: data.location || '',
        about: data.about || '',
        website: data.website || '',
        linkedIn: data.linkedin || '',
        github: data.github || '',
        photo: data.photo || '',
        timezone: data.timezone || 'UTC',
        language: data.language || 'English',
        theme: data.theme || 'System',
        notificationEmail: data.notificationEmail !== false,
        notificationPush: data.notificationPush !== false,
        twoFactorEnabled: data.twoFactorEnabled || false,
        teamName: data.teamName || '',
        department: data.department || '',
        role: data.role || '',
        manager: data.manager || '',
        emailSignature: data.emailSignature || '',
        companyLogo: data.companyLogo || '',
        jobTemplate: data.jobTemplate || '',
        integrations: data.integrations || defaultProfile.integrations,
        accessLevel: data.accessLevel || 'Admin',
        dataExportEnabled: data.dataExportEnabled !== false,
        gdprRetentionDays: data.gdprRetentionDays || '90',
        savedFilters: data.savedFilters || []
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile from server. Using local storage.');
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        setProfile({ ...defaultProfile, ...JSON.parse(saved) });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleToggle = (field) => {
    setProfile((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleIntegrationToggle = (field) => {
    setProfile((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [field]: !prev.integrations[field]
      }
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, companyLogo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, photo: '' }));
  };

  const handleRemoveLogo = () => {
    setProfile((prev) => ({ ...prev, companyLogo: '' }));
  };

  const handleAddFilter = () => {
    const trimmed = newFilterName.trim();
    if (!trimmed) {
      return;
    }
    setProfile((prev) => ({
      ...prev,
      savedFilters: [...prev.savedFilters, trimmed]
    }));
    setNewFilterName('');
  };

  const handleRemoveFilter = (filterName) => {
    setProfile((prev) => ({
      ...prev,
      savedFilters: prev.savedFilters.filter((filter) => filter !== filterName)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const token = getToken();
      
      if (!token) {
        // Fallback to localStorage if not authenticated
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        setTimeout(() => setSaving(false), 400);
        return;
      }

      const response = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.status} ${response.statusText}`);
      }

      // Also save to localStorage as backup
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      
      setTimeout(() => setSaving(false), 400);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(`Failed to save profile: ${err.message}`);
      // Still save to localStorage as fallback
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setTimeout(() => setSaving(false), 400);
    }
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'HR';

  return (
    <div className="max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile photo, contact details, and public links
        </p>
      </div>

      {loading && (
        <div className="card text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900 dark:text-yellow-200">{error}</p>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">Data will be saved locally.</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-semibold text-gray-500 dark:text-gray-400">{initials}</span>
              )}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG, or WEBP up to 2MB
            </div>

            <div className="flex items-center justify-center gap-3">
              <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange('fullName')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={handleChange('title')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={profile.company}
                    onChange={handleChange('company')}
                    className="input-field pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={handleChange('location')}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={handleChange('email')}
                    className="input-field pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange('phone')}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Public Links</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="url"
                    value={profile.website}
                    onChange={handleChange('website')}
                    className="input-field pl-12"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={profile.linkedIn}
                  onChange={handleChange('linkedIn')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={handleChange('github')}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About</h3>
            </div>

            <textarea
              rows="5"
              value={profile.about}
              onChange={handleChange('about')}
              className="input-field"
              placeholder="Share a quick summary about your work and focus areas"
            />
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Preferences</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={profile.timezone}
                  onChange={handleChange('timezone')}
                  className="input-field"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={profile.language}
                  onChange={handleChange('language')}
                  className="input-field"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={profile.theme}
                  onChange={handleChange('theme')}
                  className="input-field"
                >
                  <option value="System">System</option>
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Channels</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive ATS updates and candidate summaries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notificationEmail')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.notificationEmail ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.notificationEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stay informed about new uploads and approvals
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notificationPush')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.notificationPush ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.notificationPush ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Require a second step to sign in</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('twoFactorEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last updated 30 days ago</p>
                </div>
                <button type="button" className="btn-secondary">Change Password</button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Active Sessions</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chrome on Windows, 2 hours ago</p>
                </div>
                <button type="button" className="btn-secondary">Manage Sessions</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={profile.teamName}
                  onChange={handleChange('teamName')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={handleChange('department')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={handleChange('role')}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manager
                </label>
                <input
                  type="text"
                  value={profile.manager}
                  onChange={handleChange('manager')}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Signature</h3>
            </div>

            <textarea
              rows="4"
              value={profile.emailSignature}
              onChange={handleChange('emailSignature')}
              className="input-field"
              placeholder="Add your default email signature"
            />
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Assets</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                    {profile.companyLogo ? (
                      <img src={profile.companyLogo} alt="Company logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Job Template
                </label>
                <textarea
                  rows="4"
                  value={profile.jobTemplate}
                  onChange={handleChange('jobTemplate')}
                  className="input-field"
                  placeholder="Paste a reusable job description template"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integrations</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'slack', label: 'Slack' },
                { key: 'gmail', label: 'Gmail' },
                { key: 'outlook', label: 'Outlook' },
                { key: 'calendar', label: 'Calendar' },
                { key: 'linkedIn', label: 'LinkedIn Recruiter' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => handleIntegrationToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.integrations[item.key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.integrations[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity section - will be populated with real data from API */}

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Level
                </label>
                <select
                  value={profile.accessLevel}
                  onChange={handleChange('accessLevel')}
                  className="input-field"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GDPR Retention
                </label>
                <select
                  value={profile.gdprRetentionDays}
                  onChange={handleChange('gdprRetentionDays')}
                  className="input-field"
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Data Export</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow CSV and PDF exports</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('dataExportEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.dataExportEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.dataExportEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Filters</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="text"
                value={newFilterName}
                onChange={(event) => setNewFilterName(event.target.value)}
                placeholder="Add a filter name"
                className="input-field flex-1"
              />
              <button type="button" onClick={handleAddFilter} className="btn-secondary">
                Add Filter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.savedFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {filter}
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(filter)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`Remove ${filter}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
              disabled={saving}
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Profile;
