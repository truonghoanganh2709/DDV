import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const [type, token] = String(auth).split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

export async function protect(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    if (user.locked || !user.isActive) return res.status(403).json({ message: 'Account locked' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && !user.locked && user.isActive) req.user = user;
    next();
  } catch {
    next();
  }
}

export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

