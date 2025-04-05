const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const [existing] = await User.findByEmail(email);
  if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create(name, email, hashed);

  res.status(201).json({ message: 'User created' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const [users] = await User.findByEmail(email);
  const user = users[0];
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};

const profile = async (req, res) => {
  const [user] = await User.findById(req.userId);
  res.json(user[0]);
};

module.exports = { register, login, profile };
