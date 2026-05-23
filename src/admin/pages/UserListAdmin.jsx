import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES, MAIN_ADMIN_ID } from '../../constants/roles';
import '../../styles/admin.css';

export default function UserListAdmin() {
  const { users, orders, updateUser, deleteUser } = useData();
  const { showToast } = useToast();

  const orderCount = (userId) => orders.filter((o) => o.userId === userId).length;

  const toggleLock = (id, locked) => {
    if (id === MAIN_ADMIN_ID) {
      showToast('Khong the khoa admin chinh', 'error');
      return;
    }
    updateUser(id, { locked: !locked });
    showToast(locked ? 'Da mo khoa' : 'Da khoa tai khoan', 'success');
  };

  const changeRole = (id, role) => {
    if (id === MAIN_ADMIN_ID) {
      showToast('Khong doi role admin chinh', 'error');
      return;
    }
    if (updateUser(id, { role })) showToast('Cap nhat role thanh cong', 'success');
  };

  const handleDelete = (id) => {
    if (id === MAIN_ADMIN_ID) {
      showToast('Khong the xoa admin chinh', 'error');
      return;
    }
    if (deleteUser(id)) showToast('Da xoa user', 'success');
    else showToast('Khong the xoa', 'error');
  };

  return (
    <div>
      <h1 className="admin-page-title">Quan ly nguoi dung</h1>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ten</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Role</th>
              <th>Don hang</th>
              <th>Trang thai</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={u.id === MAIN_ADMIN_ID}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                  >
                    <option value={ROLES.USER}>User</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                </td>
                <td>{orderCount(u.id)}</td>
                <td>{u.locked ? 'Bi khoa' : 'Hoat dong'}</td>
                <td>
                  <div className="admin-actions">
                    {u.id !== MAIN_ADMIN_ID && (
                      <>
                        <button type="button" className="admin-btn-sm" onClick={() => toggleLock(u.id, u.locked)}>
                          {u.locked ? 'Mo khoa' : 'Khoa'}
                        </button>
                        <button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(u.id)}>
                          Xoa
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
