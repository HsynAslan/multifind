const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmailVerification } = require('../utils/emailService');

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

  // Kullanıcıyı email ile bulma
  try {
    const users = await User.findByEmail(email);
    const user = users[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // E-posta doğrulama kontrolü
    if (!user.is_verified) return res.status(400).json({ message: 'Email not verified' });

    // Şifreyi kontrol etme
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    // JWT token oluşturma
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Kullanıcı profil bilgileri
const profile = async (req, res) => {
  try {
    const [user] = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Kullanıcı profil bilgilerini döndürme
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      created_at: user.created_at,
      last_login: user.last_login,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { register, login, profile };
