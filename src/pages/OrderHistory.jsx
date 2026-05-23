import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import styles from './OrderHistory.module.css';

export default function OrderHistory() {
  const { orders } = useAuth();
  const guestOrders = JSON.parse(localStorage.getItem('ddv_guest_orders') || '[]');
  const allOrders = [...orders, ...guestOrders.filter((g) => !orders.find((o) => o.id === g.id))];

  return (
    <>
      <Breadcrumb items={[{ label: 'Tai khoan', to: '/profile' }, { label: 'Lich su don hang' }]} />
      <div className={`container ${styles.page}`}>
        <h1 className="section-title">Lich su don hang</h1>
        {allOrders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p className="text-muted">Ban chua co don hang nao.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
              Mua sam ngay
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {allOrders.map((order) => (
              <article key={order.id} className={`card ${styles.order}`}>
                <div className={styles.header}>
                  <div>
                    <strong>{order.id}</strong>
                    <p className="text-muted">
                      {new Date(order.date).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <span className={styles.status}>{order.status}</span>
                </div>
                <ul>
                  {order.items?.map((item) => (
                    <li key={item.key}>
                      {item.name} x{item.quantity} - {formatPrice(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
                <p className={styles.total}>Tong: {formatPrice(order.total)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
