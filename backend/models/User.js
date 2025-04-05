const db = require('../config/db');  // db.js dosyasını import et

const findByEmail = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows;  // Bulunan kullanıcıları döndürüyoruz
};


// Kullanıcıyı oluşturma
const createUser = async (name, email, password, role, isVerified) => {
  const [result] = await db.execute('INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)', [name, email, password, role, isVerified]);
  return result;  // Yeni kullanıcının sonucu
};

// Kullanıcıyı doğrulama durumu ile güncelleme
const updateUserVerificationStatus = async (email, isVerified) => {
  await db.query('UPDATE users SET is_verified = ? WHERE email = ?', [isVerified, email]);
};

module.exports = { findByEmail, createUser, updateUserVerificationStatus  };
