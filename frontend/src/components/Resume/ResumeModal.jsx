import { X, User, Mail, Phone, Award, Briefcase, GraduationCap } from 'lucide-react';

const ResumeModal = ({ resume, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resume Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{resume.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{resume.email}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{resume.phone}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                <p className="font-medium text-gray-900 dark:text-white">{resume.experience}</p>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Resume Score</h3>
              </div>
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{resume.score}</span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">/100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resume.score}%` }}
                ></div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Match Percentage</h3>
              </div>
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{resume.match}</span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resume.match}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800"
                  >
                    {skillName}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{resume.education}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
