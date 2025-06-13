// Combined Email Server with React API integration and content debugging
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express server
const app = express();
const PORT = 3001;

// Built-in configuration (no need for .env file)
const CONFIG = {
  // Email Configuration
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,
  EMAIL_SECURE: false,
  EMAIL_USER: '772000946salahi@gmail.com',
  EMAIL_PASSWORD: 'exsmhrydvjqqxvsf',
  EMAIL_FROM: '772000946salahi@gmail.com',
  
  // Next.js Configuration
  NEXT_PUBLIC_API_URL: 'http://localhost:3000',
  
  // CORS Configuration
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // <-- Add this line
    '*'
  ],  
  // Timeout settings
  CONNECTION_TIMEOUT: 15000, // 15 seconds
  SEND_TIMEOUT: 30000 // 30 seconds
};

// Enhanced logging function
const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp}: ${message}`);
    
    // Also log to file
    fs.appendFileSync(`${__dirname}/server.log`, `[INFO] ${timestamp}: ${message}\n`);
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp}: ${message}`, error);
    
    // Also log to file with stack trace
    fs.appendFileSync(
      `${__dirname}/server.log`, 
      `[ERROR] ${timestamp}: ${message}\n${error?.stack || error}\n`
    );
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp}: ${message}`);
    
    // Also log to file
    fs.appendFileSync(`${__dirname}/server.log`, `[WARN] ${timestamp}: ${message}\n`);
  },
  debug: (message, obj = null) => {
    const timestamp = new Date().toISOString();
    if (obj) {
      console.debug(`[DEBUG] ${timestamp}: ${message}`, obj);
      fs.appendFileSync(`${__dirname}/server.log`, `[DEBUG] ${timestamp}: ${message} ${JSON.stringify(obj)}\n`);
    } else {
      console.debug(`[DEBUG] ${timestamp}: ${message}`);
      fs.appendFileSync(`${__dirname}/server.log`, `[DEBUG] ${timestamp}: ${message}\n`);
    }
  }
};

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (CONFIG.ALLOWED_ORIGINS.includes('*') || CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Increased limit for email templates
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Create Nodemailer transporter
const createTransporter = () => {
  logger.info('Creating email transporter');
  return nodemailer.createTransport({
    host: CONFIG.EMAIL_HOST,
    port: CONFIG.EMAIL_PORT,
    secure: CONFIG.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: CONFIG.EMAIL_USER,
      pass: CONFIG.EMAIL_PASSWORD,
    },
    connectionTimeout: CONFIG.CONNECTION_TIMEOUT,
    greetingTimeout: CONFIG.CONNECTION_TIMEOUT,
    socketTimeout: CONFIG.SEND_TIMEOUT,
    tls: {
      rejectUnauthorized: false // Set to true in production
    }
  });
};

// Email validation function
const validateEmailRequest = (data) => {
  logger.info('Validating email request');
  
  // Basic validation
  if (!data) {
    return { error: { details: [{ message: 'Request body is required' }] } };
  }
  
  if (!data.recipients || !data.recipients.to || !Array.isArray(data.recipients.to) || data.recipients.to.length === 0) {
    return { error: { details: [{ message: 'At least one recipient is required' }] } };
  }
  
  if (!data.subject) {
    return { error: { details: [{ message: 'Subject is required' }] } };
  }
  
  // Check for template HTML content
  if (!data.template) {
    return { error: { details: [{ message: 'Email template is required' }] } };
  }
  
  // More detailed HTML content validation
  if (!data.template.html || typeof data.template.html !== 'string' || data.template.html.trim() === '') {
    logger.warn('Empty or invalid HTML template received');
    // Don't fail validation, we'll use a fallback template
  }
  
  // If validation passes, return the data
  return { value: data };
};

// Send email function with improved error handling and content validation
const sendMail = async (mailOptions) => {
  try {
    logger.info(`Preparing to send email to: ${mailOptions.to}`);
    
    // Check for empty HTML content and use fallback if needed
    if (!mailOptions.html || typeof mailOptions.html !== 'string' || mailOptions.html.trim() === '') {
      logger.warn('No HTML content found, using fallback template');
      mailOptions.html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h1 { color: #2c3e50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${mailOptions.subject || 'Email Notification'}</h1>
              <p>${mailOptions.text || 'This is a fallback email template.'}</p>
              <p>This email was sent because the original template was empty or invalid.</p>
            </div>
          </body>
        </html>
      `;
    }
    
    // Create transporter
    const transporter = createTransporter();
    
    // Set default from address if not provided
    if (!mailOptions.from) {
      mailOptions.from = CONFIG.EMAIL_FROM;
      logger.info(`Using default from address: ${CONFIG.EMAIL_FROM}`);
    }
    
    // Send email directly (skip verification)
    logger.info('Sending email...');
    logger.debug('Email content preview:', mailOptions.html.substring(0, 200) + '...');
    
    // Use Promise.race to implement timeout for sending
    const sendPromise = transporter.sendMail(mailOptions);
    const sendTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Email sending timed out after ${CONFIG.SEND_TIMEOUT/1000} seconds`));
      }, CONFIG.SEND_TIMEOUT);
    });
    
    const info = await Promise.race([sendPromise, sendTimeoutPromise]);
    
    logger.info(`Email sent successfully: ${info.messageId}`);
    return info;
    
  } catch (error) {
    logger.error('Error in sendMail:', error);
    throw error;
  }
};

// Mock email sending function for testing
const mockSendMail = async (mailOptions) => {
  logger.info(`[MOCK] Preparing to send email to: ${mailOptions.to}`);
  logger.debug('[MOCK] Email content preview:', mailOptions.html.substring(0, 200) + '...');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  logger.info('[MOCK] Email sent successfully');
  return {
    messageId: `mock-${Date.now()}@localhost`,
    response: 'Mock email sent successfully'
  };
};

// API Routes
app.post('/api/send-email', async (req, res) => {
  try {
    logger.info('Received request to /api/send-email');
    
    // Log request body structure for debugging
    logger.debug('Request body structure:', {
      hasRecipients: !!req.body.recipients,
      hasSubject: !!req.body.subject,
      hasTemplate: !!req.body.template,
      hasHtml: req.body.template && !!req.body.template.html,
      hasJson: req.body.template && !!req.body.template.json
    });
    
    // Validate request body
    const { error, value } = validateEmailRequest(req.body);
    
    if (error) {
      logger.warn(`Validation error: ${error.details[0].message}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: error.details[0].message
      });
    }
    
    // Extract validated data
    const { recipients, subject, message, isTest, template } = value;
    
    // Log HTML content for debugging
    if (template && template.html) {
      logger.info(`Template HTML received (first 100 chars): ${template.html.substring(0, 100)}...`);
    } else {
      logger.warn('No HTML template content received');
    }
    
    // Prepare email data
    const mailOptions = {
      to: recipients.to.join(', '),
      cc: recipients.cc && recipients.cc.length > 0 ? recipients.cc.join(', ') : undefined,
      bcc: recipients.bcc && recipients.bcc.length > 0 ? recipients.bcc.join(', ') : undefined,
      subject: isTest ? `[TEST] ${subject}` : subject,
      text: message || 'Please view this email in an HTML compatible email client.',
      html: template && template.html ? template.html : '<p>No HTML content provided</p>',
      // Add attachments if available
      attachments: req.body.attachments
    };
    
    // Check if we should use mock mode
    const useMockMode = req.query.mock === 'true' || req.body.mock === true;
    
    // Send email (real or mock)
    let info;
    if (useMockMode) {
      info = await mockSendMail(mailOptions);
      logger.info('Used mock email sending mode');
    } else {
      info = await sendMail(mailOptions);
    }
    
    // Return success response
    logger.info('Successfully sent email, returning response');
    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      mock: useMockMode,
      config: {
        emailHost: CONFIG.EMAIL_HOST,
        emailPort: CONFIG.EMAIL_PORT,
        emailSecure: CONFIG.EMAIL_SECURE
      },
      contentStatus: template && template.html ? 'HTML content included' : 'No HTML content'
    });
    
  } catch (error) {
    logger.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
      suggestion: "If you're having SMTP connection issues, try using mock mode by adding ?mock=true to the URL"
    });
  }
});

// Debug endpoint to check template content
app.post('/api/debug-template', (req, res) => {
  logger.info('Received request to /api/debug-template');
  
  try {
    const template = req.body.template;
    const hasTemplate = !!template;
    const hasHtml = hasTemplate && !!template.html;
    const htmlLength = hasHtml ? template.html.length : 0;
    const htmlPreview = hasHtml ? template.html.substring(0, 200) : '';
    
    return res.status(200).json({
      success: true,
      debug: {
        hasTemplate,
        hasHtml,
        htmlLength,
        htmlPreview
      }
    });
  } catch (error) {
    logger.error('Error in debug endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing template debug',
      error: error.message
    });
  }
});

// Email stats endpoint
app.get('/api/email-stats', (req, res) => {
  logger.info('Received request to /api/email-stats');
  
  // This is a placeholder implementation
  const stats = {
    success: true,
    data: {
      total: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      recent: []
    },
    message: "Email statistics retrieved successfully"
  };
  
  return res.status(200).json(stats);
});

// Test endpoint
app.get('/api/test', (req, res) => {
  logger.info('Received request to /api/test');
  
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    method: req.method,
    config: {
      emailHost: CONFIG.EMAIL_HOST,
      emailPort: CONFIG.EMAIL_PORT,
      nextPublicApiUrl: CONFIG.NEXT_PUBLIC_API_URL
    }
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server started successfully`);
  logger.info(`API server running on port ${PORT}`);
  logger.info(`Email configuration: ${CONFIG.EMAIL_HOST}:${CONFIG.EMAIL_PORT}`);
  logger.info(`Next.js API URL: ${CONFIG.NEXT_PUBLIC_API_URL}`);
  logger.info(`Ready to receive requests from React frontend`);
});
