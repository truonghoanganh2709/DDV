import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../constants/roles';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    showToast('Dang nhap thanh cong', 'success');
    if (result.role === ROLES.ADMIN) {
      navigate('/admin/dashboard', { replace: true });
    } else if (from && !from.startsWith('/admin')) {
      navigate(from, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Dang nhap' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <h1>Dang nhap</h1>
          <p className={styles.hint}>
            Admin: admin@gmail.com / 123456<br />
            User: user@gmail.com / 123456
          </p>
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
