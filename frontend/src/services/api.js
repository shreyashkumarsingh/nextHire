import axios from 'axios';

// Use environment variable or fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizeResume = (resume) => {
  if (!resume || typeof resume !== 'object') {
    return resume;
  }

  return {
    ...resume,
    matchPercentage: resume.matchPercentage ?? resume.match_percentage ?? resume.match,
    matchedSkills: resume.matchedSkills ?? resume.matched_skills,
    missingSkills: resume.missingSkills ?? resume.missing_skills,
  };
};

const normalizeResumeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeResume);
  }

  if (payload && Array.isArray(payload.resumes)) {
    return {
      ...payload,
      resumes: payload.resumes.map(normalizeResume),
    };
  }

  return normalizeResume(payload);
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  // User signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (payload) => {
    const response = await api.post('/auth/change-password', payload);
    return response.data;
  },
};

export const resumeAPI = {
  // Upload and parse resume with job description PDF
  uploadResume: async (resumeFile, jdFile, jobTitle = '') => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    if (jdFile) {
      formData.append('job_description', jdFile);
    }
    formData.append('job_title', jobTitle);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalizeResume(response.data);
  },

  // Get all resumes
  getAllResumes: async () => {
    const response = await api.get('/resumes');
    return normalizeResumeCollection(response.data);
  },

  // Get resume by ID
  getResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return normalizeResume(response.data);
  },

  // Delete resume
  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  // Get analytics data
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};

export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Toggle two-factor authentication
  setTwoFactor: async (enabled) => {
    const response = await api.post('/profile/two-factor', { enabled });
    return response.data;
  },
};

export default api;
