/**
 * Deterministic, rule-based recommendation engine for SkillGap.
 * No paid AI API is used.
 */

// Priority mapping: High, Medium, or Low for each known skill
const SKILL_PRIORITY = {
  Java: 'High',
  Python: 'High',
  JavaScript: 'High',
  TypeScript: 'Medium',
  'C#': 'Medium',
  'C++': 'Medium',
  C: 'Medium',
  Go: 'Medium',
  PHP: 'Medium',
  Kotlin: 'Medium',
  Swift: 'Medium',
  SQL: 'High',
  HTML: 'Medium',
  CSS: 'Medium',
  React: 'Medium',
  Angular: 'Medium',
  Vue: 'Medium',
  'Node.js': 'Medium',
  Express: 'Medium',
  'Spring Boot': 'Medium',
  'REST API': 'Medium',
  MySQL: 'Medium',
  PostgreSQL: 'Medium',
  MongoDB: 'Medium',
  Redis: 'Low',
  Oracle: 'Low',
  AWS: 'Medium',
  Azure: 'Medium',
  GCP: 'Medium',
  Docker: 'Medium',
  Kubernetes: 'Low',
  Git: 'High',
  GitHub: 'Medium',
  Jenkins: 'Low',
  'CI/CD': 'Low',
  'Machine Learning': 'Medium',
  'Deep Learning': 'Medium',
  'Artificial Intelligence': 'Medium',
  NLP: 'Low',
  Pandas: 'Medium',
  NumPy: 'Medium',
  TensorFlow: 'Low',
  PyTorch: 'Low',
  'Scikit-learn': 'Low',
  'Data Structures': 'High',
  Algorithms: 'High',
  OOP: 'High',
  DBMS: 'Medium',
  'Operating Systems': 'Medium',
  'Computer Networks': 'Medium',
  Figma: 'Low',
};

// Specific recommendation text for each known skill
const SKILL_RECOMMENDATIONS = {
  Java: 'Strengthen Java fundamentals, OOP, collections, exception handling, and modern Java development.',
  Python: 'Practice Python syntax, functions, object-oriented programming, modules, and practical scripting.',
  JavaScript: 'Practice modern JavaScript including ES6+, functions, asynchronous programming, promises, and APIs.',
  TypeScript: 'Learn TypeScript types, interfaces, generics, and how to use TypeScript with existing JavaScript projects.',
  'C#': 'Learn C# syntax, object-oriented programming, collections, LINQ, and ASP.NET basics.',
  'C++': 'Practice C++ fundamentals, memory management, OOP, and standard libraries.',
  C: 'Learn C programming basics, pointers, memory management, and system-level concepts.',
  Go: 'Learn Go language fundamentals, concurrency patterns, goroutines, and building simple services.',
  PHP: 'Practice PHP syntax, web forms, databases, and building simple server-side applications.',
  Kotlin: 'Learn Kotlin syntax, null safety, coroutines, and Android or backend development basics.',
  Swift: 'Learn Swift syntax, optionals, protocols, and build basic iOS applications.',
  SQL: 'Practice SQL queries, joins, aggregation, subqueries, indexes, and database design.',
  HTML: 'Learn HTML5 elements, semantic structure, forms, and accessibility fundamentals.',
  CSS: 'Practice CSS layout models (Flexbox, Grid), responsive design, and styling best practices.',
  React: 'Learn React components, props, state, hooks, routing, and API integration.',
  Angular: 'Learn Angular components, services, dependency injection, routing, and reactive forms.',
  Vue: 'Learn Vue components, directives, reactivity system, Vue Router, and Pinia/Vuex.',
  'Node.js': 'Learn Node.js fundamentals, asynchronous programming, Express integration, and REST APIs.',
  Express: 'Practice building REST APIs, middleware, routing, validation, and error handling with Express.',
  'Spring Boot': 'Learn Spring Boot fundamentals, REST controllers, dependency injection, services, repositories, and database integration.',
  'REST API': 'Learn REST principles, HTTP methods, status codes, authentication, and API design best practices.',
  MySQL: 'Learn MySQL queries, relationships, indexing, constraints, and application integration.',
  PostgreSQL: 'Learn PostgreSQL queries, relationships, indexing, constraints, and application integration.',
  MongoDB: 'Learn MongoDB CRUD operations, documents, collections, indexes, aggregation, and application integration.',
  Redis: 'Learn Redis data structures, caching patterns, pub/sub, and common use cases.',
  Oracle: 'Learn Oracle SQL, PL/SQL fundamentals, and database design basics.',
  AWS: 'Learn AWS fundamentals including EC2, S3, IAM, networking, and basic cloud deployment.',
  Azure: 'Learn Azure services including VMs, App Service, Storage, and identity management.',
  GCP: 'Learn GCP services including Compute Engine, Cloud Storage, and Cloud Run.',
  Docker: 'Learn Docker images, containers, Dockerfiles, volumes, networking, and containerized application deployment.',
  Kubernetes: 'Learn Kubernetes concepts, pods, deployments, services, and orchestrating containerized applications.',
  Git: 'Practice Git version control including branches, commits, merging, pull requests, and collaboration.',
  GitHub: 'Learn GitHub workflows, pull requests, code reviews, GitHub Actions, and collaborative development.',
  Jenkins: 'Learn Jenkins pipelines, build automation, and integrating tests into CI/CD workflows.',
  'CI/CD': 'Learn continuous integration and delivery concepts, pipeline design, and automated testing.',
  'Machine Learning': 'Study supervised and unsupervised learning, preprocessing, model evaluation, and common ML algorithms.',
  'Deep Learning': 'Learn neural networks, backpropagation, convolutional and recurrent architectures, and deep learning frameworks.',
  'Artificial Intelligence': 'Study AI fundamentals, search algorithms, knowledge representation, and practical applications.',
  NLP: 'Learn text preprocessing, tokenization, embeddings, and common NLP tasks and libraries.',
  Pandas: 'Practice data manipulation, cleaning, grouping, merging, and analysis with Pandas.',
  NumPy: 'Learn array operations, broadcasting, linear algebra basics, and numerical computing with NumPy.',
  TensorFlow: 'Learn TensorFlow model building, training pipelines, and deployment basics.',
  PyTorch: 'Learn PyTorch tensors, autograd, model definition, training loops, and evaluation.',
  'Scikit-learn': 'Practice using Scikit-learn for classification, regression, clustering, and model evaluation.',
  'Data Structures': 'Practice arrays, linked lists, stacks, queues, trees, graphs, hashing, and algorithmic problem solving.',
  Algorithms: 'Practice searching, sorting, recursion, greedy algorithms, dynamic programming, and complexity analysis.',
  OOP: 'Strengthen understanding of classes, objects, inheritance, polymorphism, encapsulation, and SOLID principles.',
  DBMS: 'Learn database concepts, normalization, transactions, ACID properties, and query optimization.',
  'Operating Systems': 'Study OS concepts including processes, threads, memory management, file systems, and scheduling.',
  'Computer Networks': 'Learn networking models, TCP/IP, HTTP, DNS, routing, and network security fundamentals.',
  Figma: 'Learn Figma for creating wireframes, prototypes, and UI design collaboration.',
};

/**
 * Generate learning recommendations for a list of missing skills.
 *
 * @param {string[]} missingSkills - Array of missing skill names
 * @returns {Array<{ skill, reason, priority }>}
 */
function generateRecommendations(missingSkills = []) {
  if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
    return [];
  }

  return missingSkills.map((skill) => {
    const priority = SKILL_PRIORITY[skill] || 'Medium';
    const reason =
      SKILL_RECOMMENDATIONS[skill] ||
      `Learn the fundamentals of ${skill}, practice common real-world use cases, and build a small project using it.`;

    return { skill, reason, priority };
  });
}

module.exports = { generateRecommendations };
