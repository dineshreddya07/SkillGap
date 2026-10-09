const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  let dbStatus = 'Disconnected';
  let dbError = null;

  try {
    // Check database connectivity safely with a quick query
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'Connected';
  } catch (error) {
    dbStatus = 'Disconnected';
    dbError = error.message;
  }

  res.json({
    success: true,
    data: {
      backend: 'Connected',
      database: dbStatus,
      ...(dbError && { databaseMessage: 'Database connection failed or not configured' }),
    },
  });
});

module.exports = router;
