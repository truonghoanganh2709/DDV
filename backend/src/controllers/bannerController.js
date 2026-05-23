import Banner from '../models/Banner.js';

export async function getBanners(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const filter = isAdmin ? {} : { active: true };
  const list = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
  return res.json(list);
}

export async function createBanner(req, res) {
  const data = req.body || {};
  const id = data.id || `banner-${Date.now()}`;
  const exists = await Banner.findOne({ id });
  if (exists) return res.status(400).json({ message: 'Banner id already exists' });

  const banner = await Banner.create({ ...data, id });
  return res.status(201).json(banner);
}

export async function updateBanner(req, res) {
  const { id } = req.params;
  const banner = await Banner.findOne({ id: String(id) });
  if (!banner) return res.status(404).json({ message: 'Banner not found' });
  Object.assign(banner, req.body || {});
  await banner.save();
  return res.json(banner);
}

export async function deleteBanner(req, res) {
  const { id } = req.params;
  const banner = await Banner.findOne({ id: String(id) });
  if (!banner) return res.status(404).json({ message: 'Banner not found' });
  await banner.deleteOne();
  return res.json({ message: 'Deleted' });
}

