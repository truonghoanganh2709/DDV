export const STORAGE_KEYS = {
  TOKEN: 'ddv_token',
  USER: 'ddv_user',
  CART: 'ddv_cart',
  WISHLIST: 'ddv_wishlist',
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
