export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
};

export function getItem(key, fallback = null) {
  try {
    const legacyMap = {
      token: 'ddv_token',
      user: 'ddv_user',
      cart: 'ddv_cart',
      wishlist: 'ddv_wishlist',
    };

    const raw = localStorage.getItem(key);
    if (raw == null && legacyMap[key]) {
      const legacyRaw = localStorage.getItem(legacyMap[key]);
      if (legacyRaw != null) {
        localStorage.setItem(key, legacyRaw);
        localStorage.removeItem(legacyMap[key]);
        try {
          return JSON.parse(legacyRaw);
        } catch {
          return legacyRaw;
        }
      }
    }
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
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
