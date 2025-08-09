const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth:{
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

//send email function 
exports.sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
    const mailOptions = {
        from: `${process.env.EMAIL_FROM}`,
        to: email,
        subject: 'Email Verification',
        html:`
           <h2>Please verify your email</h2>
           <p>Click the link below to verify your email address:</p>
           <a href="${verificationUrl}">Verify Email</a>
           <p>This link will expire in 1 hour.</p>
           <p>If you didn't create an account, please ignore this email.</p>
        `
    };
    return transporter.sendMail(mailOptions)
};


//send password reset email function 
exports.sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password/${token}`;// this is the URL where the user can reset their password
    const mailOptions = {
        from: `${process.env.EMAIL_FROM}`,
        to: email,
        subject: 'Password Reset',
        html:`
           <h2>Password Reset Request</h2>
           <p>Click the link below to reset your password:</p>
           <a href="${resetUrl}">Reset Password</a>
           <p>This link will expire in 1 hour.</p>
           <p>If you didn't request a password reset, please ignore this email.</p>
        `
    };
    return transporter.sendMail(mailOptions)
}
