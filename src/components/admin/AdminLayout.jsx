import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Image,
  Star,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV } from '../../constants/routes';
import styles from './AdminLayout.module.css';

const ICONS = {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Image,
  Star,
  Settings,
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>D</span>
          <div>
            <strong>Di Dong Viet</strong>
            <small>Admin Panel</small>
          </div>
        </div>
        <nav>
          {ADMIN_NAV.map(({ path, label, icon }) => {
            const Icon = ICONS[icon] || Package;
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => (isActive ? styles.active : '')}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" rel="noreferrer" className={styles.linkBtn}>
            <Home size={16} /> Xem cua hang
          </a>
          <button type="button" className={styles.linkBtn} onClick={handleLogout}>
            <LogOut size={16} /> Dang xuat
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className={styles.headerRight}>
            <span className={styles.role}>Admin</span>
            <span>{user?.name}</span>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
      {sidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Dong menu"
        />
      )}
    </div>
  );
}
