/**
 * Personalized learning roadmap generator for SkillGap.
 * No paid AI API is used.
 * Generates a maximum of 6 steps ordered by skill learning dependency.
 */

// Canonical learning order: fundamentals first, then specializations
const SKILL_ORDER = [
  // Core CS fundamentals
  'Data Structures',
  'Algorithms',
  'OOP',
  'Operating Systems',
  'Computer Networks',
  'DBMS',
  // Core languages
  'C',
  'C++',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'C#',
  'Go',
  'PHP',
  'Kotlin',
  'Swift',
  // Web basics
  'HTML',
  'CSS',
  'SQL',
  // Databases
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Oracle',
  'Redis',
  // Web frameworks
  'Node.js',
  'Express',
  'React',
  'Angular',
  'Vue',
  'Spring Boot',
  'REST API',
  // Version control
  'Git',
  'GitHub',
  // Data/AI
  'NumPy',
  'Pandas',
  'Machine Learning',
  'Deep Learning',
  'Artificial Intelligence',
  'NLP',
  'Scikit-learn',
  'TensorFlow',
  'PyTorch',
  // Cloud/DevOps
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'CI/CD',
  'Jenkins',
  'Kubernetes',
  // Design
  'Figma',
];

// Roadmap detail per skill
const SKILL_ROADMAP_DETAILS = {
  'Data Structures': { duration: '3–4 weeks', goal: 'Understand and implement arrays, linked lists, stacks, queues, trees, and graphs.' },
  Algorithms: { duration: '3–4 weeks', goal: 'Learn searching, sorting, recursion, dynamic programming, and complexity analysis.' },
  OOP: { duration: '2 weeks', goal: 'Understand classes, objects, inheritance, polymorphism, and SOLID principles.' },
  'Operating Systems': { duration: '3 weeks', goal: 'Learn process management, memory, file systems, and scheduling.' },
  'Computer Networks': { duration: '2–3 weeks', goal: 'Study TCP/IP, HTTP, DNS, routing, and network security basics.' },
  DBMS: { duration: '2–3 weeks', goal: 'Learn normalization, transactions, ACID properties, and basic SQL.' },
  C: { duration: '3–4 weeks', goal: 'Learn syntax, pointers, memory management, and system-level programming.' },
  'C++': { duration: '4–5 weeks', goal: 'Master C++ OOP, STL, templates, and memory management.' },
  Java: { duration: '4–6 weeks', goal: 'Build strong Java fundamentals, OOP, collections, and modern Java features.' },
  Python: { duration: '3–4 weeks', goal: 'Learn Python syntax, functions, modules, and practical scripting.' },
  JavaScript: { duration: '4–5 weeks', goal: 'Master ES6+, async programming, DOM manipulation, and API consumption.' },
  TypeScript: { duration: '2–3 weeks', goal: 'Add types, interfaces, and generics to JavaScript projects.' },
  'C#': { duration: '4–5 weeks', goal: 'Learn C# OOP, LINQ, async/await, and .NET fundamentals.' },
  Go: { duration: '3–4 weeks', goal: 'Learn Go syntax, goroutines, channels, and building simple REST services.' },
  PHP: { duration: '3–4 weeks', goal: 'Learn PHP for web development, forms, and server-side scripting.' },
  Kotlin: { duration: '3–4 weeks', goal: 'Learn Kotlin for Android or JVM backend development.' },
  Swift: { duration: '3–4 weeks', goal: 'Build basic iOS applications using Swift and UIKit or SwiftUI.' },
  HTML: { duration: '1–2 weeks', goal: 'Learn semantic HTML5, forms, and accessibility fundamentals.' },
  CSS: { duration: '2–3 weeks', goal: 'Master Flexbox, Grid, responsive design, and modern CSS techniques.' },
  SQL: { duration: '3–4 weeks', goal: 'Practice SQL queries, joins, aggregation, indexes, and schema design.' },
  MySQL: { duration: '2–3 weeks', goal: 'Learn MySQL setup, queries, relationships, and integration with backend apps.' },
  PostgreSQL: { duration: '2–3 weeks', goal: 'Learn PostgreSQL advanced features, indexing, and backend integration.' },
  MongoDB: { duration: '2–3 weeks', goal: 'Learn MongoDB CRUD, aggregation, indexing, and schema design.' },
  Oracle: { duration: '3–4 weeks', goal: 'Study Oracle SQL, PL/SQL, and enterprise database concepts.' },
  Redis: { duration: '1–2 weeks', goal: 'Learn Redis data structures, caching patterns, and common use cases.' },
  'Node.js': { duration: '3–4 weeks', goal: 'Build scalable backend services using Node.js and asynchronous patterns.' },
  Express: { duration: '2–3 weeks', goal: 'Build REST APIs with Express, middleware, routing, and validation.' },
  React: { duration: '4–5 weeks', goal: 'Build dynamic UIs using React components, hooks, state, and routing.' },
  Angular: { duration: '4–5 weeks', goal: 'Master Angular components, services, dependency injection, and reactive forms.' },
  Vue: { duration: '3–4 weeks', goal: 'Build Vue applications using reactivity, Vue Router, and Pinia.' },
  'Spring Boot': { duration: '4–5 weeks', goal: 'Build enterprise REST APIs with Spring Boot, JPA, and PostgreSQL integration.' },
  'REST API': { duration: '2 weeks', goal: 'Learn REST design, HTTP methods, status codes, auth, and API best practices.' },
  Git: { duration: '1–2 weeks', goal: 'Master branching, commits, merging, rebasing, and collaborative workflows.' },
  GitHub: { duration: '1 week', goal: 'Practice pull requests, code reviews, GitHub Actions, and project collaboration.' },
  NumPy: { duration: '1–2 weeks', goal: 'Learn array operations, broadcasting, and numerical computing with NumPy.' },
  Pandas: { duration: '2–3 weeks', goal: 'Analyze and manipulate datasets using Pandas DataFrames.' },
  'Machine Learning': { duration: '6–8 weeks', goal: 'Study supervised/unsupervised learning, preprocessing, and model evaluation.' },
  'Deep Learning': { duration: '6–8 weeks', goal: 'Learn neural networks, CNNs, RNNs, and frameworks like TensorFlow or PyTorch.' },
  'Artificial Intelligence': { duration: '4–6 weeks', goal: 'Study AI principles, search, reasoning, and practical applications.' },
  NLP: { duration: '3–4 weeks', goal: 'Learn text preprocessing, embeddings, and core NLP tasks.' },
  'Scikit-learn': { duration: '2–3 weeks', goal: 'Apply ML algorithms using Scikit-learn for classification, regression, and clustering.' },
  TensorFlow: { duration: '4–5 weeks', goal: 'Build, train, and deploy deep learning models using TensorFlow.' },
  PyTorch: { duration: '4–5 weeks', goal: 'Build and train neural networks with PyTorch autograd and model API.' },
  AWS: { duration: '4–6 weeks', goal: 'Learn core AWS services (EC2, S3, IAM, Lambda, RDS) and deploy an application.' },
  Azure: { duration: '4–6 weeks', goal: 'Learn Azure VMs, App Service, Storage, and identity management.' },
  GCP: { duration: '4–6 weeks', goal: 'Explore Compute Engine, Cloud Storage, BigQuery, and Cloud Run.' },
  Docker: { duration: '2–3 weeks', goal: 'Containerize applications using Docker images, Dockerfiles, volumes, and compose.' },
  'CI/CD': { duration: '2–3 weeks', goal: 'Design CI/CD pipelines with automated testing, builds, and deployments.' },
  Jenkins: { duration: '2 weeks', goal: 'Set up Jenkins pipelines for automated builds and testing.' },
  Kubernetes: { duration: '4–5 weeks', goal: 'Orchestrate containers with Kubernetes pods, deployments, and services.' },
  Figma: { duration: '1–2 weeks', goal: 'Design wireframes, prototypes, and UI components with Figma.' },
};

/**
 * Generate a personalized, ordered learning roadmap for missing skills.
 * Returns at most 6 steps ordered by learning dependency.
 *
 * @param {string[]} missingSkills - Array of missing skill names
 * @returns {{ steps: Array<{step, skill, title, duration, goal}>, message: string }}
 */
function generateRoadmap(missingSkills = []) {
  if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
    return {
      steps: [],
      message: 'No missing skills detected. Your profile is a strong match for this role!',
    };
  }

  // Deduplicate
  const unique = [...new Set(missingSkills)];

  // Sort by canonical order; unknown skills go at the end
  const sorted = unique.sort((a, b) => {
    const ia = SKILL_ORDER.indexOf(a);
    const ib = SKILL_ORDER.indexOf(b);
    const rankA = ia === -1 ? 999 : ia;
    const rankB = ib === -1 ? 999 : ib;
    return rankA - rankB;
  });

  // Limit to 6 most important (already ordered by dependency)
  const selected = sorted.slice(0, 6);

  const steps = selected.map((skill, index) => {
    const detail = SKILL_ROADMAP_DETAILS[skill] || {
      duration: '2–4 weeks',
      goal: `Learn the fundamentals of ${skill} and apply them in a small project.`,
    };

    return {
      step: index + 1,
      skill,
      title: `Learn ${skill}`,
      duration: detail.duration,
      goal: detail.goal,
    };
  });

  const message =
    missingSkills.length > 6
      ? `Showing the 6 most important skills to learn first out of ${missingSkills.length} missing skills.`
      : `Your personalized ${steps.length}-step learning roadmap is ready.`;

  return { steps, message };
}

module.exports = { generateRoadmap };
