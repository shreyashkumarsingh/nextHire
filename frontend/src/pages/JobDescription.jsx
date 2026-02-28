import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, FileText } from 'lucide-react';
import Toast from '../components/Toast';

const JobDescription = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      setToast({
        message: 'Please enter a job title',
        type: 'error',
        duration: 3000
      });
      return;
    }

    if (!jobDescription.trim()) {
      setToast({
        message: 'Please enter a job description',
        type: 'error',
        duration: 3000
      });
      return;
    }

    // Store job description in localStorage
    localStorage.setItem('jobTitle', jobTitle);
    localStorage.setItem('jobDescription', jobDescription);

    setToast({
      message: '✓ Job description saved! Ready to upload resumes.',
      type: 'success',
      duration: 2000
    });

    // Navigate to upload page
    setTimeout(() => {
      navigate('/app/upload');
    }, 1500);
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

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Post Job Description
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Enter the job description so we can match it with candidate resumes
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Job Title Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Job Title
              </h2>
            </div>

            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Full Stack Developer"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Job Description Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#d1fae5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen style={{ width: '24px', height: '24px', color: '#10b981' }} />
              </div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Job Description
              </h2>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here. Include responsibilities, required skills, qualifications, experience level, etc."
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                minHeight: '300px',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />

            <div style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#9ca3af'
            }}>
              {jobDescription.length} characters ({Math.ceil(jobDescription.split(/\s+/).filter(w => w).length)} words)
            </div>
          </div>

          {/* Submit Button */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#ffffff',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              <ArrowRight style={{ width: '20px', height: '20px' }} />
              <span>{loading ? 'Saving...' : 'Continue to Upload Resumes'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobDescription;
