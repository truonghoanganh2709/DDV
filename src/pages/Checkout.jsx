import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { items, total, subtotal, discountAmount, clearCart } = useCart();
  const { user, addOrder, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gender, setGender] = useState('Anh');
  const [delivery, setDelivery] = useState('home');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 48, textAlign: 'center' }}>
        <p>Gio hang trong. <Link to="/products">Mua sam ngay</Link></p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      total,
      customer: {
        name: fd.get('name'),
        phone: fd.get('phone'),
        address: fd.get('address'),
        gender,
        delivery,
        payment: fd.get('payment'),
        note: fd.get('note'),
      },
      status: 'Cho xac nhan',
    };
    if (isAuthenticated) addOrder(order);
    else {
      const guestOrders = JSON.parse(localStorage.getItem('ddv_guest_orders') || '[]');
      guestOrders.unshift(order);
      localStorage.setItem('ddv_guest_orders', JSON.stringify(guestOrders));
    }
    clearCart();
    navigate('/order-success', { state: { orderId: order.id } });
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Gio hang', to: '/cart' }, { label: 'Thanh toan' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <Link to="/cart" className={styles.back}>
            <ArrowLeft size={16} /> Tiep tuc mua hang
          </Link>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <img src={item.image} alt="" />
                <div>
                  <p>{item.name}</p>
                  <p className="text-primary">{formatPrice(item.price)} x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>THONG TIN KHACH HANG</h3>
          <div className={styles.gender}>
            <label>
              <input type="radio" name="g" checked={gender === 'Anh'} onChange={() => setGender('Anh')} />
              Anh
            </label>
            <label>
              <input type="radio" name="g" checked={gender === 'Chi'} onChange={() => setGender('Chi')} />
              Chi
            </label>
          </div>
          <div className={styles.row2}>
            <div>
              <label>Họ và tên *</label>
              <input name="name" required defaultValue={user?.name || ''} placeholder="Nguyen Van A" />
            </div>
            <div>
              <label>Số điện thoại *</label>
              <input name="phone" required defaultValue={user?.phone || ''} placeholder="0901234567" />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>HINH THUC GIAO HANG</h3>
          <div className={styles.gender}>
            <label>
              <input
                type="radio"
                checked={delivery === 'home'}
                onChange={() => setDelivery('home')}
              />
              Giao hang tan noi
            </label>
            <label>
              <input
                type="radio"
                checked={delivery === 'store'}
                onChange={() => setDelivery('store')}
              />
              Nhan hang tai cua hang
            </label>
          </div>
          <div className={styles.row2}>
            <div>
              <label>Tinh/Thanh *</label>
              <select name="city" required defaultValue="TP.HCM">
                <option>TP.HCM</option>
                <option>Ha Noi</option>
                <option>Da Nang</option>
              </select>
            </div>
            <div>
              <label>Quan/Huyen *</label>
              <select name="district" required defaultValue="Quan 1">
                <option>Quan 1</option>
                <option>Quan 3</option>
                <option>Quan 5</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Ten duong, so nha *</label>
            <input name="address" required placeholder="123 Nguyen Hue" />
          </div>
          <div className={styles.field}>
            <label>Yeu cau khac (neu co)</label>
            <input name="note" placeholder="Giao gio hanh chinh" />
          </div>

          <h3 className={styles.sectionTitle}>PHUONG THUC THANH TOAN</h3>
          <div className={styles.field}>
            <select name="payment" required defaultValue="cod">
              <option value="cod">Thanh toan khi nhan hang (COD)</option>
              <option value="vnpay">VNPAY</option>
              <option value="momo">MoMo</option>
              <option value="card">The tin dung/ghi no</option>
            </select>
          </div>

          <h3 className={styles.sectionTitle}>CHI TIET THANH TOAN</h3>
          <div className={styles.summary}>
            <div className={styles.sumRow}>
              <span>Tien hang</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.sumRow}>
              <span>Phi van chuyen</span>
              <span>Mien phi</span>
            </div>
            {discountAmount > 0 && (
              <div className={styles.sumRow}>
                <span>Khuyen mai</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className={`${styles.sumRow} ${styles.totalRow}`}>
              <span>Tong cong</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>

          <p className={styles.terms}>
            Nhan nut Thanh toan, ban dong y voi dieu khoan mua hang cua Di Dong Viet.
          </p>
          <button type="submit" className="btn btn-primary btn-block">
            Thanh toan
          </button>
        </form>
      </div>
    </>
  );
}
