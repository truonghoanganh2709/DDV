import { Headphones, ChevronUp } from 'lucide-react';
import styles from './FloatingActions.module.css';

export default function FloatingActions() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={styles.floating}>
      <a href="tel:18006018" className={styles.btn} aria-label="Ho tro">
        <Headphones size={22} />
      </a>
      <button type="button" className={styles.btn} onClick={scrollTop} aria-label="Len dau">
        <ChevronUp size={22} />
        <span>Len dau</span>
      </button>
    </div>
  );
}
