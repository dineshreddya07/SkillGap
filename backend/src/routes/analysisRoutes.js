const express = require('express');
const router = express.Router();
const { extractSkills } = require('../utils/skillExtractor');
const { calculateSkillMatch } = require('../services/matchingEngineService');
const { generateCareerAnalysis } = require('../services/aiService');
const prisma = require('../lib/prisma');

// Helper to deduplicate array items
const uniqueArray = (arr) => [...new Set((arr || []).filter(item => typeof item === 'string' && item.trim().length > 0))];

// ---------------------------------------------------------------------------
// POST /api/analysis/match
// Compare resume skills vs required skills (Step 6 — no DB save)
// ---------------------------------------------------------------------------
router.post('/match', (req, res) => {
  let { resumeSkills, requiredSkills, resumeText, jobDescription, jobTitle } = req.body;

  // If raw text is provided instead of pre-extracted skill arrays, extract dynamically
  if (!Array.isArray(resumeSkills) && typeof resumeText === 'string') {
    resumeSkills = extractSkills(resumeText);
  }

  if (!Array.isArray(requiredSkills) && typeof jobDescription === 'string') {
    requiredSkills = extractSkills(jobDescription);
  }

  resumeSkills = Array.isArray(resumeSkills) ? uniqueArray(resumeSkills) : [];
  requiredSkills = Array.isArray(requiredSkills) ? uniqueArray(requiredSkills) : [];

  const matchResult = calculateSkillMatch(resumeSkills, requiredSkills);

  return res.status(200).json({
    success: true,
    data: {
      jobTitle: jobTitle || 'Target Role',
      resumeSkills,
      requiredSkills,
      ...matchResult,
    },
  });
});

// ---------------------------------------------------------------------------
// POST /api/analysis/ai
// Direct AI Career Guidance endpoint (Step 8 Part 4)
// Falls back automatically to deterministic logic if AI key is missing or invalid
// ---------------------------------------------------------------------------
router.post('/ai', async (req, res) => {
  try {
    const rawPayload = JSON.stringify(req.body || {});
    if (rawPayload.length > 100000) {
      return res.status(413).json({
        success: false,
        message: 'Payload is too large. Please shorten the job description or input.',
      });
    }

    let {
      jobTitle,
      jobDescription,
      resumeSkills,
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchScore,
    } = req.body;

    // Validate inputs
    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'jobDescription must be a non-empty string.',
      });
    }

    if (jobDescription.length > 50000) {
      return res.status(400).json({
        success: false,
        message: 'jobDescription exceeds maximum length limit of 50,000 characters.',
      });
    }

    if (resumeSkills !== undefined && !Array.isArray(resumeSkills)) {
      return res.status(400).json({ success: false, message: 'resumeSkills must be an array of strings.' });
    }
    if (requiredSkills !== undefined && !Array.isArray(requiredSkills)) {
      return res.status(400).json({ success: false, message: 'requiredSkills must be an array of strings.' });
    }
    if (matchingSkills !== undefined && !Array.isArray(matchingSkills)) {
      return res.status(400).json({ success: false, message: 'matchingSkills must be an array of strings.' });
    }
    if (missingSkills !== undefined && !Array.isArray(missingSkills)) {
      return res.status(400).json({ success: false, message: 'missingSkills must be an array of strings.' });
    }

    if (matchScore !== undefined) {
      const scoreNum = Number(matchScore);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        return res.status(400).json({ success: false, message: 'matchScore must be a number between 0 and 100.' });
      }
      matchScore = Math.round(scoreNum);
    } else {
      matchScore = 0;
    }

    resumeSkills = uniqueArray(resumeSkills);
    requiredSkills = uniqueArray(requiredSkills);
    matchingSkills = uniqueArray(matchingSkills);
    missingSkills = uniqueArray(missingSkills);

    const result = await generateCareerAnalysis({
      jobTitle: typeof jobTitle === 'string' ? jobTitle.trim() : 'Software Developer',
      jobDescription: jobDescription.trim(),
      resumeSkills,
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchScore,
    });

    return res.status(200).json({
      success: true,
      source: result.source,
      data: result.data,
    });
  } catch (err) {
    console.error('Error in /api/analysis/ai:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process career analysis.',
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/analysis/complete
// Full pipeline: match + AI enhancement (with fallback) + save to DB
// ---------------------------------------------------------------------------
router.post('/complete', async (req, res) => {
  try {
    const rawPayload = JSON.stringify(req.body || {});
    if (rawPayload.length > 100000) {
      return res.status(413).json({
        success: false,
        message: 'Payload is too large. Please shorten the job description or input.',
      });
    }

    let {
      resumeSkills,
      requiredSkills,
      resumeText,
      jobDescription,
      jobTitle,
      resumeFileName,
    } = req.body;

    // Validate required fields
    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'jobDescription is required.',
      });
    }

    if (jobDescription.length > 50000) {
      return res.status(400).json({
        success: false,
        message: 'jobDescription exceeds maximum length limit of 50,000 characters.',
      });
    }

    // Extract skills from raw text if arrays not provided
    if (!Array.isArray(resumeSkills) && typeof resumeText === 'string') {
      resumeSkills = extractSkills(resumeText);
    }
    if (!Array.isArray(requiredSkills)) {
      requiredSkills = extractSkills(jobDescription);
    }

    resumeSkills = uniqueArray(resumeSkills);
    requiredSkills = uniqueArray(requiredSkills);

    // Step 1: Skill matching
    const matchResult = calculateSkillMatch(resumeSkills, requiredSkills);

    // Step 2: AI Career Analysis with deterministic fallback
    const careerAnalysis = await generateCareerAnalysis({
      jobTitle: typeof jobTitle === 'string' ? jobTitle.trim() : 'Target Role',
      jobDescription: jobDescription.trim(),
      resumeSkills,
      requiredSkills,
      matchingSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      matchScore: matchResult.matchScore,
    });

    const aiData = careerAnalysis.data;

    // Step 3: Save to database using existing Analysis model
    const saved = await prisma.analysis.create({
      data: {
        resumeFileName: resumeFileName || null,
        jobTitle: jobTitle || null,
        jobDescription: jobDescription.trim(),
        matchScore: matchResult.matchScore,
        matchingSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        recommendations: aiData.recommendations,
        learningRoadmap: {
          source: careerAnalysis.source,
          summary: aiData.summary,
          skillPriorities: aiData.skillPriorities,
          steps: aiData.roadmap,
        },
      },
    });

    return res.status(201).json({
      success: true,
      source: careerAnalysis.source,
      data: {
        analysisId: saved.id,
        savedAt: saved.createdAt,
        jobTitle: jobTitle || 'Target Role',
        resumeFileName: resumeFileName || null,
        resumeSkills,
        requiredSkills,
        ...matchResult,
        summary: aiData.summary,
        skillPriorities: aiData.skillPriorities,
        recommendations: aiData.recommendations,
        roadmap: {
          message: aiData.summary,
          steps: aiData.roadmap,
        },
        source: careerAnalysis.source,
      },
    });
  } catch (err) {
    console.error('Complete analysis error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to save analysis. Please try again.',
    });
  }
});

// ---------------------------------------------------------------------------
// GET /api/analysis/history
// Return the 20 most recent analyses (summary cards)
// ---------------------------------------------------------------------------
router.get('/history', async (req, res) => {
  try {
    const analyses = await prisma.analysis.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        jobTitle: true,
        resumeFileName: true,
        matchScore: true,
        matchingSkills: true,
        missingSkills: true,
        createdAt: true,
        learningRoadmap: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        count: analyses.length,
        analyses: analyses.map((a) => {
          const source = a.learningRoadmap?.source || 'fallback';
          return {
            id: a.id,
            jobTitle: a.jobTitle,
            resumeFileName: a.resumeFileName,
            matchScore: a.matchScore,
            matchingSkills: a.matchingSkills,
            missingSkills: a.missingSkills,
            matchedCount: a.matchingSkills.length,
            missingCount: a.missingSkills.length,
            createdAt: a.createdAt,
            source,
          };
        }),
      },
    });
  } catch (err) {
    console.error('History fetch error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history.',
    });
  }
});

// ---------------------------------------------------------------------------
// GET /api/analysis/:id
// Return full details of a single saved analysis
// ---------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: `Analysis with id "${id}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    console.error('Analysis fetch error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis.',
    });
  }
});

module.exports = router;
