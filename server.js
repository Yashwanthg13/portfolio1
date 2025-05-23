const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('./'));

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

// Fallback route to serve index.html for any other routes (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
