import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, Users, FileText, TrendingUp, Award } from 'lucide-react';
import { resumeAPI } from '../services/api';
import ResumeModal from '../components/Resume/ResumeModal';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resumes from API
  useEffect(() => {
    fetchResumesData();
  }, []);

  const fetchResumesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeAPI.getAllResumes();
      
      // Handle single resume or array of resumes
      const resumeList = Array.isArray(data) ? data : (data.resumes || []);
      
      // Transform API data to match component expectations
      const transformedResumes = resumeList.map(resume => ({
        id: resume.id,
        name: resume.name || 'Unknown',
        email: resume.email || '',
        phone: resume.phone || '',
        skills: Array.isArray(resume.skills) 
          ? resume.skills.map(skill => typeof skill === 'string' ? skill : skill.name)
          : [],
        score: resume.score || 0,
        match: resume.matchPercentage || resume.match || 0,
        uploadDate: resume.uploadDate || new Date().toISOString().split('T')[0],
        education: resume.education?.[0]?.degree || 'N/A',
        experience: resume.experience?.[0]?.duration || 'N/A',
        rawText: resume.rawText || ''
      }));
      
      setResumes(transformedResumes);
      setFilteredResumes(transformedResumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes. ' + (err.message || ''));
      setResumes([]);
      setFilteredResumes([]);
    } finally {
      setLoading(false);
    }
  };

  // Expose refetch so parent can call after uploads
  useEffect(() => {
    window.refreshDashboard = fetchResumesData;
    return () => {
      delete window.refreshDashboard;
    };
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...resumes];

    if (searchTerm) {
      filtered = filtered.filter(resume =>
        resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (scoreFilter !== 'all') {
      if (scoreFilter === 'high') {
        filtered = filtered.filter(resume => resume.score >= 80);
      } else if (scoreFilter === 'medium') {
        filtered = filtered.filter(resume => resume.score >= 60 && resume.score < 80);
      } else if (scoreFilter === 'low') {
        filtered = filtered.filter(resume => resume.score < 60);
      }
    }

    if (sortBy === 'score') {
      filtered.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'match') {
      filtered.sort((a, b) => b.match - a.match);
    } else {
      filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }

    setFilteredResumes(filtered);
  }, [searchTerm, scoreFilter, sortBy, resumes]);

  const handleViewDetails = (resume) => {
    setSelectedResume(resume);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await resumeAPI.deleteResume(id);
      setResumes(resumes.filter(resume => resume.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
  };

  const stats = [
    {
      label: 'Total Resumes',
      value: resumes.length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      label: 'Average Score',
      value: resumes.length ? Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / resumes.length) : 0,
      icon: Award,
      color: 'bg-green-500'
    },
    {
      label: 'Top Match',
      value: `${resumes.length ? Math.max(...resumes.map(r => r.match), 0) : 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      label: 'This Month',
      value: resumes.filter(r => new Date(r.uploadDate).getMonth() === new Date().getMonth()).length,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section - Resume Management Focus */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Resume Management</h1>
        <p className="text-blue-100 mb-6">
          Organize, filter, and manage your candidate resumes
        </p>
        <button 
          onClick={() => window.location.href = '/app/upload'}
          className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          <FileText className="w-5 h-5" /> Upload New Resume
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading resumes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <p className="text-red-600 dark:text-red-400">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            {error.includes('422') ? 'Please sign in to see your saved resumes.' : 'Please try again later.'}
          </p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Quick Stats - Compact at Top */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase font-semibold">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter Tools - Prominent */}
          <div className="card p-6 border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Search & Filter Tools</h3>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search candidates by name, email, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 lg:w-auto">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <select
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    className="input-field pl-12 pr-4 appearance-none cursor-pointer bg-white dark:bg-gray-800"
                  >
                    <option value="all">All Scores</option>
                    <option value="high">High (80+)</option>
                    <option value="medium">Medium (60-79)</option>
                    <option value="low">Low (&lt;60)</option>
                  </select>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field appearance-none cursor-pointer bg-white dark:bg-gray-800"
                >
                  <option value="date">Recent</option>
                  <option value="score">Top Score</option>
                  <option value="match">Best Match</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumes Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Candidate List
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {filteredResumes.length} of {resumes.length} resumes
                </span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Match %</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredResumes.map((resume) => (
                    <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{resume.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{resume.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {resume.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {resume.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              +{resume.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${resume.score >= 80 ? 'text-green-600 dark:text-green-400' : resume.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                          {resume.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{resume.match}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(resume.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 gap-1">
                          <button 
                            onClick={() => handleViewDetails(resume)} 
                            className="px-3 py-1 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center gap-1"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(resume.id)} 
                            className="px-3 py-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center gap-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredResumes.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/20">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No resumes found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && resumes.length === 0 && !error && (
        <div className="card text-center py-16">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Resumes Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't uploaded any resumes yet. Start by uploading your first resume.</p>
          <button 
            onClick={() => window.location.href = '/app/upload'}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <FileText className="w-5 h-5" /> Upload First Resume
          </button>
        </div>
      )}

      {/* Resume Details Modal */}
      {showModal && selectedResume && (
        <ResumeModal
          resume={selectedResume}
          onClose={() => {
            setShowModal(false);
            setSelectedResume(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this resume? This action cannot be undone.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
