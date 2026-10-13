import axios from 'axios';

const TOKEN_KEY = 'skillgap_token';

export const getStoredToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage quota or access errors
  }
};

export const clearStoredToken = () => {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage access errors
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
});

// Attach Authorization header if token is present
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to detect expired or rejected tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || '';
      // Only clear token and dispatch auth-expired if the 401 came from a protected auth/analysis endpoint
      if (url.includes('/analysis/') || url.includes('/auth/me')) {
        clearStoredToken();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('skillgap:auth-expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

/* -------------------------------------------------------------------------
   Authentication API Endpoints
   ------------------------------------------------------------------------- */

/**
 * Register a new user
 * @param {object} params - { name, email, password }
 */
export const signupUser = async ({ name, email, password }) => {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
};

/**
 * Log in an existing user
 * @param {object} params - { email, password }
 */
export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Fetch the current authenticated user's profile
 */
export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/* -------------------------------------------------------------------------
   System Health
   ------------------------------------------------------------------------- */

/**
 * Check backend and database health
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

/* -------------------------------------------------------------------------
   Resume & Job Analysis
   ------------------------------------------------------------------------- */

/**
 * Upload resume file (PDF, DOCX, TXT) and extract its text
 * @param {File} file
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Extract skills from resume text
 * @param {string} resumeText
 */
export const extractResumeSkills = async (resumeText) => {
  const response = await api.post('/resume/extract-skills', { resumeText });
  return response.data;
};

/**
 * Analyze job description and extract required skills
 * @param {string} jobTitle
 * @param {string} jobDescription
 */
export const analyzeJobDescription = async (jobTitle, jobDescription) => {
  const response = await api.post('/job-description/analyze', {
    jobTitle,
    jobDescription,
  });
  return response.data;
};

/**
 * Compare resume skills with required skills to compute match score, matched, and missing skills
 * @param {object} params - { resumeSkills, requiredSkills, jobTitle }
 */
export const matchSkills = async (params) => {
  const response = await api.post('/analysis/match', params);
  return response.data;
};

/**
 * Run the full analysis pipeline (match + recommendations + roadmap) and save to DB
 * Protected: Requires Authorization header
 * @param {object} params - { resumeSkills, requiredSkills, jobTitle, jobDescription, resumeFileName }
 */
export const saveCompleteAnalysis = async (params) => {
  const response = await api.post('/analysis/complete', params);
  return response.data;
};

/**
 * Fetch the 20 most recent saved analyses (summary cards) belonging to the user
 * Protected: Requires Authorization header
 */
export const fetchHistory = async () => {
  const response = await api.get('/analysis/history');
  return response.data;
};

/**
 * Fetch a single saved analysis by ID belonging to the user
 * Protected: Requires Authorization header
 * @param {string} id
 */
export const fetchAnalysisById = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

/**
 * Direct AI Career Guidance request (in-memory)
 * @param {object} params - { jobTitle, jobDescription, resumeSkills, requiredSkills, matchingSkills, missingSkills, matchScore }
 */
export const getAIAnalysis = async (params) => {
  const response = await api.post('/analysis/ai', params);
  return response.data;
};

export default api;
