import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../constants/roles';
import '../../styles/admin.css';

export default function UserListAdmin() {
  const { users, orders, updateUser, deleteUser } = useData();
  const { showToast } = useToast();

  const orderCount = (userId) => orders.filter((o) => o.userId === userId).length;

  const isMainAdmin = (u) => u?.email === 'admin@gmail.com';

  const toggleLock = async (id, locked, u) => {
    if (isMainAdmin(u)) {
      showToast('Khong the khoa admin chinh', 'error');
      return;
    }
    await updateUser(id, { locked: !locked });
    showToast(locked ? 'Da mo khoa' : 'Da khoa tai khoan', 'success');
  };

  const changeRole = async (id, role, u) => {
    if (isMainAdmin(u)) {
      showToast('Khong doi role admin chinh', 'error');
      return;
    }
    if (await updateUser(id, { role })) showToast('Cap nhat role thanh cong', 'success');
  };

  const handleDelete = async (id, u) => {
    if (isMainAdmin(u)) {
      showToast('Khong the xoa admin chinh', 'error');
      return;
    }
    if (await deleteUser(id)) showToast('Da xoa user', 'success');
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
                    disabled={isMainAdmin(u)}
                    onChange={(e) => changeRole(u.id, e.target.value, u)}
                  >
                    <option value={ROLES.USER}>User</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                  </select>
                </td>
                <td>{orderCount(u.id)}</td>
                <td>{u.locked ? 'Bi khoa' : 'Hoat dong'}</td>
                <td>
                  <div className="admin-actions">
                    {!isMainAdmin(u) && (
                      <>
                        <button type="button" className="admin-btn-sm" onClick={() => toggleLock(u.id, u.locked, u)}>
                          {u.locked ? 'Mo khoa' : 'Khoa'}
                        </button>
                        <button type="button" className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(u.id, u)}>
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
