const db = require('../config/db');  // db.js dosyasını import et

// Kullanıcıyı veritabanından bulma
const findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows;  // Bulunan kullanıcıları döndürüyoruz
};

// Kullanıcıyı oluşturma
const createUser = async (name, email, password, role, isVerified) => {
  const [result] = await db.execute('INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)', [name, email, password, role, isVerified]);
  return result;  // Yeni kullanıcının sonucu
};

module.exports = { findByEmail, createUser };
