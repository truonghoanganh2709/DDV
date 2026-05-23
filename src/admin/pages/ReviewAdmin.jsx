import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/admin.css';

export default function ReviewAdmin() {
  const { reviews, saveReviews } = useData();
  const { showToast } = useToast();

  const toggle = (id) => {
    const next = reviews.map((r) =>
      r.id === id ? { ...r, status: r.status === 'visible' ? 'hidden' : 'visible' } : r
    );
    saveReviews(next);
    showToast('Cap nhat danh gia', 'success');
  };

  return (
    <div>
      <h1 className="admin-page-title">Quan ly danh gia</h1>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SP</th>
              <th>Nguoi dung</th>
              <th>Sao</th>
              <th>Noi dung</th>
              <th>Trang thai</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.productId}</td>
                <td>{r.userName}</td>
                <td>{r.rating}/5</td>
                <td>{r.comment}</td>
                <td>{r.status}</td>
                <td>
                  <button type="button" className="admin-btn-sm" onClick={() => toggle(r.id)}>
                    {r.status === 'visible' ? 'An' : 'Hien'}
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
