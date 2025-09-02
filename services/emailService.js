const nodemailer = require('nodemailer');

/**
 * Creates an email transporter using nodemailer
 * @returns {nodemailer.Transporter} Email transporter
 */
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Sends a confirmation email to the user
 * @param {string} email - User's email address
 * @param {string} confirmationToken - Email confirmation token
 * @returns {Promise<object>} Email send information
 */
const sendConfirmationEmail = async (email, confirmationToken) => {
  try {
    const transporter = createEmailTransporter();
    
    const confirmationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/confirm-email/${confirmationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm Your Email - Quiz App',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #4CAF50;">Welcome to Quiz App!</h2>
          <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `
    };

    // Send the email without logging details
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error details:', error);
    throw error;
  }
};

/**
 * Sends a password reset email to the user
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<object>} Email send information
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createEmailTransporter();
    
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - Quiz App',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Password reset email sending error details:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail
};
