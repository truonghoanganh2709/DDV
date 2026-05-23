import { PRODUCTS } from './products';
import { PRODUCT_STATUS } from '../constants/roles';

export function normalizeProduct(p, index = 0) {
  const ram = p.specs?.RAM || p.specs?.ram || '8GB';
  const storage = p.specs?.['B\u1ed9 nh\u1edb'] || p.specs?.SSD || p.specs?.storage || '128GB';
  const oldPrice = p.oldPrice ?? p.originalPrice ?? p.price;
  let status = p.status || PRODUCT_STATUS.ACTIVE;
  const stock = p.stock ?? 30 + (index % 50);

  if (stock <= 0) status = PRODUCT_STATUS.OUT_OF_STOCK;

  return {
    ...p,
    oldPrice,
    originalPrice: oldPrice,
    stock,
    sold: p.sold ?? 50 + index * 7,
    status,
    ram,
    storage,
    installment: p.installment ?? true,
    createdAt: p.createdAt || new Date(2025, 0, index + 1).toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
}

export const SEED_PRODUCTS = PRODUCTS.map((p, i) => normalizeProduct(p, i));
