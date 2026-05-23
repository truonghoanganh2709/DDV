import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import { ORDER_STATUS } from '../constants/roles';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { items, total, subtotal, discountAmount, discountCode, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [gender, setGender] = useState('Anh');
  const [delivery, setDelivery] = useState('home');
  const [errors, setErrors] = useState({});

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
    const name = fd.get('name')?.toString().trim();
    const phone = fd.get('phone')?.toString().trim();
    const address = fd.get('address')?.toString().trim();
    const nextErrors = {};
    if (!name) nextErrors.name = 'Vui long nhap ho ten';
    if (!phone || phone.length < 9) nextErrors.phone = 'So dien thoai khong hop le';
    if (delivery === 'home' && !address) nextErrors.address = 'Vui long nhap dia chi';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const order = {
      id: `ORD${Date.now()}`,
      userId: user?.id || null,
      customerName: name,
      phone,
      email: user?.email || fd.get('email') || '',
      address: delivery === 'home' ? address : 'Nhan tai cua hang',
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      discount: discountAmount,
      shippingFee: 0,
      total,
      paymentMethod: fd.get('payment'),
      note: fd.get('note') || '',
      status: ORDER_STATUS.PENDING,
      promoCode: discountCode || null,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    showToast('Dat hang thanh cong', 'success');
    navigate('/order-success', { state: { orderId: order.id } });
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Gio hang', to: '/cart' }, { label: 'Thanh toan' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit} noValidate>
          <Link to="/cart" className={styles.back}>
            <ArrowLeft size={16} /> Tiep tuc mua hang
          </Link>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.key} className={styles.item}>
                <img src={item.image} alt="" />
                <div>
                  <p>{item.name}</p>
                  <p className="text-primary">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>THONG TIN KHACH HANG</h3>
          <div className={styles.gender}>
            <label>
              <input type="radio" checked={gender === 'Anh'} onChange={() => setGender('Anh')} />
              Anh
            </label>
            <label>
              <input type="radio" checked={gender === 'Chi'} onChange={() => setGender('Chi')} />
              Chi
            </label>
          </div>
          <div className={styles.row2}>
            <div>
              <label>Ho va ten *</label>
              <input name="name" defaultValue={user?.name || ''} />
              {errors.name && <span className={styles.err}>{errors.name}</span>}
            </div>
            <div>
              <label>So dien thoai *</label>
              <input name="phone" defaultValue={user?.phone || ''} />
              {errors.phone && <span className={styles.err}>{errors.phone}</span>}
            </div>
          </div>

          <h3 className={styles.sectionTitle}>HINH THUC GIAO HANG</h3>
          <div className={styles.gender}>
            <label>
              <input type="radio" checked={delivery === 'home'} onChange={() => setDelivery('home')} />
              Giao hang tan noi
            </label>
            <label>
              <input type="radio" checked={delivery === 'store'} onChange={() => setDelivery('store')} />
              Nhan tai cua hang
            </label>
          </div>
          {delivery === 'home' && (
            <>
              <div className={styles.row2}>
                <div>
                  <label>Tinh/Thanh *</label>
                  <select name="city" defaultValue="TP.HCM">
                    <option>TP.HCM</option>
                    <option>Ha Noi</option>
                    <option>Da Nang</option>
                  </select>
                </div>
                <div>
                  <label>Quan/Huyen *</label>
                  <select name="district" defaultValue="Quan 1">
                    <option>Quan 1</option>
                    <option>Quan 3</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>Ten duong, so nha *</label>
                <input name="address" placeholder="123 Nguyen Hue" />
                {errors.address && <span className={styles.err}>{errors.address}</span>}
              </div>
            </>
          )}
          <div className={styles.field}>
            <label>Ghi chu</label>
            <input name="note" placeholder="Yeu cau khac" />
          </div>

          <h3 className={styles.sectionTitle}>PHUONG THUC THANH TOAN</h3>
          <div className={styles.field}>
            <select name="payment" required defaultValue="cod">
              <option value="cod">COD - Thanh toan khi nhan hang</option>
              <option value="vnpay">VNPAY</option>
              <option value="momo">MoMo</option>
              <option value="card">The tin dung</option>
            </select>
          </div>

          <div className={styles.summary}>
            <div className={styles.sumRow}>
              <span>Tien hang</span>
              <span>{formatPrice(subtotal)}</span>
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

          <button type="submit" className="btn btn-primary btn-block">
            Xac nhan dat hang
          </button>
        </form>
      </div>
    </>
  );
}
