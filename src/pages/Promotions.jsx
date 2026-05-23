import { Link } from 'react-router-dom';
import { Ticket, Copy } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/common/ProductCard';
import styles from './Promotions.module.css';

export default function Promotions() {
  const { promotions, activeProducts } = useData();
  const { showToast } = useToast();
  const activePromos = promotions.filter((p) => p.active);
  const saleProducts = activeProducts.filter((p) => (p.oldPrice || 0) > p.price).slice(0, 10);

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Da sao chep ma ${code}`, 'info');
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Khuyen mai' }]} />
      <div className={`container ${styles.page}`}>
        <h1 className="section-title">Ma khuyen mai</h1>
        <div className={styles.promoGrid}>
          {activePromos.map((p) => (
            <div key={p.id} className={styles.promoCard}>
              <Ticket size={32} color="var(--primary)" />
              <div>
                <strong className={styles.code}>{p.code}</strong>
                <p>{p.name}</p>
                <small>
                  {p.type === 'percent' ? `Giam ${p.value}%` : `Giam ${p.value.toLocaleString('vi-VN')}d`}
                  {p.minOrder > 0 && ` - Don tu ${p.minOrder.toLocaleString('vi-VN')}d`}
                </small>
              </div>
              <button type="button" className="admin-btn-sm" onClick={() => copyCode(p.code)}>
                <Copy size={14} /> Sao chep
              </button>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ marginTop: 32 }}>
          San pham dang giam gia
        </h2>
        <div className={styles.grid}>
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} showApple={p.brand === 'Apple'} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/products?onSale=1" className="btn btn-primary">
            Xem tat ca
          </Link>
        </div>
      </div>
    </>
  );
}
