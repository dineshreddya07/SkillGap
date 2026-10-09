const path = require('path');
const pdfParseModule = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw readable text from uploaded file buffer.
 * Supports PDF, DOCX, and TXT files.
 *
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} originalname - Original file name
 * @returns {Promise<{ text: string, fileType: string }>}
 */
async function extractResumeText(buffer, originalname) {
  const ext = path.extname(originalname).toLowerCase();
  let text = '';
  let fileType = '';

  if (ext === '.pdf') {
    fileType = 'PDF';
    // Support both function-style pdf-parse (v1.x) and class-style PDFParse (v2.x)
    if (typeof pdfParseModule === 'function') {
      const data = await pdfParseModule(buffer);
      text = data.text || '';
    } else if (pdfParseModule.PDFParse) {
      const uint8 = new Uint8Array(buffer);
      const parser = new pdfParseModule.PDFParse(uint8);
      const data = await parser.getText();
      text = typeof data === 'string' ? data : (data.text || '');
    } else {
      throw new Error('Unable to initialize PDF parser engine.');
    }
  } else if (ext === '.docx') {
    fileType = 'DOCX';
    const docxData = await mammoth.extractRawText({ buffer });
    text = docxData.value || '';
  } else if (ext === '.txt') {
    fileType = 'TXT';
    text = buffer.toString('utf-8');
  } else {
    throw new Error(`Unsupported file extension: ${ext}`);
  }

  // Normalize extra whitespace while preserving readable line breaks
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  return {
    text: cleanedText,
    fileType,
  };
}

module.exports = {
  extractResumeText,
};
