import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS } from '../../constants/roles';
import '../../styles/admin.css';

export default function Dashboard() {
  const { products, orders, users, reviews } = useData();

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status === ORDER_STATUS.COMPLETED)
      .reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;
    return {
      revenue,
      totalOrders: orders.length,
      pending,
      products: products.length,
      users: users.filter((u) => u.role === 'user').length,
      reviews: reviews.length,
    };
  }, [orders, products, users, reviews]);

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Doanh thu (hoan thanh)</span>
          <strong>{formatPrice(stats.revenue)}</strong>
        </div>
        <div className="admin-stat">
          <span>Tong don hang</span>
          <strong>{stats.totalOrders}</strong>
        </div>
        <div className="admin-stat">
          <span>Don cho xu ly</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="admin-stat">
          <span>San pham</span>
          <strong>{stats.products}</strong>
        </div>
        <div className="admin-stat">
          <span>Nguoi dung</span>
          <strong>{stats.users}</strong>
        </div>
        <div className="admin-stat">
          <span>Danh gia</span>
          <strong>{stats.reviews}</strong>
        </div>
      </div>

      <div className="admin-card">
        <h3>Don hang gan day</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ma don</th>
                <th>Khach hang</th>
                <th>Tong</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/admin/orders/${o.id}`}>{o.id}</Link>
                  </td>
                  <td>{o.customerName}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
