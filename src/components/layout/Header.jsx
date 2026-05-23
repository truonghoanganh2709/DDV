import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Phone,
  MapPin,
  ClipboardList,
  Ticket,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  Shield,
} from 'lucide-react';
import SearchBar from './SearchBar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { to: ROUTES.STORES, icon: MapPin, label: 'Cửa hàng gần bạn', short: 'Cửa hàng' },
  { to: ROUTES.TRACK_ORDER, icon: ClipboardList, label: 'Tra cứu đơn hàng', short: 'Tra cứu' },
  { to: ROUTES.PROMOTIONS, icon: Ticket, label: 'Khuyến mãi', short: 'KM' },
  { to: ROUTES.CART, icon: ShoppingCart, label: 'Giỏ hàng', short: 'Giỏ', badge: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin, user } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className="container">
          <ul>
            <li>{'Thu Cũ Đổi Mới'}</li>
            <li>{'Trả Trước 0đ Trả Góp 0%'}</li>
            <li>{'Bảo Hành 100% Đổi Mới'}</li>
          </ul>
        </div>
      </div>

      <div className={styles.mainBar}>
        <div className={`container ${styles.mainInner}`}>
          <Link to={ROUTES.HOME} className={styles.logo}>
            <span className={styles.logoIcon}>D</span>
            <span>didongviet.vn</span>
          </Link>

          <button type="button" className={styles.categoryBtn}>
            <LayoutGrid size={18} />
            <span>{'Danh mục'}</span>
          </button>

          <div className={styles.searchWrap}>
            <SearchBar />
          </div>

          <a href="tel:18006018" className={styles.hotline}>
            <Phone size={22} />
            <div>
              <small>{'Đặt hàng'}</small>
              <strong>1800 6018</strong>
            </div>
          </a>

          <nav className={styles.nav}>
            {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.iconWrap}>
                  <Icon size={22} />
                  {badge && itemCount > 0 && (
                    <span className={styles.badge}>{itemCount}</span>
                  )}
                </span>
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={styles.navItem}>
                <Shield size={22} />
                <span className={styles.navLabel}>Admin</span>
              </NavLink>
            )}
            <NavLink
              to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
              className={styles.navItem}
            >
              <User size={22} />
              <span className={styles.navLabel}>
                {isAuthenticated ? user?.name?.split(' ').pop() : 'Tai khoan'}
              </span>
            </NavLink>
            <NavLink to={ROUTES.WISHLIST} className={styles.navItem}>
              <Heart size={22} />
              <span className={styles.navLabel}>Yêu thích</span>
            </NavLink>
          </nav>

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <SearchBar />
          <nav>
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                <Icon size={18} /> {label}
              </Link>
            ))}
            <Link to={ROUTES.HOME} onClick={() => setMobileOpen(false)}>
              Trang chủ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
