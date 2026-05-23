import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <div className="container">
        <ol>
          <li>
            <Link to={ROUTES.HOME}>Trang chu</Link>
          </li>
          {items.map((item, i) => (
            <li key={i}>
              <span className={styles.sep}>/</span>
              {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
