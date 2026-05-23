import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, removeItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { ROLES } from '../constants/roles';
import { authService } from '../services/authService';
import { setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

function normUser(u) {
  if (!u) return null;
  return { ...u, id: u.id || u._id };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = getItem(STORAGE_KEYS.TOKEN);
    const savedUser = getItem(STORAGE_KEYS.USER);
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(normUser(savedUser));
  }, []);

  useEffect(() => {
    if (token) setItem(STORAGE_KEYS.TOKEN, token);
    else removeItem(STORAGE_KEYS.TOKEN);
  }, [token]);

  useEffect(() => {
    if (user) setItem(STORAGE_KEYS.USER, user);
    else removeItem(STORAGE_KEYS.USER);
  }, [user]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  // refresh profile (nếu có token)
  useEffect(() => {
    if (!token) return;
    authService
      .getProfile()
      .then((res) => {
        if (res?.user) setUser(normUser(res.user));
      })
      .catch(() => {
        // ignore - interceptor 401 sẽ logout
      });
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      setToken(res.token);
      setUser(normUser(res.user));
      return { ok: true, role: res.user?.role };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Dang nhap that bai' };
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register({ ...data, role: ROLES.USER });
      setToken(res.token);
      setUser(normUser(res.user));
      return { ok: true, role: ROLES.USER };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Dang ky that bai' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      if (res?.user) setUser(normUser(res.user));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Cap nhat that bai' };
    }
  };

  const isAdmin = user?.role === ROLES.ADMIN;
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated,
      isAdmin,
    }),
    [user, token, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
