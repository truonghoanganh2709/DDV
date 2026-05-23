export function formatPrice(amount) {
  if (amount == null || Number.isNaN(amount)) return '0 d';
  return `${Number(amount).toLocaleString('vi-VN')} d`;
}

export function calcDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
