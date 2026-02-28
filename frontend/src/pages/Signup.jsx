import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Briefcase, Mail, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { authAPI } from '../services/api';

const Signup = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      setToast({ message: errorMsg, type: 'error', duration: 5000 });
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      setError(errorMsg);
      setToast({ message: errorMsg, type: 'error', duration: 5000 });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup with:', formData.username);

      const data = await authAPI.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        company: formData.company
      });

      console.log('Response data:', data);

      // Show success toast for 5 seconds
      setToast({
        message: '✓ Account created successfully! Redirecting to dashboard...',
        type: 'success',
        duration: 5000
      });

      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify App component and navigate to dashboard
      if (onSignupSuccess) onSignupSuccess();
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 4500);
    } catch (err) {
      console.error('Signup error:', err);
      const errorMsg = err.message || 'Signup failed. Please try again.';
      setError(errorMsg);
      setToast({
        message: errorMsg,
        type: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
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
      <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      {/* Signup Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '48px',
        maxWidth: '520px',
        width: '100%'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Briefcase style={{ width: '32px', height: '32px', color: '#ffffff' }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Create Account
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Join NextHire and transform your hiring process
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
            <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Username *
            </label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@company.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Full Name Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Company Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Company
            </label>
            <div style={{ position: 'relative' }}>
              <Building style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Name"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <CheckCircle style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            <UserPlus style={{ width: '20px', height: '20px' }} />
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Login Link */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Sign in
          </Link>
        </div>

        {/* Back to Home */}
        <div style={{
          marginTop: '16px',
          textAlign: 'center'
        }}>
          <Link
            to="/"
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.color = '#667eea'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
