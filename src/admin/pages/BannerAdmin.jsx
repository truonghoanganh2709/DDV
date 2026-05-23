import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/admin.css';

export default function BannerAdmin() {
  const { banners, saveBanners } = useData();
  const { showToast } = useToast();
  const [list, setList] = useState(banners);

  useEffect(() => {
    setList(banners);
  }, [banners]);

  const toggle = async (id) => {
    const next = list.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    setList(next);
    await saveBanners(next);
    showToast('Cap nhat banner', 'success');
  };

  return (
    <div>
      <h1 className="admin-page-title">Quan ly banner</h1>
      <div className="admin-card">
        {list.map((b) => (
          <div
            key={b.id}
            style={{
              background: b.bg,
              padding: 20,
              borderRadius: 8,
              marginBottom: 12,
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{b.title}</strong>
              <p style={{ opacity: 0.9, fontSize: 13 }}>{b.subtitle}</p>
              <small>Link: {b.link}</small>
            </div>
            <button type="button" className="admin-btn-sm" onClick={() => toggle(b.id)}>
              {b.active ? 'Dang hien' : 'An'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
