export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const filePath = `/uploads/${req.file.filename}`;
  return res.status(201).json({ url: filePath });
}

