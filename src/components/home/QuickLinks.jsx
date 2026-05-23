import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import styles from './QuickLinks.module.css';

export default function QuickLinks() {
  const { activeProducts } = useData();
  const quick = activeProducts.filter((p) => p.featured).slice(0, 12);

  return (
    <section className={styles.quick}>
      <div className="container">
        <div className={styles.grid}>
          {quick.map((p) => (
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
