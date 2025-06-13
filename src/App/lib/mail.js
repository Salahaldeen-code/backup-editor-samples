import nodemailer from 'nodemailer';

/**
 * Create Nodemailer transporter with environment variables
 */
const createTransporter = () => {
  // Configure transporter using environment variables
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Optional settings for better deliverability
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' // Reject unauthorized TLS/SSL certs in production
    }
  });
};

/**
 * Send email using Nodemailer
 * 
 * @param {object} mailOptions - Email options (to, subject, html, etc.)
 * @returns {Promise} - Nodemailer info object
 */
export async function sendMail(mailOptions) {
  try {
    // Create transporter
    const transporter = createTransporter();
    
    // Set default from address if not provided
    if (!mailOptions.from) {
      mailOptions.from = process.env.EMAIL_FROM || '"Email Builder" <noreply@example.com>';
    }
    
    // Verify connection configuration
    await transporter.verify();
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Add preview URL for Ethereal emails
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      info.previewUrl = nodemailer.getTestMessageUrl(info);
    }
    
    console.log(`Email sent: ${info.messageId}`);
    return info;
    
  } catch (error) {
    console.error('Error in sendMail:', error);
    throw error;
  }
}
