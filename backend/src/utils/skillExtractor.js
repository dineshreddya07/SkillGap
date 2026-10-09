/**
 * Comprehensive technical skills dictionary for SkillGap.
 * Each entry has:
 * - name: Normalized standard skill display name
 * - patterns: Array of Regex patterns or keywords to match (case-insensitive)
 * - category: Skill classification (Programming, Web, Database, Cloud/DevOps, Data/AI, Core CS)
 */
const SKILL_DICTIONARY = [
  // Programming Languages
  { name: 'Java', patterns: [/\bjava\b/i], category: 'Programming' },
  { name: 'Python', patterns: [/\bpython\b/i], category: 'Programming' },
  { name: 'JavaScript', patterns: [/\bjavascript\b/i, /\bjs\b/i], category: 'Programming' },
  { name: 'TypeScript', patterns: [/\btypescript\b/i, /\bts\b/i], category: 'Programming' },
  { name: 'C', patterns: [/\bc\b/i], category: 'Programming' },
  { name: 'C++', patterns: [/\bc\+\+\b/i, /\bcpp\b/i], category: 'Programming' },
  { name: 'C#', patterns: [/\bc#\b/i, /\bc-sharp\b/i], category: 'Programming' },
  { name: 'Go', patterns: [/\bgolang\b/i, /\bgo\b/i], category: 'Programming' },
  { name: 'PHP', patterns: [/\bphp\b/i], category: 'Programming' },
  { name: 'Kotlin', patterns: [/\bkotlin\b/i], category: 'Programming' },
  { name: 'Swift', patterns: [/\bswift\b/i], category: 'Programming' },
  { name: 'SQL', patterns: [/\bsql\b/i], category: 'Programming' },

  // Web & Backend
  { name: 'HTML', patterns: [/\bhtml\b/i, /\bhtml5\b/i], category: 'Web' },
  { name: 'CSS', patterns: [/\bcss\b/i, /\bcss3\b/i], category: 'Web' },
  { name: 'React', patterns: [/\breact(\.js)?\b/i, /\breactjs\b/i], category: 'Web' },
  { name: 'Angular', patterns: [/\bangular(\.js)?\b/i, /\bangularjs\b/i], category: 'Web' },
  { name: 'Vue', patterns: [/\bvue(\.js)?\b/i, /\bvuejs\b/i], category: 'Web' },
  { name: 'Node.js', patterns: [/\bnode(\.js)?\b/i, /\bnodejs\b/i], category: 'Web' },
  { name: 'Express', patterns: [/\bexpress(\.js)?\b/i, /\bexpressjs\b/i], category: 'Web' },
  { name: 'Spring Boot', patterns: [/\bspring\s*boot\b/i, /\bspring\b/i], category: 'Web' },
  { name: 'REST API', patterns: [/\brest\s*api(s)?\b/i, /\brestful\b/i, /\brest\b/i], category: 'Web' },

  // Databases
  { name: 'MySQL', patterns: [/\bmysql\b/i], category: 'Databases' },
  { name: 'PostgreSQL', patterns: [/\bpostgres(ql)?\b/i], category: 'Databases' },
  { name: 'MongoDB', patterns: [/\bmongo(db)?\b/i], category: 'Databases' },
  { name: 'Redis', patterns: [/\bredis\b/i], category: 'Databases' },
  { name: 'Oracle', patterns: [/\boracle\b/i, /\boracle\s*db\b/i], category: 'Databases' },

  // Cloud & DevOps
  { name: 'AWS', patterns: [/\baws\b/i, /\bamazon\s*web\s*services\b/i], category: 'Cloud/DevOps' },
  { name: 'Azure', patterns: [/\bazure\b/i, /\bmicrosoft\s*azure\b/i], category: 'Cloud/DevOps' },
  { name: 'GCP', patterns: [/\bgcp\b/i, /\bgoogle\s*cloud(\s*platform)?\b/i], category: 'Cloud/DevOps' },
  { name: 'Docker', patterns: [/\bdocker\b/i], category: 'Cloud/DevOps' },
  { name: 'Kubernetes', patterns: [/\bkubernetes\b/i, /\bk8s\b/i], category: 'Cloud/DevOps' },
  { name: 'Git', patterns: [/\bgit\b/i], category: 'Cloud/DevOps' },
  { name: 'GitHub', patterns: [/\bgithub\b/i], category: 'Cloud/DevOps' },
  { name: 'Jenkins', patterns: [/\bjenkins\b/i], category: 'Cloud/DevOps' },
  { name: 'CI/CD', patterns: [/\bci\s*\/\s*cd\b/i, /\bcicd\b/i], category: 'Cloud/DevOps' },

  // Data & AI
  { name: 'Machine Learning', patterns: [/\bmachine\s*learning\b/i, /\bml\b/i], category: 'Data/AI' },
  { name: 'Deep Learning', patterns: [/\bdeep\s*learning\b/i, /\bdl\b/i], category: 'Data/AI' },
  { name: 'Artificial Intelligence', patterns: [/\bartificial\s*intelligence\b/i, /\bai\b/i], category: 'Data/AI' },
  { name: 'NLP', patterns: [/\bnlp\b/i, /\bnatural\s*language\s*processing\b/i], category: 'Data/AI' },
  { name: 'Pandas', patterns: [/\bpandas\b/i], category: 'Data/AI' },
  { name: 'NumPy', patterns: [/\bnumpy\b/i], category: 'Data/AI' },
  { name: 'TensorFlow', patterns: [/\btensorflow\b/i], category: 'Data/AI' },
  { name: 'PyTorch', patterns: [/\bpytorch\b/i], category: 'Data/AI' },
  { name: 'Scikit-learn', patterns: [/\bscikit-learn\b/i, /\bsklearn\b/i], category: 'Data/AI' },

  // Core CS Concepts & Tools
  { name: 'Data Structures', patterns: [/\bdata\s*structures?\b/i, /\bdsa\b/i], category: 'Core CS' },
  { name: 'Algorithms', patterns: [/\balgorithms?\b/i], category: 'Core CS' },
  { name: 'OOP', patterns: [/\boop\b/i, /\bobject\s*oriented\s*programming\b/i], category: 'Core CS' },
  { name: 'DBMS', patterns: [/\bdbms\b/i, /\bdatabase\s*management(\s*system)?\b/i], category: 'Core CS' },
  { name: 'Operating Systems', patterns: [/\boperating\s*systems?\b/i, /\bos\b/i], category: 'Core CS' },
  { name: 'Computer Networks', patterns: [/\bcomputer\s*networks?\b/i, /\bnetworking\b/i], category: 'Core CS' },
  { name: 'Figma', patterns: [/\bfigma\b/i], category: 'Design/Tools' },
];

/**
 * Extracts skills from input text using the technical skills dictionary.
 * Normalizes input, handles aliases/case-insensitivity, and removes duplicates.
 *
 * @param {string} text - Raw text from resume or job description
 * @returns {string[]} Array of unique detected skill names
 */
function extractSkills(text) {
  if (!text || typeof text !== 'string') return [];

  // Lowercase & normalize spaces for consistent boundary checking
  const normalizedText = ` ${text.toLowerCase().replace(/[\r\n\t]/g, ' ')} `;
  const extractedSkills = new Set();

  for (const skill of SKILL_DICTIONARY) {
    // Check if any pattern for this skill matches
    const matched = skill.patterns.some((pattern) => pattern.test(normalizedText));
    if (matched) {
      // Guard against false positives for very short keywords like 'c', 'go', 'ai', 'os'
      if (skill.name === 'C') {
        // Must appear near programming contexts or clear boundaries
        const cPattern = /(?:programming\s+in\s+c\b|\bc\s+language\b|\bc\s*,\s*c\+\+|\bc\+\+\s*,\s*c\b|\bc\s*\/\s*c\+\+)/i;
        if (!cPattern.test(text)) continue;
      } else if (skill.name === 'Go') {
        const goPattern = /\b(golang|go\s+language|programming\s+in\s+go)\b/i;
        if (!goPattern.test(text)) continue;
      } else if (skill.name === 'Operating Systems' && /\bos\b/i.test(normalizedText) && !/operating\s*systems?/i.test(text)) {
        // Avoid loose 'os' matches unless full term is present or clear context
        if (!/\b(linux|unix|windows|operating\s*system)\b/i.test(text)) continue;
      }

      extractedSkills.add(skill.name);
    }
  }

  return Array.from(extractedSkills);
}

module.exports = {
  SKILL_DICTIONARY,
  extractSkills,
};
