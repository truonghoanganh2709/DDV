import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { PRODUCT_STATUS } from '../../constants/roles';
import '../../styles/admin.css';

const EMPTY = {
  name: '',
  brand: 'Apple',
  category: 'dien-thoai',
  price: '',
  oldPrice: '',
  image: '',
  images: '',
  stock: 50,
  description: '',
  ram: '8GB',
  storage: '128GB',
  rating: 4.5,
  sold: 0,
  status: PRODUCT_STATUS.ACTIVE,
  featured: false,
  flashSale: false,
  installment: true,
};

export default function ProductFormAdmin() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct, categories } = useData();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (isEdit) {
      const p = getProductById(id, { includeHidden: true });
      if (p) {
        setForm({
          ...p,
          price: String(p.price),
          oldPrice: String(p.oldPrice || p.originalPrice || ''),
          images: (p.images || []).join('\n'),
        });
      }
    }
  }, [id, isEdit, getProductById]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Vui long nhap ten va gia', 'error');
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || Number(form.price),
      originalPrice: Number(form.oldPrice) || Number(form.price),
      stock: Number(form.stock),
      sold: Number(form.sold),
      rating: Number(form.rating),
      images: form.images
        ? form.images.split('\n').map((s) => s.trim()).filter(Boolean)
        : [form.image],
      image: form.image || form.images?.split('\n')[0] || '',
      specs: { RAM: form.ram, 'Bo nho': form.storage },
    };

    if (isEdit) {
      updateProduct(id, payload);
      showToast('Cap nhat san pham thanh cong', 'success');
    } else {
      addProduct(payload);
      showToast('Them san pham thanh cong', 'success');
    }
    navigate('/admin/products');
  };

  return (
    <div>
      <h1 className="admin-page-title">{isEdit ? 'Sua san pham' : 'Them san pham'}</h1>
      <form className="admin-card admin-form-grid" onSubmit={submit}>
        <div className="full">
          <label>Ten san pham *</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div>
          <label>Hang</label>
          <input name="brand" value={form.brand} onChange={onChange} />
        </div>
        <div>
          <label>Danh muc</label>
          <select name="category" value={form.category} onChange={onChange}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Gia ban *</label>
          <input name="price" type="number" value={form.price} onChange={onChange} required />
        </div>
        <div>
          <label>Gia cu</label>
          <input name="oldPrice" type="number" value={form.oldPrice} onChange={onChange} />
        </div>
        <div>
          <label>RAM</label>
          <input name="ram" value={form.ram} onChange={onChange} />
        </div>
        <div>
          <label>Bo nho</label>
          <input name="storage" value={form.storage} onChange={onChange} />
        </div>
        <div>
          <label>Ton kho</label>
          <input name="stock" type="number" value={form.stock} onChange={onChange} />
        </div>
        <div>
          <label>Da ban</label>
          <input name="sold" type="number" value={form.sold} onChange={onChange} />
        </div>
        <div>
          <label>Trang thai</label>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="active">Dang ban</option>
            <option value="hidden">An</option>
            <option value="out_of_stock">Het hang</option>
          </select>
        </div>
        <div>
          <label>Danh gia</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={onChange} />
        </div>
        <div className="full">
          <label>Anh chinh (URL)</label>
          <input name="image" value={form.image} onChange={onChange} />
        </div>
        <div className="full">
          <label>Anh phu (moi dong 1 URL)</label>
          <textarea name="images" rows={3} value={form.images} onChange={onChange} />
        </div>
        <div className="full">
          <label>Mo ta</label>
          <textarea name="description" rows={4} value={form.description} onChange={onChange} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} /> Noi bat
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="flashSale" checked={form.flashSale} onChange={onChange} /> Flash sale
          </label>
        </div>
        <div className="full" style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary">
            Luu
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
            Huy
          </button>
        </div>
      </form>
    </div>
  );
}
