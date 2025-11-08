const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration using environment variables
// Supports generic SMTP (e.g., Zoho), specific service (e.g., Gmail), with sensible defaults
const createTransporter = () => {
  // If explicit SMTP host is provided, prefer that (Zoho recommended)
  if (process.env.EMAIL_HOST) {
    const port = Number(process.env.EMAIL_PORT || 465);
    const secure = typeof process.env.EMAIL_SECURE === 'string'
      ? process.env.EMAIL_SECURE.toLowerCase() === 'true'
      : port === 465; // default secure for 465

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure, // true for 465, false for 587/STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
      // For some providers you may need: requireTLS: true (587), or custom tls options
      // tls: { rejectUnauthorized: false }
    });
  }

  // Fallback to service name if provided (e.g., 'gmail')
  if (process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Default to Gmail service for backward compatibility
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Quote request email endpoint
router.post('/quote', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      company,
      origin, 
      destination, 
      weight, 
      dimensions, 
      cargoType, 
      serviceType, 
      urgency, 
      message 
    } = req.body;

    const transporter = createTransporter();

    // Email to admin/business owner
    const adminEmailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@your-domain.com',
  to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'info@cargocapital.com',
      subject: `New Quote Request from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); padding: 32px 0; text-align: center;">
                <span style="font-size: 40px;">🚛</span>
                <h1 style="color: #fff; margin: 8px 0 0 0; font-size: 2rem; letter-spacing: 1px;">Cargo Express</h1>
                <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 1.1rem;">New Quote Request</p>
              </td>
            </tr>
            <tr><td style="padding: 32px;">
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Customer Information</h2>
              <table style="width: 100%; margin-bottom: 24px;">
                <tr><td style="color: #64748b; font-weight: bold; width: 30%; padding: 6px 0;">Name:</td><td style="color: #1e293b;">${name}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Email:</td><td style="color: #1e293b;">${email}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Phone:</td><td style="color: #1e293b;">${phone || 'Not provided'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Company:</td><td style="color: #1e293b;">${company || 'Not provided'}</td></tr>
              </table>
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Shipment Details</h2>
              <table style="width: 100%; margin-bottom: 24px;">
                <tr><td style="color: #64748b; font-weight: bold; width: 30%; padding: 6px 0;">Origin:</td><td style="color: #1e293b;">${origin}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Destination:</td><td style="color: #1e293b;">${destination}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Weight:</td><td style="color: #1e293b;">${weight || 'Not specified'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Dimensions:</td><td style="color: #1e293b;">${dimensions || 'Not specified'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Cargo Type:</td><td style="color: #1e293b;">${cargoType || 'Not specified'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Service Type:</td><td style="color: #1e293b;">${serviceType || 'Not specified'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Urgency:</td><td style="color: #1e293b;">${urgency || 'Not specified'}</td></tr>
              </table>
              ${message ? `<div style="background: #f1f5f9; padding: 18px; border-radius: 8px; margin-bottom: 24px;"><h3 style="color: #1e293b; margin: 0 0 8px 0;">Additional Message</h3><p style="color: #334155; margin: 0;">${message}</p></div>` : ''}
              <div style="text-align: center; margin: 32px 0 0 0;">
                <a href="mailto:${email}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 32px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 1rem;">Reply to Customer</a>
              </div>
            </td></tr>
            <tr>
              <td style="background: #f1f5f9; text-align: center; padding: 18px 0; color: #64748b; font-size: 0.95rem;">
                Capital Cargo &bull; Kathmandu, Nepal &bull; +977-01-5367883, 01-5368837<br/>
                <span style="color: #94a3b8;">This is an automated notification. Please respond promptly.</span>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    // Confirmation email to customer
    const customerEmailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@your-domain.com',
      to: email,
      subject: 'Quote Request Received - Cargo Express',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); padding: 32px 0; text-align: center;">
                <span style="font-size: 40px;">🚛</span>
                <h1 style="color: #fff; margin: 8px 0 0 0; font-size: 2rem; letter-spacing: 1px;">Cargo Express</h1>
                <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 1.1rem;">Quote Request Confirmation</p>
              </td>
            </tr>
            <tr><td style="padding: 32px;">
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Hello ${name}!</h2>
              <p style="color: #334155; font-size: 1.05rem; margin-bottom: 18px;">Thank you for your quote request. We have received your inquiry for shipping from <strong>${origin}</strong> to <strong>${destination}</strong>. Our team will review your requirements and get back to you within 24 hours with a competitive quote.</p>
              <h3 style="color: #1e293b; font-size: 1.1rem; margin-bottom: 10px;">Your Request Summary:</h3>
              <ul style="color: #334155; font-size: 1rem; margin-bottom: 24px;">
                <li><strong>Origin:</strong> ${origin}</li>
                <li><strong>Destination:</strong> ${destination}</li>
                <li><strong>Service Type:</strong> ${serviceType || 'To be determined'}</li>
                <li><strong>Urgency:</strong> ${urgency || 'Standard'}</li>
              </ul>
              <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; margin-bottom: 24px; color: #64748b;">
                Need urgent assistance? Contact us at:<br/>
                <span style="font-weight: bold; color: #2563eb;">📞 +977-01-5367883, 01-5368837 | ✉️ info@cargocapital.com</span>
              </div>
            </td></tr>
            <tr>
              <td style="background: #f1f5f9; text-align: center; padding: 18px 0; color: #64748b; font-size: 0.95rem;">
                Capital Cargo &bull; Kathmandu, Nepal &bull; +977-01-5367883, 01-5368837<br/>
                <span style="color: #94a3b8;">This is an automated confirmation. No reply needed.</span>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminEmailOptions);
    await transporter.sendMail(customerEmailOptions);

    res.json({
      success: true,
      message: 'Quote request sent successfully! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Quote email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send quote request. Please try again later.'
    });
  }
});

// Contact form email endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const transporter = createTransporter();

    // Email to admin/business owner (Contact)
    const adminEmailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@your-domain.com',
  to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'info@cargocapital.com',
      subject: `Contact Form: ${subject || 'New Message'} - from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); padding: 32px 0; text-align: center;">
                <span style="font-size: 40px;">🚛</span>
                <h1 style="color: #fff; margin: 8px 0 0 0; font-size: 2rem; letter-spacing: 1px;">Cargo Express</h1>
                <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 1.1rem;">New Contact Form Message</p>
              </td>
            </tr>
            <tr><td style="padding: 32px;">
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Contact Information</h2>
              <table style="width: 100%; margin-bottom: 24px;">
                <tr><td style="color: #64748b; font-weight: bold; width: 25%; padding: 6px 0;">Name:</td><td style="color: #1e293b;">${name}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Email:</td><td style="color: #1e293b;">${email}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Phone:</td><td style="color: #1e293b;">${phone || 'Not provided'}</td></tr>
                <tr><td style="color: #64748b; font-weight: bold; padding: 6px 0;">Subject:</td><td style="color: #1e293b;">${subject || 'General Inquiry'}</td></tr>
              </table>
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Message</h2>
              <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; margin-bottom: 24px; color: #334155;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="text-align: center; margin: 32px 0 0 0;">
                <a href="mailto:${email}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 32px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 1rem;">Reply to Customer</a>
              </div>
            </td></tr>
            <tr>
              <td style="background: #f1f5f9; text-align: center; padding: 18px 0; color: #64748b; font-size: 0.95rem;">
                Capital Cargo &bull; Kathmandu, Nepal &bull; +977-01-5367883, 01-5368837<br/>
                <span style="color: #94a3b8;">This is an automated notification. Please respond promptly.</span>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    // Confirmation email to customer (Contact)
    const customerEmailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@your-domain.com',
      to: email,
      subject: 'Message Received - Thank You for Contacting Cargo Express',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f8fb; padding: 0; margin: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); padding: 32px 0; text-align: center;">
                <span style="font-size: 40px;">🚛</span>
                <h1 style="color: #fff; margin: 8px 0 0 0; font-size: 2rem; letter-spacing: 1px;">Cargo Express</h1>
                <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 1.1rem;">Message Confirmation</p>
              </td>
            </tr>
            <tr><td style="padding: 32px;">
              <h2 style="color: #1e293b; font-size: 1.3rem; margin-bottom: 16px;">Hello ${name}!</h2>
              <p style="color: #334155; font-size: 1.05rem; margin-bottom: 18px;">Thank you for reaching out to us. We have received your message and greatly appreciate your interest in our cargo services. Our support team will review your message and respond within 24 hours. We are committed to providing you with the best shipping solutions.</p>
              <h3 style="color: #1e293b; font-size: 1.1rem; margin-bottom: 10px;">Your Message Summary:</h3>
              <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; margin-bottom: 24px; color: #64748b;">
                <p style="margin: 0;"><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 0; color: #334155; background: #fff; padding: 10px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="background: #f1f5f9; padding: 18px; border-radius: 8px; margin-bottom: 24px; color: #64748b;">
                Need immediate assistance? Contact us at:<br/>
                <span style="font-weight: bold; color: #2563eb;">📞 +977-01-5367883, 01-5368837 | ✉️ info@cargocapital.com</span>
              </div>
            </td></tr>
            <tr>
              <td style="background: #f1f5f9; text-align: center; padding: 18px 0; color: #64748b; font-size: 0.95rem;">
                Capital Cargo &bull; Kathmandu, Nepal &bull; +977-01-5367883, 01-5368837<br/>
                <span style="color: #94a3b8;">This is an automated confirmation. No reply needed.</span>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminEmailOptions);
    await transporter.sendMail(customerEmailOptions);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;