import HeroSection from '../components/home/HeroSection';
import QuickLinks from '../components/home/QuickLinks';
import ProductSection from '../components/home/ProductSection';
import { PRODUCTS } from '../data/products';
import styles from './Home.module.css';

const IPHONE_FILTERS = [
  { id: 'all', label: 'Xem t\u1ea5t c\u1ea3' },
  { id: '17', label: 'iPhone 17 Series' },
  { id: 'air', label: 'iPhone Air' },
  { id: '16', label: 'iPhone 16 Series' },
  { id: '15', label: 'iPhone 15 Series' },
];

export default function Home() {
  const flashSale = PRODUCTS.filter((p) => p.flashSale).slice(0, 5);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 5);
  const onSale = PRODUCTS.filter((p) => p.originalPrice > p.price).slice(0, 5);
  const iphone = PRODUCTS.filter((p) => p.brand === 'Apple' && p.category === 'dien-thoai').slice(0, 5);
  const usedIphone = PRODUCTS.filter((p) => p.category === 'may-cu').slice(0, 5);
  const android = PRODUCTS.filter((p) =>
    ['OPPO', 'Xiaomi', 'TECNO', 'realme', 'HONOR'].includes(p.brand)
  ).slice(0, 5);

  const iphoneFilters = (
    <div className={styles.filterRow}>
      {IPHONE_FILTERS.map((f) => (
        <button key={f.id} type="button" className={styles.filterPill}>
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <HeroSection />
      <QuickLinks />
      <ProductSection
        title="FLASH SALE"
        products={flashSale}
        flashSale
        viewAllLink="/products?onSale=1"
      />
      <ProductSection
        title="iPhone Ch\u00ednh H\u00e3ng (Apple Authorized Reseller)"
        products={iphone}
        showApple
        filters={iphoneFilters}
        viewAllLink="/products?brand=Apple"
      />
      <ProductSection
        title="iPhone C\u0169 Gi\u00e1 T\u1ed1t"
        products={usedIphone}
        viewAllLink="/products?category=may-cu"
      />
      <ProductSection
        title="OPPO | Xiaomi | TECNO | realme | HONOR Ch\u00ednh H\u00e3ng"
        products={android}
        viewAllLink="/products"
      />
      <ProductSection title="S\u1ea3n ph\u1ea9m n\u1ed5i b\u1eadt" products={featured} viewAllLink="/products?featured=1" />
      <ProductSection title="Khuy\u1ebfn m\u00e3i hot" products={onSale} viewAllLink="/products?onSale=1" />
      <section className={styles.promoStrip}>
        <div className="container card">
          <div className={styles.promoInner}>
            <div>
              <h3>Galaxy Buds4 / Buds4 Pro</h3>
              <p className="text-muted">Gia chi tu: 4.490.000\u0111</p>
              <a href="/products/p019" className="btn btn-primary">
                Mua ngay
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
