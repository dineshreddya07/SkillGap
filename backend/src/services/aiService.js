/**
 * backend/src/services/aiService.js
 * AI Career Analysis Service with Provider Abstraction, Strict JSON Validation, and Resilient Fallbacks.
 */

const { generateRecommendations: getDeterministicRecommendations } = require('./recommendationService');
const { generateRoadmap: getDeterministicRoadmap } = require('./roadmapService');

/**
 * Builds the AI prompt with strict constraints:
 * - Analyze only supplied skills and job details.
 * - No hallucinated skills.
 * - Return valid JSON conforming strictly to schema.
 */
function buildAIPrompt({
  jobTitle,
  jobDescription,
  resumeSkills = [],
  requiredSkills = [],
  matchingSkills = [],
  missingSkills = [],
  matchScore = 0,
}) {
  return `You are an expert technical career advisor for software engineers and students.
Analyze the candidate's skill profile against the target job posting.

IMPORTANT CONSTRAINTS:
1. Analyze ONLY the supplied skills and information below.
2. Do NOT invent, assume, or hallucinate skills not mentioned in the resume or job description.
3. Prioritize missing skills needed for the target job.
4. Keep all recommendations realistic for a student/entry-level candidate.
5. Limit the learning roadmap to a MAXIMUM of 6 logical steps ordered from foundational prerequisites to advanced tools.
6. Provide output strictly in valid raw JSON with NO markdown code blocks, NO HTML, and NO conversational filler.

INPUT DATA:
- Target Job Title: ${jobTitle || 'Software Developer'}
- Job Description:
"""
${(jobDescription || '').slice(0, 3000)}
"""
- Candidate Resume Skills: ${JSON.stringify(resumeSkills)}
- Required Job Skills: ${JSON.stringify(requiredSkills)}
- Matching Skills: ${JSON.stringify(matchingSkills)}
- Missing Skills (Gaps): ${JSON.stringify(missingSkills)}
- Calculated Match Score: ${matchScore}%

OUTPUT JSON SCHEMA:
{
  "summary": "Concise 2-3 sentence overview of the candidate's match, key strengths, and highest priority gaps.",
  "skillPriorities": [
    {
      "skill": "Skill name exactly from missing skills",
      "priority": "High | Medium | Low",
      "reason": "Why this skill is needed for this specific role",
      "whyItMatters": "Impact on candidate employability and day-to-day work"
    }
  ],
  "recommendations": [
    {
      "skill": "Skill name from missing skills",
      "recommendation": "Concrete, actionable learning guidance for this skill",
      "practiceProject": "A specific beginner-friendly project to prove proficiency"
    }
  ],
  "roadmap": [
    {
      "step": 1,
      "skill": "Skill name",
      "title": "Learn <Skill>",
      "duration": "Estimated time (e.g., 2-3 weeks)",
      "goal": "Measurable milestone to accomplish",
      "prerequisite": null
    }
  ]
}`;
}

/**
 * Cleans potential markdown formatting, whitespace, or code fences from AI output.
 */
function cleanAIResponseText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let cleaned = rawText.trim();
  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Validates the structured JSON parsed from AI.
 * Ensures all required fields and subfields are present and valid.
 *
 * @param {object} parsed
 * @param {string[]} missingSkills
 * @returns {boolean}
 */
function validateAIAnalysis(parsed, missingSkills = []) {
  if (!parsed || typeof parsed !== 'object') return false;

  // 1. summary
  if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) {
    return false;
  }

  // If no missing skills were present, empty arrays are valid
  if (!missingSkills || missingSkills.length === 0) {
    return Array.isArray(parsed.recommendations) && Array.isArray(parsed.roadmap);
  }

  // 2. skillPriorities
  if (!Array.isArray(parsed.skillPriorities)) return false;
  for (const item of parsed.skillPriorities) {
    if (!item.skill || !item.priority || !item.whyItMatters) return false;
    const p = String(item.priority).toLowerCase();
    if (!['high', 'medium', 'low'].includes(p)) return false;
  }

  // 3. recommendations
  if (!Array.isArray(parsed.recommendations) || parsed.recommendations.length === 0) {
    return false;
  }
  for (const rec of parsed.recommendations) {
    if (!rec.skill || !rec.recommendation) return false;
  }

  // 4. roadmap
  if (!Array.isArray(parsed.roadmap) || parsed.roadmap.length === 0) {
    return false;
  }
  if (parsed.roadmap.length > 6) {
    // Trim to 6 max instead of failing if slightly over
    parsed.roadmap = parsed.roadmap.slice(0, 6);
  }
  for (const step of parsed.roadmap) {
    if (!step.step || !step.skill || !step.title || !step.duration || !step.goal) {
      return false;
    }
  }

  return true;
}

/**
 * Calls Gemini REST API using native fetch with timeout.
 */
async function callGeminiProvider(prompt, apiKey, model = 'gemini-1.5-flash', timeoutMs = 12000) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Gemini API returned status ${response.status}: ${errText.slice(0, 150)}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls OpenAI-compatible REST API using native fetch with timeout.
 */
async function callOpenAIProvider(prompt, apiKey, model = 'gpt-4o-mini', timeoutMs = 12000) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenAI API returned status ${response.status}: ${errText.slice(0, 150)}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Creates deterministic fallback data matching the AI analysis schema.
 */
function getFallbackAnalysis({
  jobTitle,
  resumeSkills = [],
  matchingSkills = [],
  missingSkills = [],
  matchScore = 0,
}) {
  if (!missingSkills || missingSkills.length === 0) {
    return {
      summary: `Your profile matches 100% of the required skills identified for ${jobTitle || 'this role'}! All required skills are already present on your resume.`,
      skillPriorities: [],
      recommendations: [],
      roadmap: [],
    };
  }

  const deterministicRecs = getDeterministicRecommendations(missingSkills);
  const deterministicRoadmap = getDeterministicRoadmap(missingSkills);

  const skillPriorities = deterministicRecs.map((r) => ({
    skill: r.skill,
    priority: r.priority,
    reason: `Required skill for ${jobTitle || 'the target position'}.`,
    whyItMatters: `Strengthening ${r.skill} directly addresses a core requirement for this role.`,
  }));

  const recommendations = deterministicRecs.map((r) => ({
    skill: r.skill,
    recommendation: r.reason,
    practiceProject: `Build a small portfolio project applying ${r.skill} in an end-to-end scenario.`,
  }));

  const roadmap = (deterministicRoadmap.steps || []).map((s) => ({
    step: s.step,
    skill: s.skill,
    title: s.title,
    duration: s.duration,
    goal: s.goal,
    prerequisite: null,
  }));

  const summary = `Your resume has a ${matchScore}% match with the ${jobTitle || 'target'} role. ` +
    (matchingSkills.length > 0
      ? `Your background in ${matchingSkills.slice(0, 4).join(', ')} provides a solid foundation. `
      : 'No required skills matched your resume. ') +
    `Focus on learning ${missingSkills.slice(0, 3).join(', ')} to close the primary skill gaps.`;

  return {
    summary,
    skillPriorities,
    recommendations,
    roadmap,
  };
}

/**
 * Main service entrypoint.
 * Attempts AI-driven career analysis; falls back automatically on any failure or missing key.
 *
 * @param {object} params
 * @returns {Promise<{ source: 'ai' | 'fallback', data: object }>}
 */
async function generateCareerAnalysis(params) {
  const {
    jobTitle,
    jobDescription,
    resumeSkills = [],
    requiredSkills = [],
    matchingSkills = [],
    missingSkills = [],
    matchScore = 0,
  } = params;

  // Case 1: Empty missing skills -> no AI generation needed
  if (!missingSkills || missingSkills.length === 0) {
    return {
      source: 'ai',
      data: {
        summary: `Excellent match! All required skills identified for ${jobTitle || 'this role'} are covered by your resume.`,
        skillPriorities: [],
        recommendations: [],
        roadmap: [],
      },
    };
  }

  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();
  const apiKey = (process.env.AI_API_KEY || '').trim();
  const model = (process.env.AI_MODEL || '').trim() || (provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');

  // Case 2: API key not configured -> immediately use fallback safely
  if (!apiKey || apiKey === 'your_ai_api_key_here') {
    return {
      source: 'fallback',
      data: getFallbackAnalysis({
        jobTitle,
        resumeSkills,
        matchingSkills,
        missingSkills,
        matchScore,
      }),
    };
  }

  // Case 3: Call AI Provider with safety & validation
  try {
    const prompt = buildAIPrompt({
      jobTitle,
      jobDescription,
      resumeSkills,
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchScore,
    });

    let rawOutput = null;
    if (provider === 'openai') {
      rawOutput = await callOpenAIProvider(prompt, apiKey, model);
    } else {
      // Default to Google Gemini
      rawOutput = await callGeminiProvider(prompt, apiKey, model);
    }

    const cleanedText = cleanAIResponseText(rawOutput);
    const parsed = JSON.parse(cleanedText);

    if (validateAIAnalysis(parsed, missingSkills)) {
      return {
        source: 'ai',
        data: parsed,
      };
    } else {
      console.warn('AI analysis validation failed. Reverting to deterministic fallback.');
    }
  } catch (err) {
    // Safe error log without printing any secrets or keys
    console.warn(`AI Provider unavailable or error occurred: ${err.message || 'Unknown'}. Reverting to fallback.`);
  }

  // Graceful Fallback
  return {
    source: 'fallback',
    data: getFallbackAnalysis({
      jobTitle,
      resumeSkills,
      matchingSkills,
      missingSkills,
      matchScore,
    }),
  };
}

module.exports = {
  generateCareerAnalysis,
  validateAIAnalysis,
  getFallbackAnalysis,
  buildAIPrompt,
  cleanAIResponseText,
};
