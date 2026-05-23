import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import styles from './QuickLinks.module.css';

const QUICK = PRODUCTS.filter((p) => p.featured).slice(0, 12);

export default function QuickLinks() {
  return (
    <section className={styles.quick}>
      <div className="container">
        <div className={styles.grid}>
          {QUICK.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className={styles.item}>
              <img src={p.image} alt={p.name} />
              <span>{p.name.split(' ').slice(0, 3).join(' ')}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
