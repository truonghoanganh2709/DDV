import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatPrice } from '../utils/formatPrice';
import { ORDER_STATUS_LABELS } from '../constants/roles';
import styles from './OrderHistory.module.css';

export default function OrderHistory() {
  const { user } = useAuth();
  const { getOrdersByUserId } = useData();
  const orders = getOrdersByUserId(user?.id);

  return (
    <>
      <Breadcrumb items={[{ label: 'Tai khoan', to: '/profile' }, { label: 'Don hang cua toi' }]} />
      <div className={`container ${styles.page}`}>
        <h1 className="section-title">Lich su don hang</h1>
        {orders.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p className="text-muted">Ban chua co don hang nao.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
              Mua sam ngay
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <article key={order.id} className={`card ${styles.order}`}>
                <div className={styles.header}>
                  <div>
                    <strong>{order.id}</strong>
                    <p className="text-muted">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <span className={styles.status}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <ul>
                  {order.items?.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.quantity} - {formatPrice(item.price * item.quantity)}
                    </li>
                  ))}
                </ul>
                <p className={styles.total}>Tong: {formatPrice(order.total)}</p>
                <Link to={`/track-order?orderId=${order.id}&phone=${order.phone}`} className={styles.track}>
                  Theo doi don
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
