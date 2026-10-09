/**
 * Deterministic and transparent matching engine for SkillGap.
 *
 * Scoring methodology:
 * 1. Matched Skills: Intersection of candidate's skills and job-required skills.
 * 2. Missing Skills: Job-required skills that the candidate does not have.
 * 3. Additional Skills: Candidate skills not explicitly mentioned in the job description.
 * 4. Transparent Match Score Calculation:
 *    - If no skills are required by the job: defaults to 0% (or 100% if candidate has skills and job has no criteria).
 *    - Match Percentage = round((Matched Skills Count / Total Required Skills Count) * 100)
 *    - Bounded safely between 0% and 100%.
 *
 * @param {string[]} resumeSkills - Skills extracted from the candidate's resume
 * @param {string[]} requiredSkills - Skills extracted from the job description
 * @returns {object} Matching results with matchedSkills, missingSkills, additionalSkills, matchScore, and summary breakdown.
 */
function calculateSkillMatch(resumeSkills = [], requiredSkills = []) {
  const resumeSet = new Set((resumeSkills || []).map((s) => s.toLowerCase()));
  const requiredSet = new Set((requiredSkills || []).map((s) => s.toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];
  const additionalSkills = [];

  // Identify matching and missing skills from required list
  for (const skill of requiredSkills || []) {
    if (resumeSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Identify additional candidate skills not in job description
  for (const skill of resumeSkills || []) {
    if (!requiredSet.has(skill.toLowerCase())) {
      additionalSkills.push(skill);
    }
  }

  // Calculate score
  let matchScore = 0;
  const totalRequired = requiredSkills.length;
  const totalMatched = matchedSkills.length;

  if (totalRequired > 0) {
    matchScore = Math.min(100, Math.max(0, Math.round((totalMatched / totalRequired) * 100)));
  } else if (resumeSkills.length > 0) {
    matchScore = 100;
  }

  return {
    matchScore,
    totalRequired,
    totalMatched,
    totalMissing: missingSkills.length,
    matchedSkills,
    missingSkills,
    additionalSkills,
    explanation:
      totalRequired > 0
        ? `Matched ${totalMatched} out of ${totalRequired} required skills (${matchScore}% match).`
        : 'No specific technical skills were detected in the job description.',
  };
}

module.exports = {
  calculateSkillMatch,
};
