import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/admin.css';

export default function PromotionAdmin() {
  const { promotions, savePromotions } = useData();
  const { showToast } = useToast();
  const [list, setList] = useState(promotions);

  const sync = (next) => {
    setList(next);
    savePromotions(next);
  };

  const toggle = (id) => {
    sync(list.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    showToast('Cap nhat thanh cong', 'success');
  };

  return (
    <div>
      <h1 className="admin-page-title">Quan ly khuyen mai</h1>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ma</th>
              <th>Ten</th>
              <th>Loai</th>
              <th>Gia tri</th>
              <th>Don toi thieu</th>
              <th>HSD</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.code}</strong>
                </td>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.type === 'percent' ? `${p.value}%` : p.value}</td>
                <td>{p.minOrder?.toLocaleString('vi-VN')}d</td>
                <td>{p.expiresAt}</td>
                <td>
                  <button type="button" className="admin-btn-sm" onClick={() => toggle(p.id)}>
                    {p.active ? 'Dang bat' : 'Tat'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
