import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { useData } from './DataContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { getPromotionByCode } = useData();
  const [items, setItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  useEffect(() => {
    setItems(getItem(STORAGE_KEYS.CART, []));
  }, []);

  useEffect(() => {
    setItem(STORAGE_KEYS.CART, items);
  }, [items]);

  const addToCart = (product, qty = 1, color = null) => {
    if (product.status === 'out_of_stock' || product.stock <= 0) {
      return { ok: false, message: 'San pham het hang' };
    }
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
    return { ok: true };
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
    const promo = getPromotionByCode(code);
    if (!promo) return { ok: false, message: 'Ma khuyen mai khong hop le hoac da het han' };
    if (subtotal < (promo.minOrder || 0)) {
      return { ok: false, message: `Don hang toi thieu ${promo.minOrder?.toLocaleString('vi-VN')}d` };
    }
    setDiscountCode(promo.code);
    setAppliedDiscount(promo);
    return { ok: true, message: `Ap dung: ${promo.name}` };
  };

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    let amount = 0;
    if (appliedDiscount.type === 'percent') {
      amount = Math.round(subtotal * (appliedDiscount.value / 100));
      if (appliedDiscount.maxDiscount) amount = Math.min(amount, appliedDiscount.maxDiscount);
    } else {
      amount = appliedDiscount.value;
    }
    return Math.min(amount, subtotal);
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
