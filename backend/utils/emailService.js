const nodemailer = require('nodemailer');

const sendEmailVerification = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'apitronic06@gmail.com',
        pass: 'ivax fqrd gdiu jioz',
      },
    });

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: 'apitronic06@gmail.com',
      to: email,
      subject: '🔐 Verify Your Email - MultiFind',
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4CAF50; text-align: center;">👋 Welcome to MultiFind!</h2>
            <p style="font-size: 16px; color: #333;">
              Thank you for signing up! Please verify your email address to activate your account. 👇
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-size: 16px;">
                ✅ Verify My Email
              </a>
            </div>
            <p style="font-size: 14px; color: #999;">
              If the button above doesn't work, please copy and paste this URL into your browser:
              <br />
              <a href="${verificationUrl}" style="color: #4CAF50;">${verificationUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              🚀 MultiFind Team<br />
              This email was sent to ${email}. If you didn't request it, you can safely ignore it.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent!');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Error sending verification email');
  }
};

module.exports = { sendEmailVerification };
