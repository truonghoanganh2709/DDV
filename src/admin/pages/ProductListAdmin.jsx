import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { PRODUCT_STATUS } from '../../constants/roles';
import '../../styles/admin.css';

export default function ProductListAdmin() {
  const { products, categories, deleteProduct } = useData();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [brand, setBrand] = useState('all');
  const [status, setStatus] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (status !== 'all' && p.status !== status) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search, cat, brand, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      showToast('Da xoa san pham', 'success');
      setDeleteId(null);
    }
  };

  const statusBadge = (s) => {
    if (s === PRODUCT_STATUS.ACTIVE) return 'badge badge-active';
    if (s === PRODUCT_STATUS.HIDDEN) return 'badge badge-hidden';
    return 'badge badge-out';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          Quan ly san pham
        </h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          <Plus size={18} /> Them san pham
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            placeholder="Tim kiem san pham..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">Tat ca danh muc</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">Tat ca hang</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tat ca trang thai</option>
            <option value="active">Dang ban</option>
            <option value="hidden">An</option>
            <option value="out_of_stock">Het hang</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="admin-empty">Khong co san pham</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Anh</th>
                  <th>Ten</th>
                  <th>Hang</th>
                  <th>Gia</th>
                  <th>Ton</th>
                  <th>Da ban</th>
                  <th>TT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image} alt="" />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>{p.sold}</td>
                    <td>
                      <span className={statusBadge(p.status)}>{p.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link to={`/admin/products/edit/${p.id}`} className="admin-btn-sm">
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          className="admin-btn-sm admin-btn-danger"
                          onClick={() => setDeleteId(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Xoa san pham"
        message="Ban co chac muon xoa san pham nay?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
