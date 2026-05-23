import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(form);
    if (result.ok) {
      showToast('Dang ky thanh cong', 'success');
      navigate('/');
    } else setError(result.message);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Dang ky' }]} />
      <div className={`container ${styles.page}`}>
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          <h1>Dang ky tai khoan</h1>
          {error && <p className={styles.error}>{error}</p>}
          <label>Ho va ten</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>So dien thoai</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
          <label>Mat khau</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          <button type="submit" className="btn btn-primary btn-block">
            Dang ky
          </button>
          <p className={styles.switch}>
            Da co tai khoan? <Link to="/login">Dang nhap</Link>
          </p>
        </form>
      </div>
    </>
  );
}
