import Category from '../models/Category.js';

export async function getCategories(req, res) {
  const list = await Category.find({}).sort({ createdAt: 1 });
  return res.json(list);
}

export async function createCategory(req, res) {
  const { id, name, slug, icon = '', active = true } = req.body || {};
  if (!id || !name || !slug) return res.status(400).json({ message: 'Missing fields' });

  const exists = await Category.findOne({ id: String(id) });
  if (exists) return res.status(400).json({ message: 'Category id already exists' });

  const cat = await Category.create({ id, name, slug, icon, active });
  return res.status(201).json(cat);
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const cat = await Category.findOne({ id: String(id) });
  if (!cat) return res.status(404).json({ message: 'Category not found' });

  Object.assign(cat, req.body || {});
  await cat.save();
  return res.json(cat);
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  const cat = await Category.findOne({ id: String(id) });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  await cat.deleteOne();
  return res.json({ message: 'Deleted' });
}

