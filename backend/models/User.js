const db = require('../config/db');

const User = {
  create: (name, email, password) => {
    return db.execute(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, password]
    );
  },
  findByEmail: (email) => {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  },
  findById: (id) => {
    return db.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
  },
};

module.exports = User;
