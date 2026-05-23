import styles from './Footer.module.css';

const ABOUT_LINKS = [
  'Gioi thieu ve cong ty',
  'Khach hang Doanh nghiep (B2B)',
  'Uu dai danh cho giao duc',
  'Danh sach cua hang',
  'Tuyen dung moi nhat',
  'Huong dan mua hang Online',
  'Huong dan mua hang tra gop',
  'Huong dan thanh toan VNPAY',
];

const POLICY_LINKS = [
  'Chinh sach bao hanh',
  'Chinh sach ban hang',
  'Chinh sach bao mat',
  'Chinh sach kiem hang',
  'Trung tam bao hanh Apple tai Viet Nam',
];

const PRODUCT_LINKS = [
  'iPhone 17 | iPhone Air',
  'Samsung Galaxy S25',
  'Samsung Z Fold 7 | Z Flip 7',
  'Xiaomi | OPPO | realme',
  'MacBook | MacBook Pro | Air',
  'iPad | AirPods',
];

const PAYMENTS = ['SePay', 'VNPAY', 'MoMo', 'OnePay', 'ZaloPay', 'Payoo', 'Apple Pay'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.mediaBar}>
        <div className="container">
          <span>THANH NIEN</span>
          <span>24h</span>
          <span>THE GIOI SO</span>
          <span>BAO CONG THUONG</span>
          <span>SAI GON ONLINE</span>
        </div>
      </div>

      <div className={`container ${styles.main}`}>
        <div className={styles.columns}>
          <div>
            <h3>Ve chung toi</h3>
            <ul>
              {ABOUT_LINKS.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Chinh sach</h3>
            <ul>
              {POLICY_LINKS.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Tong dai ho tro (Mien phi)</h3>
            <ul className={styles.hotlines}>
              <li>
                Mua ngay: <strong>1800.6018</strong> (07:30 - 21:30)
              </li>
              <li>
                Bao hanh: <strong>1800.6729</strong> (08:00 - 21:00)
              </li>
              <li>
                Gop y: <strong>1800.6306</strong> (08:30 - 21:30)
              </li>
            </ul>
            <h4>Phuong thuc thanh toan</h4>
            <div className={styles.payments}>
              {PAYMENTS.map((p) => (
                <span key={p} className={styles.payBadge}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>Ket noi voi Di Dong Viet</h3>
            <div className={styles.social}>
              {['Zalo', 'FB', 'IG', 'YT', 'TT'].map((s) => (
                <span key={s} className={styles.socialIcon}>
                  {s}
                </span>
              ))}
            </div>
            <h4>Tai ngay ung dung</h4>
            <div className={styles.app}>
              <div className={styles.qr}>QR</div>
              <div>
                <span className={styles.storeBtn}>App Store</span>
                <span className={styles.storeBtn}>Google Play</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productLinks}>
          {PRODUCT_LINKS.map((l) => (
            <a key={l} href="#">
              {l}
            </a>
          ))}
        </div>

        <div className={styles.legal}>
          <p>
            Cong ty TNHH Di Dong Viet. Dia chi: 116-118-120 Nguyen Chi Thanh, Quan 5, TP.HCM.
            <br />
            MST: 0312193315. Hotline: 1800.6018. Email: contact@didongviet.vn
            <br />
            &copy; 2025 Di Dong Viet. All rights reserved.
          </p>
          <div className={styles.badges}>
            <span>NCSC</span>
            <span>DMCA</span>
            <span>Bo Cong Thuong</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
