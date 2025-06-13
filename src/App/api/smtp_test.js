// SMTP Connection Test Script
import nodemailer from 'nodemailer';

// SMTP Configuration - Update these values with your actual SMTP details
const config = {
  host: 'smtp.gmail.com',  // Replace with your actual SMTP server
  port: 587,               // Common ports: 587 (TLS) or 465 (SSL)
  secure: false,           // true for 465, false for other ports
  auth: {
    user: '772000946salahi@gmail.com',  // Your email address
    pass: 'exsmhrydvjqqxvsf'            // Your email password or app password
  },
  connectionTimeout: 10000, // 10 seconds timeout
  tls: {
    rejectUnauthorized: false // Set to true in production
  }
};

// Create a transporter
const transporter = nodemailer.createTransport(config);

// Test the connection
async function testConnection() {
  console.log('Testing SMTP connection...');
  console.log(`Server: ${config.host}:${config.port}`);
  console.log(`User: ${config.auth.user}`);
  
  try {
    // Verify connection configuration
    const result = await transporter.verify();
    console.log('✅ SMTP connection successful!');
    console.log('Your SMTP configuration is correct.');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error(`Error: ${error.message}`);
    
    // Provide troubleshooting guidance based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\nTroubleshooting tips:');
      console.log('- Check if the SMTP server hostname is correct');
      console.log('- Verify the port number is correct');
      console.log('- Ensure your network/firewall allows connections to this server and port');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\nTroubleshooting tips:');
      console.log('- The connection attempt timed out');
      console.log('- Check if the SMTP server is reachable from your network');
      console.log('- Verify there are no firewall restrictions');
    } else if (error.code === 'EAUTH') {
      console.log('\nTroubleshooting tips:');
      console.log('- Your username or password is incorrect');
      console.log('- For Gmail, you may need to create an App Password');
      console.log('- Check if your email provider requires additional security settings');
    } else {
      console.log('\nTroubleshooting tips:');
      console.log('- Double-check all SMTP settings');
      console.log('- For Gmail, ensure "Less secure app access" is enabled or use App Password');
      console.log('- Try a different port (587 for TLS or 465 for SSL)');
      console.log('- Contact your email provider for specific SMTP requirements');
    }
    
    return false;
  }
}

// Run the test
testConnection();
