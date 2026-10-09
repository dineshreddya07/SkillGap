// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');
const resumeRouter = require('./routes/resumeRoutes');
const jobRouter = require('./routes/jobRoutes');
const analysisRouter = require('./routes/analysisRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/job-description', jobRouter);
app.use('/api/analysis', analysisRouter);

// 404 handler
app.use(notFound);
// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
