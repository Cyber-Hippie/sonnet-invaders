const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static files from the 'src' directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve the main game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Serve the audio test page
app.get('/audio-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'audio-test.html'));
});

// Serve the simple test page
app.get('/simple-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'simple-test.html'));
});

// Serve the simple audio test page
app.get('/audio-test-simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'audio-test-simple.html'));
});

// Serve the audio test page with CSP
app.get('/audio-test-csp', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'audio-test-csp.html'));
});

// Serve the basic audio test page
app.get('/audio-test-basic', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'audio-test-basic.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Audio test available at http://localhost:${PORT}/audio-test`);
  console.log(`Simple test available at http://localhost:${PORT}/simple-test`);
  console.log(`Simple audio test available at http://localhost:${PORT}/audio-test-simple`);
  console.log(`Audio test with CSP available at http://localhost:${PORT}/audio-test-csp`);
  console.log(`Basic audio test available at http://localhost:${PORT}/audio-test-basic`);
}); 