import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Quen mat khau' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <h1>Quen mat khau</h1>
          {sent ? (
            <p className={styles.success}>
              Da gui link dat lai mat khau den <strong>{email}</strong> (gia lap). Vui long kiem tra hop thu.
            </p>
          ) : (
            <>
              <p className="text-muted">Nhap email dang ky de nhan huong dan dat lai mat khau.</p>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary btn-block">
                Gui yeu cau
              </button>
            </>
          )}
          <p className={styles.switch}>
            <Link to="/login">Quay lai dang nhap</Link>
          </p>
        </form>
      </div>
    </>
  );
}
