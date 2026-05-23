import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS_LABELS } from '../../constants/roles';
import '../../styles/admin.css';

export default function OrderListAdmin() {
  const { orders } = useData();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.phone?.includes(q)
        );
      }
      return true;
    });
  }, [orders, status, search]);

  return (
    <div>
      <h1 className="admin-page-title">Quan ly don hang</h1>
      <div className="admin-card">
        <div className="admin-toolbar">
          <input placeholder="Tim ma don, ten, SĐT..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tat ca</option>
            <option value="pending">Cho xac nhan</option>
            <option value="confirmed">Da xac nhan</option>
            <option value="shipping">Dang giao</option>
            <option value="completed">Hoan thanh</option>
            <option value="cancelled">Da huy</option>
          </select>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ma don</th>
              <th>Khach hang</th>
              <th>SĐT</th>
              <th>Tong</th>
              <th>Thanh toan</th>
              <th>Trang thai</th>
              <th>Ngay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customerName}</td>
                <td>{o.phone}</td>
                <td>{formatPrice(o.total)}</td>
                <td>{o.paymentMethod}</td>
                <td>{ORDER_STATUS_LABELS[o.status] || o.status}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <Link to={`/admin/orders/${o.id}`} className="admin-btn-sm">
                    Chi tiet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
