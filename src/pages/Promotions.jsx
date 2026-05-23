import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import styles from './Promotions.module.css';

const PROMOS = [
  {
    title: 'FLASH SALE - Giam den 50%',
    desc: 'Ap dung cho dien thoai cu va phu kien',
    color: '#d71920',
  },
  {
    title: 'Tra gop 0% - Thu cu doi moi',
    desc: 'Ho tro tra gop qua the va cong ty tai chinh',
    color: '#0066cc',
  },
  {
    title: 'Uu dai HSSV',
    desc: 'Giam them 200K khi xuat trinh the sinh vien',
    color: '#16a34a',
  },
];

export default function Promotions() {
  const saleProducts = PRODUCTS.filter((p) => p.originalPrice > p.price);

  return (
    <>
      <Breadcrumb items={[{ label: 'Khuyen mai' }]} />
      <div className={`container ${styles.page}`}>
        <h1 className="section-title">Khuyen mai hot</h1>
        <div className={styles.banners}>
          {PROMOS.map((p) => (
            <div key={p.title} className={styles.banner} style={{ borderColor: p.color }}>
              <h2 style={{ color: p.color }}>{p.title}</h2>
              <p>{p.desc}</p>
              <Link to="/products?onSale=1" className="btn btn-primary">
                Xem ngay
              </Link>
            </div>
          ))}
        </div>
        <h2 className="section-title" style={{ marginTop: 32 }}>
          San pham dang giam gia
        </h2>
        <div className={styles.grid}>
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}
