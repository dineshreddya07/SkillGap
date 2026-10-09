const fs = require('fs');
const http = require('http');

async function testUpload(filePath, fileName, mimeType) {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileData = fs.readFileSync(filePath);

  const payloadHeader = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`
  );
  const payloadFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([payloadHeader, fileData, payloadFooter]);

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/resume/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Testing TXT upload...');
    const txtRes = await testUpload('sample_resume.txt', 'sample_resume.txt', 'text/plain');
    console.log('TXT result:', txtRes.statusCode, txtRes.body.success, txtRes.body.data.detectedFileType, 'Text len:', txtRes.body.data.textLength);

    console.log('Testing PDF upload...');
    const pdfRes = await testUpload('sample_resume.pdf', 'sample_resume.pdf', 'application/pdf');
    console.log('PDF result:', pdfRes.statusCode, pdfRes.body.success, pdfRes.body.data.detectedFileType, 'Text:', pdfRes.body.data.extractedText);

    console.log('Testing unsupported file...');
    fs.writeFileSync('sample_test.png', 'fake image data');
    const imgRes = await testUpload('sample_test.png', 'sample_test.png', 'image/png');
    console.log('Image result:', imgRes.statusCode, imgRes.body.success, imgRes.body.message);

    console.log('Testing no-file submission...');
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = Buffer.from(`--${boundary}--\r\n`);
    const noFileReq = new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/resume/upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      }, (res) => {
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
    const noFileRes = await noFileReq;
    console.log('No-file result:', noFileRes.statusCode, noFileRes.body.success, noFileRes.body.message);
  } catch (err) {
    console.error('Test error:', err);
  }
})();
