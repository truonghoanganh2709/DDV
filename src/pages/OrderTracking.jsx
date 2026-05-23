import { useState } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import styles from './OrderTracking.module.css';

export default function OrderTracking() {
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const phone = fd.get('phone');
    const orderId = fd.get('orderId');
    setResult({
      orderId,
      phone,
      status: 'Dang giao hang',
      steps: [
        { label: 'Dat hang thanh cong', done: true, time: '08:30 23/05' },
        { label: 'Xac nhan don hang', done: true, time: '09:00 23/05' },
        { label: 'Dang dong goi', done: true, time: '10:15 23/05' },
        { label: 'Dang giao hang', done: true, time: 'Dang cap nhat' },
        { label: 'Giao hang thanh cong', done: false, time: '' },
      ],
    });
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Tra cuu don hang' }]} />
      <div className={`container ${styles.page}`}>
        <div className={`card ${styles.card}`}>
          <div className={styles.illus}>
            <div className={styles.scooter} />
            <p>Giao hang nhanh 2h</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Tra cuu don hang</h1>
            <label>So dien thoai</label>
            <input name="phone" type="tel" required placeholder="0901234567" />
            <label>Ma don hang</label>
            <input name="orderId" required placeholder="ORD1234567890" />
            <button type="submit" className="btn btn-primary btn-block">
              Theo doi hanh trinh
            </button>
          </form>
        </div>

        {result && (
          <div className={`card ${styles.result}`}>
            <h2>Don hang {result.orderId}</h2>
            <p>
              SDT: {result.phone} - <strong className="text-primary">{result.status}</strong>
            </p>
            <ol className={styles.timeline}>
              {result.steps.map((step, i) => (
                <li key={i} className={step.done ? styles.done : ''}>
                  <span className={styles.dot} />
                  <div>
                    <strong>{step.label}</strong>
                    {step.time && <p className="text-muted">{step.time}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
