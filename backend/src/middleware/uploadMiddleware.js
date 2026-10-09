const multer = require('multer');
const path = require('path');

// Use memory storage so we can parse text in-memory without accumulating temp files
const storage = multer.memoryStorage();

// Allowed file extensions and MIME types
const allowedExtensions = ['.pdf', '.docx', '.txt'];
const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/octet-stream', // Some browsers / clients send octet-stream for docx/txt
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Allowed formats: PDF, DOCX, TXT.`), false);
  }
};

// Max file size: 5MB limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;
