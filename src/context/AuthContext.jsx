import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, removeItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { ROLES } from '../constants/roles';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

function normUser(u) {
  if (!u) return null;
  return { ...u, id: u.id || u._id, role: u.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = getItem(STORAGE_KEYS.TOKEN);
    const savedUser = getItem(STORAGE_KEYS.USER);
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(normUser(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(Boolean(token && user));
  }, [token, user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      removeItem(STORAGE_KEYS.TOKEN);
      removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    });
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    authService
      .getProfile()
      .then((res) => {
        if (res?.user) {
          const u = normUser(res.user);
          setUser(u);
          setItem(STORAGE_KEYS.USER, u);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (!res?.success || !res?.token || !res?.user) {
        return { ok: false, message: 'Login response invalid' };
      }

      const u = normUser(res.user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      setToken(res.token);
      setUser(u);
      setIsAuthenticated(true);

      return { ok: true, role: u.role, user: u, token: res.token, response: res };
    } catch (err) {
      console.error('login error', err?.response || err);
      return { ok: false, message: err?.response?.data?.message || err?.message || 'Dang nhap that bai' };
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register({ ...data, role: ROLES.USER });
      const u = normUser(res.user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      setToken(res.token);
      setUser(u);
      setIsAuthenticated(true);
      return { ok: true, role: u.role };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Dang ky that bai' };
    }
  };

  const logout = () => {
    removeItem(STORAGE_KEYS.TOKEN);
    removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      if (res?.user) {
        const u = normUser(res.user);
        setUser(u);
        setItem(STORAGE_KEYS.USER, u);
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Cap nhat that bai' };
    }
  };

  const isAdmin = user?.role === ROLES.ADMIN;

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated,
      isAdmin,
    }),
    [user, token, loading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

