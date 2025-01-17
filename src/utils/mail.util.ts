
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

    