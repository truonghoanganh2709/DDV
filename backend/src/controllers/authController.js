import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  const { name = '', email, password, phone = '', address = '' } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email va mat khau la bat buoc' });

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(400).json({ message: 'Email da duoc su dung' });

  const hashed = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name,
    email: String(email).toLowerCase().trim(),
    password: hashed,
    phone,
    address,
    role: 'user'
  });

  const token = signToken(user._id);
  return res.status(201).json({ token, user: user.toSafeJSON() });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email va mat khau la bat buoc' });

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Email hoac mat khau khong dung' });
  if (user.locked || !user.isActive) return res.status(403).json({ message: 'Tai khoan da bi khoa' });

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) return res.status(401).json({ message: 'Email hoac mat khau khong dung' });

  const token = signToken(user._id);
  return res.json({ token, user: user.toSafeJSON() });
}

export async function getProfile(req, res) {
  return res.json({ user: req.user.toSafeJSON() });
}

export async function updateProfile(req, res) {
  const { name, phone, address, password } = req.body || {};

  if (typeof name === 'string') req.user.name = name;
  if (typeof phone === 'string') req.user.phone = phone;
  if (typeof address === 'string') req.user.address = address;

  if (password) {
    req.user.password = await bcrypt.hash(String(password), 10);
  }

  await req.user.save();
  return res.json({ user: req.user.toSafeJSON() });
}

