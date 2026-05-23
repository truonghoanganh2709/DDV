import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('demo@didongviet.vn');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok) navigate(from, { replace: true });
    else setError(result.message);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Dang nhap' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <h1>Dang nhap</h1>
          <p className={styles.hint}>Demo: demo@didongviet.vn / 123456</p>
          {error && <p className={styles.error}>{error}</p>}
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Mat khau</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Link to="/forgot-password" className={styles.forgot}>
            Quen mat khau?
          </Link>
          <button type="submit" className="btn btn-primary btn-block">
            Dang nhap
          </button>
          <p className={styles.switch}>
            Chua co tai khoan? <Link to="/register">Dang ky ngay</Link>
          </p>
        </form>
      </div>
    </>
  );
}
