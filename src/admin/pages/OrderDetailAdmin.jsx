import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants/roles';
import '../../styles/admin.css';

export default function OrderDetailAdmin() {
  const { id } = useParams();
  const { getOrderById, updateOrder } = useData();
  const { showToast } = useToast();
  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="admin-empty">
        <p>Khong tim thay don hang</p>
        <Link to="/admin/orders">Quay lai</Link>
      </div>
    );
  }

  const changeStatus = async (status) => {
    await updateOrder(id, { status });
    showToast('Cap nhat trang thai thanh cong', 'success');
  };

  return (
    <div>
      <Link to="/admin/orders">&larr; Quay lai</Link>
      <h1 className="admin-page-title">Don hang {order.id}</h1>

      <div className="admin-card">
        <p>
          <strong>Trang thai:</strong> {ORDER_STATUS_LABELS[order.status]}
        </p>
        <div className="admin-toolbar">
          {Object.values(ORDER_STATUS).map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-btn-sm ${order.status === s ? 'btn-primary' : ''}`}
              onClick={() => changeStatus(s)}
            >
              {ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3>Thong tin khach hang</h3>
        <p>Ten: {order.customerName}</p>
        <p>SĐT: {order.phone}</p>
        <p>Email: {order.email}</p>
        <p>Dia chi: {order.address}</p>
        <p>Ghi chu: {order.note || '-'}</p>
        <p>Thanh toan: {order.paymentMethod}</p>
        <p>Ngay dat: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
      </div>

      <div className="admin-card">
        <h3>San pham</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ten</th>
              <th>SL</th>
              <th>Gia</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16 }}>
          <strong>Tong cong: {formatPrice(order.total)}</strong>
        </p>
      </div>
    </div>
  );
}
