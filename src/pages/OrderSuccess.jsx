import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId || 'ORD000000';

  return (
    <>
      <Breadcrumb items={[{ label: 'Dat hang thanh cong' }]} />
      <div className={`container ${styles.page}`}>
        <div className={`card ${styles.card}`}>
          <CheckCircle size={64} color="var(--success)" />
          <h1>Dat hang thanh cong!</h1>
          <p>
            Ma don hang: <strong>{orderId}</strong>
          </p>
          <p className="text-muted">
            Cam on ban da mua hang tai Di Dong Viet. Chung toi se lien he xac nhan don hang trong thoi gian som nhat.
          </p>
          <div className={styles.actions}>
            <Link to="/orders" className="btn btn-outline">
              Xem lich su don hang
            </Link>
            <Link to="/" className="btn btn-primary">
              Ve trang chu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
