import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../data/products';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { ids } = useWishlist();
  const products = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <>
      <Breadcrumb items={[{ label: 'San pham yeu thich' }]} />
      <div className={`container ${styles.page}`}>
        <h1 className="section-title">
          <Heart size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Danh sach yeu thich ({products.length})
        </h1>
        {products.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p className="text-muted">Chua co san pham yeu thich.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
              Kham pha san pham
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} showApple={p.brand === 'Apple'} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
