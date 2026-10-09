const express = require('express');
const router = express.Router();
const { extractSkills } = require('../utils/skillExtractor');

// POST /api/job-description/analyze
router.post('/analyze', (req, res) => {
  const { jobTitle, jobDescription } = req.body;

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'jobDescription is required and must be non-empty text.',
    });
  }

  // Enforce reasonable max length (e.g., 50,000 characters)
  if (jobDescription.length > 50000) {
    return res.status(400).json({
      success: false,
      message: 'jobDescription exceeds maximum allowable length of 50,000 characters.',
    });
  }

  const requiredSkills = extractSkills(jobDescription);

  return res.status(200).json({
    success: true,
    data: {
      jobTitle: jobTitle && typeof jobTitle === 'string' ? jobTitle.trim() : 'Software Developer',
      requiredSkills,
    },
  });
});

module.exports = router;
