import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, TrendingUp, ArrowRight, Briefcase, Moon, Sun } from 'lucide-react';

const LandingPage = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Parse hundreds of resumes in seconds with AI-powered extraction'
    },
    {
      icon: Shield,
      title: 'Accurate & Reliable',
      description: 'Advanced algorithms ensure precise candidate data extraction'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Get insights on candidate pools with comprehensive analytics'
    }
  ];

  const pageStyle = {
    background: darkMode
      ? 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1f2937 100%)'
      : 'linear-gradient(to bottom right, #f9fafb 0%, #eff6ff 50%, #eef2ff 100%)',
    color: darkMode ? '#e5e7eb' : '#111827'
  };

  const navStyle = {
    backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.8)',
    borderColor: darkMode ? '#1f2937' : '#e5e7eb'
  };

  const featuresSectionStyle = {
    backgroundColor: darkMode ? '#0b1220' : '#ffffff'
  };

  const featuresHeadingStyle = {
    color: darkMode ? '#f9fafb' : '#111827'
  };

  const featuresSubheadingStyle = {
    color: darkMode ? '#9ca3af' : '#4b5563'
  };

  const heroSectionStyle = {
    background: darkMode
      ? 'linear-gradient(135deg, #0b1020 0%, #111827 55%, #1e293b 100%)'
      : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
    padding: '80px 24px',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const heroBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.2)',
    padding: '10px 20px',
    borderRadius: '50px',
    marginBottom: '32px',
    backdropFilter: 'blur(10px)',
    border: darkMode ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid transparent'
  };

  const featureCardTitleStyle = {
    color: darkMode ? '#f9fafb' : '#111827'
  };

  const featureCardTextStyle = {
    color: darkMode ? '#9ca3af' : '#4b5563'
  };

  const ctaSectionStyle = {
    background: darkMode
      ? 'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1f2937 100%)'
      : 'linear-gradient(to right, #2563eb 0%, #4f46e5 100%)'
  };

  const ctaButtonStyle = {
    backgroundColor: darkMode ? '#e2e8f0' : '#ffffff',
    color: darkMode ? '#0f172a' : '#2563eb'
  };

  return (
    <div className="min-h-screen" style={pageStyle}>
      {/* Navbar */}
      <nav className="backdrop-blur-md border-b sticky top-0 z-50" style={navStyle}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
                NextHire
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                }}
              >
                {darkMode ? (
                  <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                ) : (
                  <Moon style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                )}
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#2563eb',
                  border: '2px solid #2563eb',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                  e.target.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Redesigned */}
      <section style={heroSectionStyle}>
        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
          {/* Badge */}
          <div style={heroBadgeStyle}>
            <Sparkles style={{ width: '18px', height: '18px', color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
              AI-Powered Recruitment Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: '64px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            Transform Your Hiring with
            <br />
            <span style={{ 
              color: '#fbbf24',
              fontSize: '72px'
            }}>
              NextHire AI
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '22px',
            color: '#e0e7ff',
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Upload resumes and instantly extract structured candidate insights. 
            Streamline your hiring process with intelligent automation.
          </p>

          {/* CTA Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: '#fbbf24',
                color: '#1e3a8a',
                padding: '18px 40px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f59e0b';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fbbf24';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.3)';
              }}
            >
              <span>Start Free Trial</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '18px 40px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              Learn More
            </button>
          </div>

          {/* Feature Pills */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '60px',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: Zap, text: 'Lightning Fast Parsing' },
              { icon: Shield, text: '99% Accuracy' },
              { icon: TrendingUp, text: 'Smart Analytics' }
            ].map((item, idx) => (
              <div key={idx} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <item.icon style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" style={featuresSectionStyle}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={featuresHeadingStyle}>
              Why Choose NextHire?
            </h2>
            <p className="text-xl" style={featuresSubheadingStyle}>
              Powerful features to revolutionize your recruitment workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover group cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={featureCardTitleStyle}>
                  {feature.title}
                </h3>
                <p style={featureCardTextStyle}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={ctaSectionStyle}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#ffffff' }}>
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl mb-8" style={{ color: '#dbeafe' }}>
            Join hundreds of companies using NextHire to find the best talent faster
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={ctaButtonStyle}
            className="px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
          >
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12" style={{ backgroundColor: '#111827', color: '#9ca3af' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 NextHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
