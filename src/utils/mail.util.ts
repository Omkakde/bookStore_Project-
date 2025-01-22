
import {createTransport} from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.SMTP_MAIL}`, 
    pass: `${process.env.SMTP_PASS}`  
  }
});

export async function sendPasswordResetToken(toEmail: string,
    verificationToken: string) {
    
  try {
    const mailOptions = {
      from: `"Your App" <${process.env.SMTP_MAIL}>`, 
      to: toEmail,
      subject: 'Reset Password Token', 
       html: `<p><strong>Token: ${verificationToken}</strong></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
export async function sendOrderSuccessful(toEmail: string, orderTotal: number): Promise<void> {
  try {
    const mailOptions = {
      from: `"EbookStore" <${process.env.SMTP_MAIL}>`, 
      to: toEmail,
      subject: 'Order Confirmation - EbookStore',
      html: `
        <div>
          <h3 style="color: #4CAF50;">Order Confirmed</h3>
          <p>Thank you for your order from <strong>EbookStore</strong>!</p>
          <p><strong>Total Amount Paid: ₹${orderTotal}</strong></p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending order email to ${toEmail}:`, error);
  }
}
