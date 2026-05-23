import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCT_STATUS } from '../constants/roles';
import { useAuth } from './AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { promotionService } from '../services/promotionService';
import { bannerService } from '../services/bannerService';
import { reviewService } from '../services/reviewService';

const DataContext = createContext(null);

const DEFAULT_SETTINGS = {
  siteName: 'Di Dong Viet',
  hotline: '1800.6018',
  email: 'contact@didongviet.vn',
  address: '116-118-120 Nguyen Chi Thanh, Q.5, TP.HCM',
  shippingFee: 0,
  freeShippingMin: 0,
};

function normUser(u) {
  if (!u) return null;
  return { ...u, id: u.id || u._id };
}

function normOrder(o) {
  if (!o) return null;
  // backend: {orderCode, customerInfo, totalPrice...} -> frontend mock shape
  return {
    ...o,
    id: o.id || o.orderCode || o._id,
    userId: o.userId || o.user?._id || o.user,
    customerName: o.customerName || o.customerInfo?.name,
    phone: o.phone || o.customerInfo?.phone,
    email: o.email || o.customerInfo?.email,
    address: o.address || o.customerInfo?.address,
    subtotal: o.subtotal ?? 0,
    discount: o.discount ?? o.discountAmount ?? 0,
    shippingFee: o.shippingFee ?? 0,
    total: o.total ?? o.totalPrice ?? 0,
  };
}

function shallowEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

export function DataProvider({ children }) {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const loadPublic = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, promo, b] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        promotionService.getAll(),
        bannerService.getAll(),
      ]);
      setProducts(p || []);
      setCategories(c || []);
      setPromotions(promo || []);
      setBanners(b || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [p, u, o, r, promo, b] = await Promise.all([
        productService.getAll({ includeHidden: true }),
        userService.getAll(),
        orderService.getAll(),
        reviewService.getAll(),
        promotionService.getAll({ includeHidden: true }),
        bannerService.getAll({ includeHidden: true }),
      ]);
      setProducts(p || []);
      setUsers((u || []).map(normUser));
      setOrders((o || []).map(normOrder));
      setReviews(r || []);
      setPromotions(promo || []);
      setBanners(b || []);
    } catch {
      // ignore
    }
  }, [isAdmin]);

  const loadMyOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const o = await orderService.getMyOrders();
      setOrders((o || []).map(normOrder));
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const loadAll = useCallback(async () => {
    await loadPublic();
    if (isAdmin) await loadAdminData();
    else if (isAuthenticated) await loadMyOrders();
  }, [loadAdminData, loadMyOrders, loadPublic, isAdmin, isAuthenticated]);

  useEffect(() => {
    loadPublic();
  }, [loadPublic]);

  useEffect(() => {
    if (isAdmin) loadAdminData();
    else if (isAuthenticated) loadMyOrders();
    else {
      setUsers([]);
      setOrders([]);
      setReviews([]);
    }
  }, [isAdmin, isAuthenticated, user?.id, loadAdminData, loadMyOrders]);

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
    async (data) => {
      const product = await productService.create(data);
      setProducts((prev) => [product, ...prev]);
      return product;
    },
    []
  );

  const updateProduct = useCallback(
    async (id, updates) => {
      const updated = await productService.update(id, updates);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    },
    []
  );

  const deleteProduct = useCallback(
    async (id) => {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    []
  );

  const addOrder = useCallback(
    async (orderPayload) => {
      const created = await orderService.create(orderPayload);
      const normalized = normOrder(created);
      setOrders((prev) => [normalized, ...prev]);
      return normalized;
    },
    []
  );

  const updateOrder = useCallback(
    async (id, updates) => {
      if (updates?.status) {
        const updated = await orderService.updateStatus(id, updates.status);
        const normalized = normOrder(updated);
        setOrders((prev) => prev.map((o) => (o.id === id ? normalized : o)));
      }
    },
    []
  );

  const getOrderById = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const getOrdersByUserId = useCallback(
    (userId) => orders.filter((o) => o.userId === userId),
    [orders]
  );

  const updateUser = useCallback(
    async (id, updates) => {
      if (updates.role) {
        const u = await userService.updateRole(id, updates.role);
        setUsers((prev) => prev.map((x) => (x.id === id ? normUser(u) : x)));
        return true;
      }

      const u = await userService.updateStatus(id, updates);
      setUsers((prev) => prev.map((x) => (x.id === id ? normUser(u) : x)));
      return true;
    },
    []
  );

  const deleteUser = useCallback(
    async (id) => {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    },
    []
  );

  const saveCategories = useCallback(
    async (next) => {
      const prev = categories;

      const prevMap = new Map(prev.map((c) => [c.id, c]));
      const nextMap = new Map(next.map((c) => [c.id, c]));

      const toDelete = prev.filter((c) => !nextMap.has(c.id));
      const toCreate = next.filter((c) => !prevMap.has(c.id));
      const toUpdate = next.filter((c) => prevMap.has(c.id) && !shallowEqual(prevMap.get(c.id), c));

      await Promise.all([
        ...toDelete.map((c) => categoryService.remove(c.id)),
        ...toCreate.map((c) => categoryService.create(c)),
        ...toUpdate.map((c) => categoryService.update(c.id, c)),
      ]);

      const fresh = await categoryService.getAll();
      setCategories(fresh || []);
    },
    [categories]
  );

  const savePromotions = useCallback(
    async (next) => {
      const prev = promotions;
      const prevMap = new Map(prev.map((p) => [p.id, p]));
      const nextMap = new Map(next.map((p) => [p.id, p]));
      const toDelete = prev.filter((p) => !nextMap.has(p.id));
      const toCreate = next.filter((p) => !prevMap.has(p.id));
      const toUpdate = next.filter((p) => prevMap.has(p.id) && !shallowEqual(prevMap.get(p.id), p));

      await Promise.all([
        ...toDelete.map((p) => promotionService.remove(p.id)),
        ...toCreate.map((p) => promotionService.create(p)),
        ...toUpdate.map((p) => promotionService.update(p.id, p)),
      ]);

      const fresh = await promotionService.getAll({ includeHidden: true });
      setPromotions(fresh || []);
    },
    [promotions]
  );

  const saveBanners = useCallback(
    async (next) => {
      const prev = banners;
      const prevMap = new Map(prev.map((b) => [b.id, b]));
      const nextMap = new Map(next.map((b) => [b.id, b]));
      const toDelete = prev.filter((b) => !nextMap.has(b.id));
      const toCreate = next.filter((b) => !prevMap.has(b.id));
      const toUpdate = next.filter((b) => prevMap.has(b.id) && !shallowEqual(prevMap.get(b.id), b));

      await Promise.all([
        ...toDelete.map((b) => bannerService.remove(b.id)),
        ...toCreate.map((b) => bannerService.create(b)),
        ...toUpdate.map((b) => bannerService.update(b.id, b)),
      ]);

      const fresh = await bannerService.getAll({ includeHidden: true });
      setBanners(fresh || []);
    },
    [banners]
  );

  const saveReviews = useCallback(
    async () => {
      const r = await reviewService.getAll();
      setReviews(r || []);
    },
    []
  );

  const updateReviewStatus = useCallback(async (id, status) => {
    const updated = await reviewService.updateStatus(id, status);
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const deleteReview = useCallback(async (id) => {
    await reviewService.remove(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const saveSettings = useCallback(
    (data) => setSettings(data),
    []
  );

  const getPromotionByCode = useCallback(
    async (code, orderValue = 0) => {
      const upper = code?.trim().toUpperCase();
      if (!upper) return null;
      try {
        const res = await promotionService.check(upper, orderValue);
        return res?.promotion || null;
      } catch {
        return null;
      }
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
      loading,
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
      saveCategories,
      savePromotions,
      saveBanners,
      saveReviews,
      updateReviewStatus,
      deleteReview,
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
      loading,
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
      saveCategories,
      savePromotions,
      saveBanners,
      saveReviews,
      updateReviewStatus,
      deleteReview,
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
