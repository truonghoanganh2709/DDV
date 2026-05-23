import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import styles from './ProductSection.module.css';

export default function ProductSection({
  title,
  products,
  filters,
  viewAllLink,
  flashSale,
  showApple,
}) {
  return (
    <section className={`${styles.section} ${flashSale ? styles.flash : ''}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={flashSale ? styles.flashTitle : 'section-title'}>{title}</h2>
          {filters && <div className={styles.filters}>{filters}</div>}
          {viewAllLink && (
            <Link to={viewAllLink} className={styles.viewAll}>
              Xem tat ca
            </Link>
          )}
        </div>
        <div className={styles.wrap}>
          {flashSale && (
            <button type="button" className={styles.navBtn} aria-label="Truoc">
              <ChevronLeft size={20} />
            </button>
          )}
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} showApple={showApple} />
            ))}
          </div>
          {flashSale && (
            <button type="button" className={styles.navBtn} aria-label="Sau">
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
