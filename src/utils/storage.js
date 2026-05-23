export const STORAGE_KEYS = {
  AUTH: 'ddv_auth',
  USERS: 'ddv_users',
  PRODUCTS: 'ddv_products',
  CATEGORIES: 'ddv_categories',
  ORDERS: 'ddv_orders',
  PROMOTIONS: 'ddv_promotions',
  BANNERS: 'ddv_banners',
  REVIEWS: 'ddv_reviews',
  SETTINGS: 'ddv_settings',
  CART: 'ddv_cart',
  WISHLIST: 'ddv_wishlist',
  SEEDED: 'ddv_seeded_v3',
};

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
