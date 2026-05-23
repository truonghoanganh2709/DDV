import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { useData } from '../context/DataContext';
import { BRANDS, PRICE_RANGES } from '../data/categories';
import { filterProducts } from '../utils/filterProducts';
import styles from './ProductList.module.css';

const RAM_OPTIONS = ['all', '4GB', '6GB', '8GB', '12GB', '16GB'];
const STORAGE_OPTIONS = ['all', '64GB', '128GB', '256GB', '512GB', '1TB'];

export default function ProductList() {
  const { activeProducts, categories } = useData();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      category: params.get('category') || 'all',
      brand: params.get('brand') || 'all',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      search: params.get('search') || '',
      sort: params.get('sort') || '',
      ram: params.get('ram') || 'all',
      storage: params.get('storage') || 'all',
      featured: params.get('featured') === '1',
      onSale: params.get('onSale') === '1',
    }),
    [params]
  );

  const products = useMemo(
    () => filterProducts(activeProducts, filters),
    [activeProducts, filters]
  );

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const setPriceRange = (range) => {
    const next = new URLSearchParams(params);
    if (range.id === 'all') {
      next.delete('minPrice');
      next.delete('maxPrice');
    } else {
      if (range.min != null) next.set('minPrice', String(range.min));
      else next.delete('minPrice');
      if (range.max != null) next.set('maxPrice', String(range.max));
      else next.delete('maxPrice');
    }
    setParams(next);
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'San pham' }]} />
      <div className={`container ${styles.page}`}>
        <aside className={styles.sidebar}>
          <h3>Bo loc</h3>
          <div className={styles.filterGroup}>
            <h4>Danh muc</h4>
            <button type="button" className={!filters.category || filters.category === 'all' ? styles.active : ''} onClick={() => setFilter('category', 'all')}>Tat ca</button>
            {categories.filter((c) => c.active).map((c) => (
              <button key={c.id} type="button" className={filters.category === c.id ? styles.active : ''} onClick={() => setFilter('category', c.id)}>{c.name}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <h4>Hang</h4>
            <button type="button" className={filters.brand === 'all' ? styles.active : ''} onClick={() => setFilter('brand', 'all')}>Tat ca</button>
            {BRANDS.map((b) => (
              <button key={b} type="button" className={filters.brand === b ? styles.active : ''} onClick={() => setFilter('brand', b)}>{b}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <h4>RAM</h4>
            {RAM_OPTIONS.map((r) => (
              <button key={r} type="button" className={filters.ram === r ? styles.active : ''} onClick={() => setFilter('ram', r)}>{r === 'all' ? 'Tat ca' : r}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <h4>Bo nho</h4>
            {STORAGE_OPTIONS.map((s) => (
              <button key={s} type="button" className={filters.storage === s ? styles.active : ''} onClick={() => setFilter('storage', s)}>{s === 'all' ? 'Tat ca' : s}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <h4>Muc gia</h4>
            {PRICE_RANGES.map((r) => (
              <button key={r.id} type="button" onClick={() => setPriceRange(r)}>{r.label}</button>
            ))}
          </div>
        </aside>
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <p>{products.length} san pham</p>
            <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
              <option value="">Mac dinh</option>
              <option value="price-asc">Gia tang dan</option>
              <option value="price-desc">Gia giam dan</option>
              <option value="rating">Danh gia cao</option>
              <option value="sold">Ban chay</option>
              <option value="name">Ten A-Z</option>
            </select>
          </div>
          {products.length === 0 ? (
            <p className={styles.empty}>Khong tim thay san pham phu hop.</p>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} showApple={p.brand === 'Apple'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
