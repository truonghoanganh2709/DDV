import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DISCOUNT_CODES } from '../constants/theme';

const CartContext = createContext(null);
const STORAGE_KEY = 'ddv_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1, color = null) => {
    setItems((prev) => {
      const key = `${product.id}-${color || 'default'}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          color,
          quantity: qty,
        },
      ];
    });
  };

  const removeFromCart = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      removeFromCart(key);
      return;
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const applyDiscount = (code) => {
    const upper = code.trim().toUpperCase();
    const discount = DISCOUNT_CODES[upper];
    if (!discount) return { ok: false, message: 'Ma khuyen mai khong hop le' };
    setDiscountCode(upper);
    setAppliedDiscount(discount);
    return { ok: true, message: `Ap dung thanh cong: ${discount.label}` };
  };

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.percent) return Math.round(subtotal * (appliedDiscount.percent / 100));
    if (appliedDiscount.fixed) return appliedDiscount.fixed;
    return 0;
  }, [appliedDiscount, subtotal]);

  const total = Math.max(0, subtotal - discountAmount);
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      total,
      discountAmount,
      discountCode,
      appliedDiscount,
      applyDiscount,
      itemCount,
    }),
    [items, subtotal, total, discountAmount, discountCode, appliedDiscount, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
