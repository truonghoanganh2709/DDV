import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';
import { ROLES } from '../constants/roles';
import { useData } from './DataContext';

const AuthContext = createContext(null);

function toSafeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export function AuthProvider({ children }) {
  const { findUserByCredentials, registerUser, updateUser, users } = useData();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.AUTH);
    if (saved) setUser(saved);
  }, []);

  useEffect(() => {
    if (user) setItem(STORAGE_KEYS.AUTH, user);
    else removeItem(STORAGE_KEYS.AUTH);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fresh = users.find((u) => u.id === user.id);
    if (fresh) setUser(toSafeUser(fresh));
  }, [users, user?.id]);

  const login = (email, password) => {
    const found = findUserByCredentials(email.trim(), password);
    if (!found) return { ok: false, message: 'Email hoac mat khau khong dung' };
    if (found.locked) return { ok: false, message: 'Tai khoan da bi khoa' };
    const safe = toSafeUser(found);
    setUser(safe);
    return { ok: true, role: found.role };
  };

  const register = (data) => {
    const exists = users.some((u) => u.email === data.email);
    if (exists) return { ok: false, message: 'Email da duoc su dung' };
    const created = registerUser({ ...data, role: ROLES.USER });
    if (!created) return { ok: false, message: 'Khong the dang ky' };
    setUser(toSafeUser(created));
    return { ok: true, role: ROLES.USER };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    if (!user) return;
    updateUser(user.id, updates);
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const isAdmin = user?.role === ROLES.ADMIN;
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated,
      isAdmin,
    }),
    [user, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
