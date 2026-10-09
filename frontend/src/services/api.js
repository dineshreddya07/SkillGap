import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
});

/**
 * Check backend and database health
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

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
 * @param {object} params - { resumeSkills, requiredSkills, jobTitle, jobDescription, resumeFileName }
 */
export const saveCompleteAnalysis = async (params) => {
  const response = await api.post('/analysis/complete', params);
  return response.data;
};

/**
 * Fetch the 20 most recent saved analyses (summary cards)
 */
export const fetchHistory = async () => {
  const response = await api.get('/analysis/history');
  return response.data;
};

/**
 * Fetch a single saved analysis by ID
 * @param {string} id
 */
export const fetchAnalysisById = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

/**
 * Direct AI Career Guidance request
 * @param {object} params - { jobTitle, jobDescription, resumeSkills, requiredSkills, matchingSkills, missingSkills, matchScore }
 */
export const getAIAnalysis = async (params) => {
  const response = await api.post('/analysis/ai', params);
  return response.data;
};

export default api;
