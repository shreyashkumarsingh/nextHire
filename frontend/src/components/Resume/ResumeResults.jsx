import { User, Mail, Phone, Briefcase, GraduationCap, Award, TrendingUp } from 'lucide-react';

const ResumeResults = ({ data }) => {
  // Require actual data from API - no mock/dummy data in production
  const resumeData = data;

  // Show empty state if no data provided
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No resume data available. Please upload and analyze a resume first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Personal Info Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Candidate Info</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumeData.name}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{resumeData.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{resumeData.phone}</span>
            </div>
          </div>
        </div>

        {/* Resume Score Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">ATS Score</h3>
          </div>
          <div>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {resumeData.score}
              </span>
              <span className="text-gray-500 dark:text-gray-400 mb-1">/100</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  resumeData.score >= 80 ? 'bg-green-500' :
                  resumeData.score >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${resumeData.score}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {resumeData.score >= 80 ? 'Excellent Match' :
               resumeData.score >= 60 ? 'Good Match' :
               resumeData.score >= 40 ? 'Fair Match' :
               'Low Match'}
            </p>
          </div>
        </div>

        {/* Match Percentage Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Skill Match</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (resumeData.matchPercentage ?? 0) / 100)}`}
                  className="text-primary-600 dark:text-primary-400 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {resumeData.matchPercentage != null ? `${resumeData.matchPercentage}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          {resumeData.matchPercentage != null && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              {resumeData.matchPercentage >= 70 ? 'Strong skill match' :
               resumeData.matchPercentage >= 40 ? 'Partial skill match' :
               'Low skill match — review missing skills below'}
            </p>
          )}
        </div>
      </div>

      {/* Score Breakdown Section - NEW */}
      {resumeData.breakdown && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Score Breakdown</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{resumeData.breakdown.skills}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resumeData.breakdown.skills}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">40% weight</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Education</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{resumeData.breakdown.education}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resumeData.breakdown.education}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">30% weight</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{resumeData.breakdown.experience}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resumeData.breakdown.experience}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">20% weight</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{resumeData.breakdown.keywords}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${resumeData.breakdown.keywords}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">10% weight</p>
            </div>
          </div>
        </div>
      )}

      {/* Matched & Missing Skills */}
      {(resumeData.matchedSkills || resumeData.missingSkills) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matched Skills */}
          {resumeData.matchedSkills && resumeData.matchedSkills.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Matched Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm border border-green-200 dark:border-green-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {resumeData.missingSkills && resumeData.missingSkills.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.missingSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm border border-red-200 dark:border-red-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => {
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

      {/* Experience & Education */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Experience</h3>
          </div>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h4>
                <p className="text-sm text-primary-600 dark:text-primary-400">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
              </div>
            ))}
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
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-indigo-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeResults;
