const nodemailer = require('nodemailer');

const sendEmailVerification = async (email, token) => {
  try {
    // SMTP servisini yapılandırıyoruz
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gmail servisi
      auth: {
        user: 'apitronic06@gmail.com', // Sabit e-posta adresi (gönderici)
        pass: 'ivax fqrd gdiu jioz',  // 16 haneli uygulama şifresi
      },
    });

    // E-posta doğrulama URL'sini oluşturuyoruz
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    // E-posta içeriği
    const mailOptions = {
      from: 'apitronic06@gmail.com', // Gönderen e-posta adresi
      to: email, // Alıcı e-posta adresi
      subject: 'Email Verification', // E-posta konusu
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`, // E-posta metni
    };

    // E-postayı gönderiyoruz
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending verification email');
  }
};

module.exports = { sendEmailVerification };
