import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Tablet, Laptop, Recycle, Headphones, Watch, Speaker, Tv, Home, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './HeroSection.module.css';

const ICON_MAP = { Smartphone, Tablet, Laptop, Recycle, Headphones, Watch, Speaker, Tv, Home };

const SIDE_BANNERS = [
  { title: 'Thu cu doi moi', cta: 'Mua ngay', color: '#fff3e0', link: '/products?category=may-cu' },
  { title: 'Galaxy S25 Ultra', cta: 'Mua ngay', color: '#e3f2fd', link: '/products/p005' },
  { title: 'Redmi Note 13', cta: 'Mua ngay', color: '#fce4ec', link: '/products/p009' },
];

export default function HeroSection() {
  const { banners, categories } = useData();
  const slides = banners.filter((b) => b.active).sort((a, b) => a.order - b.order);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[slideIndex] || slides[0];

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <aside className={styles.sidebar}>
          <ul>
            {categories.filter((c) => c.active).map((cat) => {
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
          {slide && (
            <div className={styles.slide} style={{ background: slide.bg }}>
              <div className={styles.slideContent}>
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Link to={slide.link || '/products'} className="btn btn-primary">{slide.cta || 'Mua ngay'}</Link>
              </div>
            </div>
          )}
          <div className={styles.dots}>
            {slides.map((_, i) => (
              <button key={i} type="button" className={i === slideIndex ? styles.dotActive : ''} onClick={() => setSlideIndex(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
        <div className={styles.sideBanners}>
          {SIDE_BANNERS.map((b) => (
            <Link key={b.title} to={b.link} className={styles.sideBanner} style={{ background: b.color }}>
              <h4>{b.title}</h4>
              <span className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>{b.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
