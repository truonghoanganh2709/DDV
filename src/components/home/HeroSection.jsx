import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Tablet,
  Laptop,
  Recycle,
  Headphones,
  Watch,
  Speaker,
  Tv,
  Home,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import styles from './HeroSection.module.css';

const ICON_MAP = {
  Smartphone,
  Tablet,
  Laptop,
  Recycle,
  Headphones,
  Watch,
  Speaker,
  Tv,
  Home,
};

const SLIDES = [
  {
    title: 'KHACH HANG MOI DOC QUYEN',
    subtitle: 'Uu dai len den 2 trieu',
    cta: 'LIEN HE MUA NGAY',
    bg: 'linear-gradient(135deg, #ff6b35, #d71920)',
  },
  {
    title: 'GALAXY S25 ULTRA',
    subtitle: 'Tang Galaxy Buds + Tra gop 0%',
    cta: 'MUA NGAY',
    bg: 'linear-gradient(135deg, #1a1a2e, #4a4ae8)',
  },
  {
    title: 'IPHONE 17 SERIES',
    subtitle: 'Chinh hang VN/A - Bao hanh 12 thang',
    cta: 'XEM NGAY',
    bg: 'linear-gradient(135deg, #ff9a9e, #d71920)',
  },
];

const SIDE_BANNERS = [
  { title: 'Thu cu doi moi', cta: 'Mua ngay', color: '#fff3e0' },
  { title: 'Galaxy S24 Ultra', cta: 'Mua ngay', color: '#e3f2fd' },
  { title: 'Redmi Note 13', cta: 'Mua ngay', color: '#fce4ec' },
];

export default function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[slideIndex];

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <aside className={styles.sidebar}>
          <ul>
            {CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Smartphone;
              return (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.id}`}>
                    <Icon size={18} />
                    <span>{cat.name}</span>
                    <ChevronRight size={16} className={styles.chevron} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className={styles.slider}>
          <div className={styles.slide} style={{ background: slide.bg }}>
            <div className={styles.slideContent}>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
              <Link to="/products" className="btn btn-primary">
                {slide.cta}
              </Link>
            </div>
          </div>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === slideIndex ? styles.dotActive : ''}
                onClick={() => setSlideIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.sideBanners}>
          {SIDE_BANNERS.map((b) => (
            <Link
              key={b.title}
              to="/products"
              className={styles.sideBanner}
              style={{ background: b.color }}
            >
              <h4>{b.title}</h4>
              <span className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                {b.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
