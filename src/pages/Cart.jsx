import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, discountAmount, total, applyDiscount } =
    useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleApplyCode = async (e) => {
    e.preventDefault();
    const code = e.target.code.value;
    const result = await applyDiscount(code);
    showToast(result.message, result.ok ? 'success' : 'error');
  };

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Gio hang' }]} />
        <div className={`container ${styles.empty}`}>
          <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <Link to="/products" className={styles.back}>
              <ArrowLeft size={16} /> Tiep tuc mua hang
            </Link>
            <div className={styles.emptyIllus} aria-hidden="true" />
            <h2>Khong co san pham nao</h2>
            <p className="text-muted" style={{ margin: '12px 0 24px' }}>
              Gio hang cua ban dang trong
            </p>
            <Link to="/" className="btn btn-primary">
              Ve trang chu
            </Link>
            <p className="text-muted" style={{ marginTop: 16, fontSize: 13 }}>
              Khi can tro giup, goi 1800.6018 (7:30 - 21:30)
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Gio hang' }]} />
      <div className={`container ${styles.page}`}>
        <div className="card" style={{ padding: 24 }}>
          <Link to="/products" className={styles.back}>
            <ArrowLeft size={16} /> Tiep tuc mua hang
          </Link>
          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              <img src={item.image} alt={item.name} />
              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                {item.color && <p className="text-muted">Mau: {item.color}</p>}
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
              </div>
              <div className={styles.qty}>
                <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <p className={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</p>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeFromCart(item.key)}
                aria-label="Xoa"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <form className={styles.coupon} onSubmit={handleApplyCode}>
            <input name="code" placeholder="Nhap ma khuyen mai (DDV10, DDV50K, HSSV)" />
            <button type="submit" className="btn btn-primary">
              Ap dung
            </button>
          </form>

          <div className={styles.summary}>
            <div className={styles.row}>
              <span>Tien hang</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className={styles.row}>
                <span>Khuyen mai</span>
                <span className="text-primary">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className={styles.row}>
              <span>Phi van chuyen</span>
              <span>Mien phi</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Tong cong</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
            Thanh toan
          </button>
        </div>
      </div>
    </>
  );
}
