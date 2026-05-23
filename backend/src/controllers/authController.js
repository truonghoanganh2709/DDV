import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function normalizeRole(role) {
  return role === 'admin' ? 'admin' : 'user';
}

function normalizeStatus(user) {
  return user.status || (user.locked || !user.isActive ? 'blocked' : 'active');
}

function toLoginUser(user, status = user.status) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    status,
  };
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
    role: 'user',
    status: 'active'
  });

  const token = signToken(user._id);
  return res.status(201).json({ success: true, token, user: toLoginUser(user, user.status) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email va mat khau la bat buoc' });

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Email hoac mat khau khong dung' });

  const status = normalizeStatus(user);
  if (status === 'blocked') return res.status(403).json({ message: 'Tai khoan da bi khoa' });

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) return res.status(401).json({ message: 'Email hoac mat khau khong dung' });

  const token = signToken(user._id);
  return res.json({
    success: true,
    token,
    user: toLoginUser(user, status),
  });
}

export async function getProfile(req, res) {
  return res.json({ user: toLoginUser(req.user, normalizeStatus(req.user)) });
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
  return res.json({ user: toLoginUser(req.user, normalizeStatus(req.user)) });
}
