import { Link } from 'react-router-dom';
import { LogOut, Package, User } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const result = await updateProfile({ name: fd.get('name'), phone: fd.get('phone') });
    if (result.ok) alert('Da cap nhat ho so');
    else alert(result.message || 'Cap nhat that bai');
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Tai khoan' }]} />
      <div className={`container ${styles.page}`}>
        <div className={styles.grid}>
          <aside className={`card ${styles.menu}`}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <p className={styles.name}>{user?.name}</p>
            <p className="text-muted">{user?.email}</p>
            <nav>
              <Link to="/profile" className={styles.active}>
                <User size={18} /> Ho so ca nhan
              </Link>
              <Link to="/orders">
                <Package size={18} /> Lich su don hang
              </Link>
              <button type="button" onClick={logout} className={styles.logout}>
                <LogOut size={18} /> Dang xuat
              </button>
            </nav>
          </aside>
          <div className={`card ${styles.content}`}>
            <h2>Ho so ca nhan</h2>
            <form onSubmit={handleSave}>
              <label>Ho va ten</label>
              <input name="name" defaultValue={user?.name} required />
              <label>Email</label>
              <input name="email" type="email" defaultValue={user?.email} required />
              <label>So dien thoai</label>
              <input name="phone" defaultValue={user?.phone} required />
              <button type="submit" className="btn btn-primary" style={{ marginTop: 20 }}>
                Luu thay doi
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
