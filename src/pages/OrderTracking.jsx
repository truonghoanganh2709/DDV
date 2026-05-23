import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useData } from '../context/DataContext';
import { ORDER_STATUS_LABELS } from '../constants/roles';
import styles from './OrderTracking.module.css';

export default function OrderTracking() {
  const [params] = useSearchParams();
  const { orders } = useData();
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [orderId, setOrderId] = useState(params.get('orderId') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.id.toUpperCase() === orderId.trim().toUpperCase() && o.phone === phone.trim()
    );
    if (!found) {
      setError('Khong tim thay don hang. Kiem tra lai ma don va so dien thoai.');
      setResult(null);
      return;
    }
    setError('');
    setResult(found);
  };

  const steps = (status) => {
    const all = ['pending', 'confirmed', 'shipping', 'completed'];
    const idx = all.indexOf(status);
    return [
      { label: 'Dat hang thanh cong', done: idx >= 0 },
      { label: 'Xac nhan don hang', done: idx >= 1 },
      { label: 'Dang giao hang', done: idx >= 2 },
      { label: 'Giao hang thanh cong', done: idx >= 3 },
    ];
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Tra cuu don hang' }]} />
      <div className={`container ${styles.page}`}>
        <div className={`card ${styles.card}`}>
          <div className={styles.illus}>
            <p>Giao hang nhanh 2h</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Tra cuu don hang</h1>
            <label>So dien thoai</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <label>Ma don hang</label>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} required placeholder="ORD10001" />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className="btn btn-primary btn-block">
              Theo doi hanh trinh
            </button>
          </form>
        </div>

        {result && (
          <div className={`card ${styles.result}`}>
            <h2>Don hang {result.id}</h2>
            <p>
              Trang thai: <strong>{ORDER_STATUS_LABELS[result.status]}</strong>
            </p>
            <p>Khach hang: {result.customerName}</p>
            <p>Dia chi: {result.address}</p>
            <ol className={styles.timeline}>
              {steps(result.status).map((step, i) => (
                <li key={i} className={step.done ? styles.done : ''}>
                  <span className={styles.dot} />
                  <strong>{step.label}</strong>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
