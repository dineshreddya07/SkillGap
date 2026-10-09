const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { extractResumeText } = require('../services/resumeParserService');
const { extractSkills } = require('../utils/skillExtractor');

// POST /api/resume/upload
router.post('/upload', (req, res, next) => {
  upload.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Please upload a file with field name "resume".',
      });
    }

    try {
      const { text, fileType } = await extractResumeText(req.file.buffer, req.file.originalname);

      if (!text || text.length === 0) {
        return res.status(422).json({
          success: false,
          message: 'The uploaded file does not contain readable text or is empty.',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          originalFilename: req.file.originalname,
          detectedFileType: fileType,
          fileSizeBytes: req.file.size,
          extractedText: text,
          textLength: text.length,
        },
      });
    } catch (parseError) {
      return res.status(422).json({
        success: false,
        message: `Failed to extract text from resume: ${parseError.message}`,
      });
    }
  });
});

// POST /api/resume/extract-skills
router.post('/extract-skills', (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'resumeText is required and must be non-empty text.',
    });
  }

  const resumeSkills = extractSkills(resumeText);

  return res.status(200).json({
    success: true,
    data: {
      resumeSkills,
    },
  });
});

module.exports = router;
