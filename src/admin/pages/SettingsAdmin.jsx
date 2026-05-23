import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/admin.css';

export default function SettingsAdmin() {
  const { settings, saveSettings } = useData();
  const { showToast } = useToast();
  const [form, setForm] = useState(settings);

  const submit = (e) => {
    e.preventDefault();
    saveSettings(form);
    showToast('Luu cai dat thanh cong', 'success');
  };

  return (
    <div>
      <h1 className="admin-page-title">Cai dat website</h1>
      <form className="admin-card admin-form-grid" onSubmit={submit}>
        <div>
          <label>Ten website</label>
          <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div>
          <label>Hotline</label>
          <input value={form.hotline} onChange={(e) => setForm({ ...form, hotline: e.target.value })} />
        </div>
        <div>
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="full">
          <label>Dia chi</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label>Phi van chuyen mac dinh</label>
          <input
            type="number"
            value={form.shippingFee}
            onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })}
          />
        </div>
        <div>
          <label>Mien phi ship tu (VND)</label>
          <input
            type="number"
            value={form.freeShippingMin}
            onChange={(e) => setForm({ ...form, freeShippingMin: Number(e.target.value) })}
          />
        </div>
        <div className="full">
          <button type="submit" className="btn btn-primary">
            Luu cai dat
          </button>
        </div>
      </form>
    </div>
  );
}
