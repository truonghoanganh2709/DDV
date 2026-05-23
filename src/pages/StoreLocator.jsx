import { useState, useMemo } from 'react';
import { MapPin, Phone } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import { STORES, PROVINCES } from '../data/stores';
import styles from './StoreLocator.module.css';

export default function StoreLocator() {
  const [province, setProvince] = useState('');
  const [selectedId, setSelectedId] = useState(STORES[0]?.id);

  const filtered = useMemo(() => {
    if (!province) return STORES;
    return STORES.filter((s) => s.province === province);
  }, [province]);

  const selected = STORES.find((s) => s.id === selectedId) || filtered[0];

  return (
    <>
      <Breadcrumb items={[{ label: 'Cua hang gan ban' }]} />
      <div className={`container ${styles.page}`}>
        <div className={`card ${styles.card}`}>
          <div className={styles.left}>
            <h1>Tim cua hang gan ban</h1>
            <div className={styles.filters}>
              <select value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Tat ca tinh/thanh</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.count}>Co {filtered.length} cua hang gan ban</p>
            <ul className={styles.list}>
              {filtered.map((store) => (
                <li
                  key={store.id}
                  className={selected?.id === store.id ? styles.active : ''}
                  onClick={() => setSelectedId(store.id)}
                >
                  <h3>{store.name}</h3>
                  <p>
                    <MapPin size={14} /> {store.address}
                  </p>
                  <p>
                    <Phone size={14} /> {store.phone}
                  </p>
                  <span className={styles.status}>{store.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.map}>
            <iframe
              title="Ban do cua hang"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selected?.lng - 0.02}%2C${selected?.lat - 0.02}%2C${selected?.lng + 0.02}%2C${selected?.lat + 0.02}&layer=mapnik&marker=${selected?.lat}%2C${selected?.lng}`}
              loading="lazy"
            />
            <p className={styles.mapLabel}>{selected?.name}</p>
          </div>
        </div>
      </div>
    </>
  );
}
