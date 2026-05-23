import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import '../../styles/admin.css';

export default function CategoryAdmin() {
  const { categories, saveCategories } = useData();
  const { showToast } = useToast();
  const [list, setList] = useState(categories);
  const [form, setForm] = useState({ id: '', name: '', slug: '', active: true });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setList(categories);
  }, [categories]);

  const sync = (next) => {
    setList(next);
    return saveCategories(next);
  };

  const add = async () => {
    if (!form.name) return;
    const id = form.id || form.slug || `cat-${Date.now()}`;
    if (list.some((c) => c.id === id)) {
      showToast('ID da ton tai', 'error');
      return;
    }
    await sync([...list, { ...form, id, slug: form.slug || id }]);
    setForm({ id: '', name: '', slug: '', active: true });
    showToast('Da them danh muc', 'success');
  };

  const toggle = async (id) => {
    await sync(list.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const remove = async () => {
    await sync(list.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    showToast('Da xoa danh muc', 'success');
  };

  return (
    <div>
      <h1 className="admin-page-title">Quan ly danh muc</h1>
      <div className="admin-card admin-form-grid">
        <div>
          <label>ID</label>
          <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="dien-thoai" />
        </div>
        <div>
          <label>Ten</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>Slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={add}>
            Them
          </button>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ten</th>
              <th>Slug</th>
              <th>Trang thai</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>
                  <button type="button" className="admin-btn-sm" onClick={() => toggle(c.id)}>
                    {c.active ? 'Dang hien' : 'An'}
                  </button>
                </td>
                <td>
                  <button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => setDeleteId(c.id)}>
                    Xoa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Xoa danh muc"
        message="Xoa danh muc nay?"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
