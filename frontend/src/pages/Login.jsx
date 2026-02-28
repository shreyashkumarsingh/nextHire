import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Briefcase, Mail, Lock, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { authAPI } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    setLoading(true);

    try {
      console.log('Starting login with:', formData.username);
      
      const data = await authAPI.login(formData);
      console.log('Login successful, token:', data.access_token ? 'received' : 'missing');

      // Show success toast
      setToast({
        message: '✓ Login successful! Redirecting to dashboard...',
        type: 'success',
        duration: 2000
      });

      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify App component and navigate to dashboard
      if (onLoginSuccess) onLoginSuccess();
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Login failed. Please try again.';
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
      padding: '20px'
    }}>
      {/* Login Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '48px',
        maxWidth: '480px',
        width: '100%'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Sign in to your NextHire account
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

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Username or Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username or email"
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
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
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
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

          {/* Login Button */}
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
            <LogIn style={{ width: '20px', height: '20px' }} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Signup Link */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Sign up
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

export default Login;
