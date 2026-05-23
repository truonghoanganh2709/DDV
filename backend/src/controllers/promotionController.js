import Promotion from '../models/Promotion.js';

function toPromotionDTO(p) {
  const obj = p.toObject({ virtuals: true });
  return {
    ...obj,
    // compat fields với frontend mock
    type: obj.discountType,
    value: obj.discountValue,
    minOrder: obj.minOrderValue,
    active: obj.isActive,
    expiresAt: obj.endDate ? new Date(obj.endDate).toISOString().slice(0, 10) : null
  };
}

function normalizePayload(body) {
  const b = body || {};
  return {
    id: b.id,
    code: b.code,
    name: b.name,
    discountType: b.discountType || b.type,
    discountValue: b.discountValue ?? b.value,
    maxDiscount: b.maxDiscount ?? 0,
    minOrderValue: b.minOrderValue ?? b.minOrder ?? 0,
    startDate: b.startDate,
    endDate: b.endDate || b.expiresAt,
    isActive: b.isActive ?? b.active
  };
}

export async function getPromotions(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const filter = isAdmin ? {} : { isActive: true, endDate: { $gte: new Date() } };
  const list = await Promotion.find(filter).sort({ createdAt: -1 });
  return res.json(list.map(toPromotionDTO));
}

export async function createPromotion(req, res) {
  const data = normalizePayload(req.body);
  if (!data.code || !data.discountType || data.discountValue == null || !data.endDate) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const id = data.id || `promo-${Date.now()}`;
  const exists = await Promotion.findOne({ $or: [{ id }, { code: String(data.code).toUpperCase() }] });
  if (exists) return res.status(400).json({ message: 'Promotion exists' });

  const promo = await Promotion.create({
    ...data,
    id,
    code: String(data.code).toUpperCase(),
    endDate: new Date(data.endDate),
    startDate: data.startDate ? new Date(data.startDate) : new Date()
  });
  return res.status(201).json(toPromotionDTO(promo));
}

export async function updatePromotion(req, res) {
  const { id } = req.params;
  const promo = await Promotion.findOne({ id: String(id) });
  if (!promo) return res.status(404).json({ message: 'Promotion not found' });

  const data = normalizePayload(req.body);
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined) promo[k] = v;
  });
  if (data.code) promo.code = String(data.code).toUpperCase();
  if (data.endDate) promo.endDate = new Date(data.endDate);
  if (data.startDate) promo.startDate = new Date(data.startDate);
  await promo.save();
  return res.json(toPromotionDTO(promo));
}

export async function deletePromotion(req, res) {
  const { id } = req.params;
  const promo = await Promotion.findOne({ id: String(id) });
  if (!promo) return res.status(404).json({ message: 'Promotion not found' });
  await promo.deleteOne();
  return res.json({ message: 'Deleted' });
}

export async function checkPromotion(req, res) {
  const { code, orderValue } = req.body || {};
  if (!code) return res.status(400).json({ ok: false, message: 'Missing code' });

  const promo = await Promotion.findOne({ code: String(code).toUpperCase().trim() });
  if (!promo) return res.status(404).json({ ok: false, message: 'Ma khuyen mai khong hop le' });
  if (!promo.isActive) return res.status(400).json({ ok: false, message: 'Ma khuyen mai dang tat' });

  const now = new Date();
  if (promo.startDate && now < promo.startDate) return res.status(400).json({ ok: false, message: 'Ma chua bat dau' });
  if (promo.endDate && now > promo.endDate) return res.status(400).json({ ok: false, message: 'Ma da het han' });

  const value = Number(orderValue) || 0;
  if (value < (promo.minOrderValue || 0)) {
    return res.status(400).json({ ok: false, message: 'Don hang chua dat gia tri toi thieu' });
  }

  let discountAmount = 0;
  if (promo.discountType === 'percent') {
    discountAmount = Math.round(value * (promo.discountValue / 100));
    if (promo.maxDiscount) discountAmount = Math.min(discountAmount, promo.maxDiscount);
  } else {
    discountAmount = promo.discountValue;
  }
  discountAmount = Math.min(discountAmount, value);

  return res.json({ ok: true, promotion: toPromotionDTO(promo), discountAmount });
}

