const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmailVerification } = require('../utils/emailService');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Bearer token'dan token'ı ayıklıyoruz

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // JWT token'ı doğrulama
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Token'dan email bilgisini alıyoruz ve req objesine ekliyoruz
    req.userEmail = decoded.email;
    next();  // İşlem başarılıysa bir sonraki middleware'e geçiyoruz
  });
};

// Kullanıcı kaydı
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // E-posta kontrolü
  try {
    const existing = await User.findByEmail(email);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Şifreyi hashleme
    const hashed = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluşturma (is_verified 'false' olarak başlangıçta)
    await User.createUser(name, email, hashed, 'user', false);

    // E-posta doğrulama token'ı oluşturma ve gönderme
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendEmailVerification(email, token);

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Kullanıcı girişi
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await User.findByEmail(email);
    const user = users[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // E-posta doğrulama kontrolü
    if (!user.is_verified) return res.status(400).json({ message: 'Email not verified' });

    // Şifreyi kontrol etme
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    // JWT token oluşturma (email bilgisi de dahil ediliyor)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const profile = async (req, res) => {
  const email = req.userEmail;  // Artık email'i auth middleware'den alıyoruz
  
  if (!email) {
    return res.status(400).json({ message: 'Email not found in request' });
  }

  try {
    const user = await User.findByEmail(email);  // Kullanıcıyı email ile veritabanında buluyoruz
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kullanıcı profil bilgilerini döndürme
    res.json({
      id: user[0].id,  // Eğer array döndürüyorsa, ilk elemanı alıyoruz
      name: user[0].name,
      email: user[0].email,
      role: user[0].role,
      is_verified: user[0].is_verified,
      created_at: user[0].created_at,
      last_login: user[0].last_login,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Email doğrulama
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is missing' });
  }

  try {
    // Token'ı doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Kullanıcıyı bulma ve is_verified'ı güncelleme
    const users = await User.findByEmail(email);
    const user = users[0];
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Veritabanında is_verified'ı güncelleme
    await User.updateUserVerificationStatus(email, true);

    res.status(200).send(`<h2>✅ Your email has been successfully verified!</h2><p>You can now log in.</p>`);
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


module.exports = { register, login, profile, verifyEmail, verifyToken };
