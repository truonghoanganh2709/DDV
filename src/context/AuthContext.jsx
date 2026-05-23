import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ddv_auth';
const ORDERS_KEY = 'ddv_orders';

const DEMO_USERS = [
  { id: 'u1', email: 'demo@didongviet.vn', password: '123456', name: 'Nguyen Van A', phone: '0901234567' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      const ordersRaw = localStorage.getItem(ORDERS_KEY);
      if (ordersRaw) setOrders(JSON.parse(ordersRaw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const login = (email, password) => {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!found) {
      const stored = JSON.parse(localStorage.getItem('ddv_users') || '[]');
      const match = stored.find((u) => u.email === email && u.password === password);
      if (!match) return { ok: false, message: 'Email hoac mat khau khong dung' };
      const { password: _, ...safe } = match;
      setUser(safe);
      return { ok: true };
    }
    const { password: _, ...safe } = found;
    setUser(safe);
    return { ok: true };
  };

  const register = (data) => {
    const stored = JSON.parse(localStorage.getItem('ddv_users') || '[]');
    if (stored.some((u) => u.email === data.email) || DEMO_USERS.some((u) => u.email === data.email)) {
      return { ok: false, message: 'Email da duoc su dung' };
    }
    const newUser = { id: `u${Date.now()}`, ...data };
    stored.push(newUser);
    localStorage.setItem('ddv_users', JSON.stringify(stored));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const value = useMemo(
    () => ({ user, orders, login, register, logout, updateProfile, addOrder, isAuthenticated: !!user }),
    [user, orders]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
