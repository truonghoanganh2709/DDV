import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { SEED_PRODUCTS, normalizeProduct } from '../data/mockProducts';
import { SEED_USERS } from '../data/mockUsers';
import { SEED_ORDERS } from '../data/mockOrders';
import { SEED_CATEGORIES } from '../data/mockCategories';
import { SEED_PROMOTIONS } from '../data/mockPromotions';
import { SEED_BANNERS } from '../data/mockBanners';
import { SEED_REVIEWS } from '../data/mockReviews';
import { PRODUCT_STATUS, MAIN_ADMIN_ID } from '../constants/roles';

const DataContext = createContext(null);

const DEFAULT_SETTINGS = {
  siteName: 'Di Dong Viet',
  hotline: '1800.6018',
  email: 'contact@didongviet.vn',
  address: '116-118-120 Nguyen Chi Thanh, Q.5, TP.HCM',
  shippingFee: 0,
  freeShippingMin: 0,
};

function seedData() {
  if (getItem(STORAGE_KEYS.SEEDED)) return;
  setItem(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  setItem(STORAGE_KEYS.USERS, SEED_USERS);
  setItem(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  setItem(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  setItem(STORAGE_KEYS.PROMOTIONS, SEED_PROMOTIONS);
  setItem(STORAGE_KEYS.BANNERS, SEED_BANNERS);
  setItem(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  setItem(STORAGE_KEYS.SEEDED, true);
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const loadAll = useCallback(() => {
    seedData();
    setProducts(getItem(STORAGE_KEYS.PRODUCTS, []));
    setUsers(getItem(STORAGE_KEYS.USERS, []));
    setOrders(getItem(STORAGE_KEYS.ORDERS, []));
    setCategories(getItem(STORAGE_KEYS.CATEGORIES, []));
    setPromotions(getItem(STORAGE_KEYS.PROMOTIONS, []));
    setBanners(getItem(STORAGE_KEYS.BANNERS, []));
    setReviews(getItem(STORAGE_KEYS.REVIEWS, []));
    setSettings(getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const persist = useCallback((key, data, setter) => {
    setItem(key, data);
    setter(data);
  }, []);

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === PRODUCT_STATUS.ACTIVE),
    [products]
  );

  const getProductById = useCallback(
    (id, { includeHidden = false } = {}) => {
      const list = includeHidden ? products : activeProducts;
      return list.find((p) => p.id === id);
    },
    [products, activeProducts]
  );

  const addProduct = useCallback(
    (data) => {
      const product = normalizeProduct({ ...data, id: data.id || `p${Date.now()}` }, products.length);
      const next = [product, ...products];
      persist(STORAGE_KEYS.PRODUCTS, next, setProducts);
      return product;
    },
    [products, persist]
  );

  const updateProduct = useCallback(
    (id, updates) => {
      const next = products.map((p) =>
        p.id === id ? normalizeProduct({ ...p, ...updates, id }, 0) : p
      );
      persist(STORAGE_KEYS.PRODUCTS, next, setProducts);
    },
    [products, persist]
  );

  const deleteProduct = useCallback(
    (id) => {
      const next = products.filter((p) => p.id !== id);
      persist(STORAGE_KEYS.PRODUCTS, next, setProducts);
    },
    [products, persist]
  );

  const addOrder = useCallback(
    (order) => {
      const next = [order, ...orders];
      persist(STORAGE_KEYS.ORDERS, next, setOrders);
      return order;
    },
    [orders, persist]
  );

  const updateOrder = useCallback(
    (id, updates) => {
      const next = orders.map((o) => (o.id === id ? { ...o, ...updates } : o));
      persist(STORAGE_KEYS.ORDERS, next, setOrders);
    },
    [orders, persist]
  );

  const getOrderById = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const getOrdersByUserId = useCallback(
    (userId) => orders.filter((o) => o.userId === userId),
    [orders]
  );

  const updateUser = useCallback(
    (id, updates) => {
      if (id === MAIN_ADMIN_ID && updates.role && updates.role !== 'admin') return false;
      const next = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
      persist(STORAGE_KEYS.USERS, next, setUsers);
      return true;
    },
    [users, persist]
  );

  const deleteUser = useCallback(
    (id) => {
      if (id === MAIN_ADMIN_ID) return false;
      const next = users.filter((u) => u.id !== id);
      persist(STORAGE_KEYS.USERS, next, setUsers);
      return true;
    },
    [users, persist]
  );

  const registerUser = useCallback(
    (data) => {
      if (users.some((u) => u.email === data.email)) return null;
      const user = {
        id: `user-${Date.now()}`,
        role: 'user',
        locked: false,
        createdAt: new Date().toISOString(),
        ...data,
      };
      const next = [...users, user];
      persist(STORAGE_KEYS.USERS, next, setUsers);
      return user;
    },
    [users, persist]
  );

  const findUserByCredentials = useCallback(
    (email, password) => users.find((u) => u.email === email && u.password === password),
    [users]
  );

  const saveCategories = useCallback(
    (data) => persist(STORAGE_KEYS.CATEGORIES, data, setCategories),
    [persist]
  );

  const savePromotions = useCallback(
    (data) => persist(STORAGE_KEYS.PROMOTIONS, data, setPromotions),
    [persist]
  );

  const saveBanners = useCallback(
    (data) => persist(STORAGE_KEYS.BANNERS, data, setBanners),
    [persist]
  );

  const saveReviews = useCallback(
    (data) => persist(STORAGE_KEYS.REVIEWS, data, setReviews),
    [persist]
  );

  const saveSettings = useCallback(
    (data) => persist(STORAGE_KEYS.SETTINGS, data, setSettings),
    [persist]
  );

  const getPromotionByCode = useCallback(
    (code) => {
      const upper = code?.trim().toUpperCase();
      return promotions.find((p) => p.code === upper && p.active);
    },
    [promotions]
  );

  const value = useMemo(
    () => ({
      products,
      activeProducts,
      users,
      orders,
      categories,
      promotions,
      banners,
      reviews,
      settings,
      loadAll,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      getOrderById,
      getOrdersByUserId,
      updateUser,
      deleteUser,
      registerUser,
      findUserByCredentials,
      saveCategories,
      savePromotions,
      saveBanners,
      saveReviews,
      saveSettings,
      getPromotionByCode,
    }),
    [
      products,
      activeProducts,
      users,
      orders,
      categories,
      promotions,
      banners,
      reviews,
      settings,
      loadAll,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      getOrderById,
      getOrdersByUserId,
      updateUser,
      deleteUser,
      registerUser,
      findUserByCredentials,
      saveCategories,
      savePromotions,
      saveBanners,
      saveReviews,
      saveSettings,
      getPromotionByCode,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
