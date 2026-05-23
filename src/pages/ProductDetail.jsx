import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductCard from '../components/common/ProductCard';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, calcDiscountPercent } from '../utils/formatPrice';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, activeProducts } = useData();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [color, setColor] = useState(product?.colors?.[0] || null);
  const [imageIndex, setImageIndex] = useState(0);
  const [expandedDesc, setExpandedDesc] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: 48, textAlign: 'center' }}>
        <p>San pham khong ton tai.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
          Quay lai danh sach
        </Link>
      </div>
    );
  }

  const related = activeProducts
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 5);
  const discount = calcDiscountPercent(product.price, product.originalPrice, product.oldPrice);
  const images = product.images || [product.image];

  const handleBuyNow = () => {
    const r = addToCart(product, 1, color);
    if (!r.ok) { showToast(r.message, 'error'); return; }
    navigate('/checkout');
  };

  const handleAddCart = () => {
    const r = addToCart(product, 1, color);
    if (r.ok) showToast('Da them vao gio hang', 'success');
    else showToast(r.message, 'error');
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'San pham', to: '/products' },
          { label: product.name },
        ]}
      />
      <div className={`container ${styles.page}`}>
        <div className={styles.top}>
          <div className={styles.gallery}>
            {product.brand === 'Apple' && <div className={styles.aar}>Apple Authorized Reseller</div>}
            <img src={images[imageIndex]} alt={product.name} className={styles.mainImg} />
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === imageIndex ? styles.thumbActive : ''}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
            <div className={styles.infoBox}>
              <h4>Thong tin san pham</h4>
              <ul>
                <li>San pham moi 100%, nguyen seal</li>
                <li>Chinh hang, day du phu kien</li>
                <li>Bao hanh 12 thang</li>
              </ul>
            </div>
          </div>

          <div className={styles.buyBox}>
            <h1>{product.name}</h1>
            <p className={styles.sku}>No.{product.id}</p>
            {product.colors?.length > 0 && (
              <div className={styles.colors}>
                <span>Mau sac:</span>
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={color === c ? styles.colorActive : ''}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <p className={styles.price}>{formatPrice(product.price)}</p>
            {product.originalPrice > product.price && (
              <p className={styles.oldPrice}>
                {formatPrice(product.originalPrice)}
                {discount > 0 && <span className={styles.off}>-{discount}%</span>}
              </p>
            )}
            <div className={styles.promoBox}>
              <h4>Khuyen mai</h4>
              <ol>
                {product.promos?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
                <li>Tra gop 0% qua the tin dung</li>
                <li>Mua kem phu kien giam them 10%</li>
              </ol>
            </div>
            <button type="button" className={`btn btn-primary btn-block ${styles.buyBtn}`} onClick={handleBuyNow}>
              <Zap size={20} />
              MUA NGAY
              <small>Giao tan noi hoac nhan tai cua hang</small>
            </button>
            <button type="button" className={`btn btn-outline btn-block`} onClick={handleAddCart}>
              <ShoppingCart size={18} />
              Them vao gio hang
            </button>
            <div className={styles.installBtns}>
              <button type="button" className="btn btn-blue btn-block">
                TRA GOP 0% QUA THE
              </button>
              <button type="button" className="btn btn-blue btn-block">
                TRA GOP 0% Xet duyet 5 phut
              </button>
            </div>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.rating) ? 'var(--star)' : 'none'} stroke="var(--star)" />
              ))}
              <span>{product.rating} ({product.reviewCount} danh gia)</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.desc}>
            <h2 className="section-title">Mo ta san pham</h2>
            <p className={expandedDesc ? '' : styles.clamp}>{product.description}</p>
            <button type="button" className={styles.seeMore} onClick={() => setExpandedDesc(!expandedDesc)}>
              {expandedDesc ? 'Thu gon' : 'Xem them'}
            </button>
            <h2 className="section-title" style={{ marginTop: 32 }}>
              Danh gia tu nguoi dung
            </h2>
            <div className={styles.reviews}>
              <div className={styles.reviewScore}>
                <strong>{product.rating}</strong>
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} fill="var(--star)" stroke="var(--star)" />
                  ))}
                </div>
                <p>{product.reviewCount} nguoi da danh gia</p>
              </div>
            </div>
          </div>
          <aside className={styles.specs}>
            <h2 className="section-title">Thong so ky thuat</h2>
            <table>
              <tbody>
                {Object.entries(product.specs || {}).map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>
        </div>

        <section className={styles.related}>
          <h2 className="section-title">San pham lien quan</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
