import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader, CheckCircle, XCircle, Briefcase, ArrowLeft, BookOpen } from 'lucide-react';
import { resumeAPI } from '../services/api';
import ResumeResults from '../components/Resume/ResumeResults';
import Toast from '../components/Toast';

const UploadResume = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Load job title from localStorage if available
  useEffect(() => {
    const title = localStorage.getItem('jobTitle');
    if (title) {
      setJobTitle(title);
    }
  }, []);

  const onJdDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setJdFile(acceptedFiles[0]);
      setResults(null);
      setError(null);
    }
  };

  const onResumeDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setResults(null);
      setError(null);
    }
  };

  const { getRootProps: getJdRootProps, getInputProps: getJdInputProps, isDragActive: isJdDragActive } = useDropzone({
    onDrop: onJdDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
    onDrop: onResumeDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
  });

  const handleExtractData = async () => {
    // Validate inputs
    if (!jobTitle.trim()) {
      setToast({
        message: 'Please enter a job title',
        type: 'error',
        duration: 3000
      });
      return;
    }

    if (!jdFile) {
      setToast({
        message: 'Please upload a job description PDF',
        type: 'error',
        duration: 3000
      });
      return;
    }

    if (!uploadedFile) {
      setToast({
        message: 'Please upload a resume file',
        type: 'error',
        duration: 3000
      });
      return;
    }

    // Save job title to localStorage
    localStorage.setItem('jobTitle', jobTitle);

    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const data = await resumeAPI.uploadResume(uploadedFile, jdFile, jobTitle);
      setProgress(100);
      setTimeout(() => {
        setResults(data);
        setLoading(false);
        // Refresh dashboard/analytics after upload
        if (window.refreshDashboard) {
          window.refreshDashboard();
        }
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse resume. Please try again.');
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload & Match Resumes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter job details and upload resumes to find the best candidates
          </p>
        </div>

      {/* Two Column Layout */}
      {!results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Job Description */}
          <div className="space-y-6">
            {/* Job Title Card */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Job Title</h2>
              </div>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Full Stack Developer"
                className="input-field"
              />
            </div>

            {/* Job Description Upload Card */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Job Description PDF</h2>
              </div>

              <div
                {...getJdRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isJdDragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                }`}
              >
                <input {...getJdInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  {isJdDragActive ? (
                    <p className="text-lg font-medium text-green-600 dark:text-green-400">
                      Drop the JD PDF here...
                    </p>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Drag & drop JD PDF here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        or click to browse
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        PDF files only
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* JD File Preview */}
              {jdFile && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {jdFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(jdFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setJdFile(null);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Resume Upload */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Resume</h2>
              </div>

              <div
                {...getResumeRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isResumeDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                <input {...getResumeInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  {isResumeDragActive ? (
                    <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                      Drop the file here...
                    </p>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Drag & drop resume here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        or click to browse
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        PDF, DOCX, TXT supported
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* File Preview */}
              {uploadedFile && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Parsing resume...
                    </span>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Extract Button */}
              <div className="mt-6">
                <button
                  onClick={handleExtractData}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Extracting Data...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Parse Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Dashboard */}
      {results && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Resume parsed successfully!</span>
            </div>
            <button
              onClick={() => {
                setResults(null);
                setUploadedFile(null);
                setJdFile(null);
                // Refresh dashboard/analytics
                if (window.refreshDashboard) {
                  setTimeout(() => window.refreshDashboard(), 500);
                }
              }}
              className="btn-secondary"
            >
              Upload Another
            </button>
          </div>
          <ResumeResults data={results} />
        </div>
      )}
    </div>
    </>
  );
};

export default UploadResume;
