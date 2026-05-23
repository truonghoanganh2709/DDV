import User from '../models/User.js';

export async function getUsers(req, res) {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return res.json(users);
}

export async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body || {};
  if (!role) return res.status(400).json({ message: 'Missing role' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  return res.json(user.toSafeJSON());
}

export async function updateUserStatus(req, res) {
  const { id } = req.params;
  const { locked, isActive } = req.body || {};
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (locked != null) user.locked = Boolean(locked);
  if (isActive != null) user.isActive = Boolean(isActive);
  await user.save();
  return res.json(user.toSafeJSON());
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  return res.json({ message: 'Deleted' });
}

