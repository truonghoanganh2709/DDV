import HeroSection from '../components/home/HeroSection';
import QuickLinks from '../components/home/QuickLinks';
import ProductSection from '../components/home/ProductSection';
import { useData } from '../context/DataContext';
import styles from './Home.module.css';

export default function Home() {
  const { activeProducts } = useData();

  const flashSale = activeProducts.filter((p) => p.flashSale).slice(0, 5);
  const featured = activeProducts.filter((p) => p.featured).slice(0, 5);
  const onSale = activeProducts.filter((p) => (p.oldPrice || p.originalPrice) > p.price).slice(0, 5);
  const iphone = activeProducts.filter((p) => p.brand === 'Apple' && p.category === 'dien-thoai').slice(0, 5);
  const usedIphone = activeProducts.filter((p) => p.category === 'may-cu').slice(0, 5);
  const android = activeProducts.filter((p) =>
    ['OPPO', 'Xiaomi', 'TECNO', 'realme', 'HONOR'].includes(p.brand)
  ).slice(0, 5);

  return (
    <>
      <HeroSection />
      <QuickLinks />
      <ProductSection title="FLASH SALE" products={flashSale} flashSale viewAllLink="/products?onSale=1" />
      <ProductSection title="iPhone Chinh Hang" products={iphone} showApple viewAllLink="/products?brand=Apple" />
      <ProductSection title="iPhone Cu Gia Tot" products={usedIphone} viewAllLink="/products?category=may-cu" />
      <ProductSection title="OPPO | Xiaomi | TECNO | realme | HONOR" products={android} viewAllLink="/products" />
      <ProductSection title="San pham noi bat" products={featured} viewAllLink="/products?featured=1" />
      <ProductSection title="Khuyen mai hot" products={onSale} viewAllLink="/products?onSale=1" />
    </>
  );
}
