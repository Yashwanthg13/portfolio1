const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3007;

// GitHub API token - in production, this should be an environment variable
// You'll need to set this in your Vercel environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Log a warning if GitHub token is not set
if (!GITHUB_TOKEN) {
  console.warn('GitHub API token not set. API rate limits will be restricted.');
}

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Explicitly define routes for CSS files
app.get('*.css', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, req.path));
});

// Explicitly define routes for JS files
app.get('*.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, req.path));
});

// Handle contact form submissions
app.post('/send-message', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Log the form submission (for now, since we don't have actual email setup)
    console.log('Form submission received:');
    console.log({ name, email, subject, message });
    
    // In a real application, you would set up nodemailer here
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({...});
    
    // For now, just return success
    res.status(200).json({ success: true, message: 'Message received! I will get back to you soon.' });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

// GitHub API proxy endpoints
app.get('/api/github/user/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Portfolio-Website',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
      }
    };

    const githubReq = https.request(options, (githubRes) => {
      let data = '';
      
      githubRes.on('data', (chunk) => {
        data += chunk;
      });
      
      githubRes.on('end', () => {
        if (githubRes.statusCode === 200) {
          res.json(JSON.parse(data));
        } else {
          console.error(`GitHub API error: ${githubRes.statusCode}`);
          res.status(githubRes.statusCode).json({ error: 'Error fetching GitHub data' });
        }
      });
    });
    
    githubReq.on('error', (error) => {
      console.error('Error fetching GitHub data:', error);
      res.status(500).json({ error: 'Error fetching GitHub data' });
    });
    
    githubReq.end();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/github/repos/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}/repos?sort=updated&per_page=10`,
      method: 'GET',
      headers: {
        'User-Agent': 'Portfolio-Website',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
      }
    };

    const githubReq = https.request(options, (githubRes) => {
      let data = '';
      
      githubRes.on('data', (chunk) => {
        data += chunk;
      });
      
      githubRes.on('end', () => {
        if (githubRes.statusCode === 200) {
          res.json(JSON.parse(data));
        } else {
          console.error(`GitHub API error: ${githubRes.statusCode}`);
          res.status(githubRes.statusCode).json({ error: 'Error fetching GitHub repos' });
        }
      });
    });
    
    githubReq.on('error', (error) => {
      console.error('Error fetching GitHub repos:', error);
      res.status(500).json({ error: 'Error fetching GitHub repos' });
    });
    
    githubReq.end();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fallback route to serve index.html for any other routes (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
