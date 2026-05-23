import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { formatPrice, calcDiscountPercent } from '../../utils/formatPrice';
import { useWishlist } from '../../context/WishlistContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, showApple }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const discount = calcDiscountPercent(product.price, product.originalPrice, product.oldPrice);
  const wished = isInWishlist(product.id);

  return (
    <article className={styles.card}>
      <div className={styles.badges}>
        {product.installment && <span className={styles.installment}>Tra gop 0%</span>}
        {discount > 0 && <span className={styles.discount}>- {discount}%</span>}
      </div>
      <button
        type="button"
        className={`${styles.wishBtn} ${wished ? styles.wished : ''}`}
        onClick={() => toggleWishlist(product.id)}
        aria-label="Yeu thich"
      >
        <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
      </button>
      {showApple && product.brand === 'Apple' && (
        <div className={styles.appleBadge}>Apple Authorized</div>
      )}
      <Link to={`/products/${product.id}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className={styles.body}>
        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        {(product.oldPrice || product.originalPrice) > product.price && (
          <p className={styles.oldPrice}>{formatPrice(product.oldPrice || product.originalPrice)}</p>
        )}
        {product.promos?.length > 0 && (
          <div className={styles.promos}>
            {product.promos.slice(0, 2).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(product.rating) ? 'var(--star)' : 'none'}
              stroke="var(--star)"
            />
          ))}
          <span>{product.rating}</span>
        </div>
      </div>
    </article>
  );
}
