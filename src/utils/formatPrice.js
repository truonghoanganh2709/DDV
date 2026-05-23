export function formatPrice(amount) {
  if (amount == null || Number.isNaN(amount)) return '0 d';
  return `${Number(amount).toLocaleString('vi-VN')} d`;
}

export function calcDiscountPercent(price, originalPrice, oldPrice) {
  const orig = oldPrice ?? originalPrice;
  if (!orig || orig <= price) return 0;
  return Math.round(((orig - price) / orig) * 100);
}
