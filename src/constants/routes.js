export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  STORES: '/stores',
  TRACK_ORDER: '/track-order',
  PROMOTIONS: '/promotions',
};

export const NAV_LINKS = [
  { path: ROUTES.STORES, label: 'Cua hang gan ban', icon: 'MapPin' },
  { path: ROUTES.TRACK_ORDER, label: 'Tra cuu don hang', icon: 'ClipboardList' },
  { path: ROUTES.PROMOTIONS, label: 'Khuyen mai', icon: 'Ticket' },
  { path: ROUTES.CART, label: 'Gio hang', icon: 'ShoppingCart' },
];
