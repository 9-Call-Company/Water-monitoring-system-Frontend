import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, Loader2, Eye, EyeOff } from 'lucide-react';
import CrudModal from '../../components/shared/CrudModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useToast } from '../../contexts/ToastContext';
import { getUsers, createUser, updateUser, toggleUserStatus, deleteUser } from '../../services/userService';

const inputCls = "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls = "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const StatCard = ({ label, value, color = 'orange' }) => {
  const colors = { orange: 'text-[#FF6B00]', green: 'text-green-400', red: 'text-red-400', blue: 'text-blue-400', gray: 'text-gray-400' };
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${colors[color]}`}>{value}</p>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-[#FF6B00]' : 'bg-gray-700'}`}>
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
);

const EMPTY_FORM = {
  full_name: '',
  username: '',
  email: '',
  telephone: '',
  role: 'user',
  province: '',
  district: '',
  cell: '',
  agent_id: '',
  password: '',
  confirm_password: '',
};

const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'];
const ROLES = ['admin', 'agent', 'user'];

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ limit: 100 });
      const all = res.data.users || [];
      setUsers(all);
      setAgents(all.filter(u => u.role === 'agent'));
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const total = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const agentsCount = users.filter(u => u.role === 'agent').length;
  const inactive = users.filter(u => u.status === 'inactive').length;

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setShowPwd(false);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingItem(u);
    setForm({
      full_name: u.full_name,
      username: u.username,
      email: u.email,
      telephone: u.telephone,
      role: u.role,
      province: u.province,
      district: u.district,
      cell: u.cell,
      agent_id: u.agent_id || '',
      password: '',
      confirm_password: '',
    });
    setSubmitError(null);
    setShowPwd(false);
    setModalOpen(true);
  };

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.full_name || !form.username || !form.email || !form.telephone || !form.province || !form.district || !form.cell) {
      setSubmitError('Please fill all required fields');
      return;
    }
    if (!editingItem && !form.password) {
      setSubmitError('Password is required');
      return;
    }
    if (form.password && form.password.length < 8) {
      setSubmitError('Password must be at least 8 characters');
      return;
    }
    if (form.password && form.password !== form.confirm_password) {
      setSubmitError('Passwords do not match');
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const body = {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        telephone: form.telephone,
        role: form.role,
        province: form.province,
        district: form.district,
        cell: form.cell,
        agent_id: form.agent_id || null,
      };
      if (form.password) body.password = form.password;

      if (editingItem) {
        await updateUser(editingItem.user_id, body);
        showToast('User updated successfully', 'success');
      } else {
        await createUser(body);
        showToast('User created successfully', 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Operation failed';
      setSubmitError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteUser(deletingId);
      showToast('User deleted', 'success');
      setConfirmOpen(false);
      setUsers(prev => prev.filter(u => u.user_id !== deletingId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (u) => {
    setTogglingId(u.user_id);
    try {
      const res = await toggleUserStatus(u.user_id);
      setUsers(prev => prev.map(x => x.user_id === u.user_id ? { ...x, status: res.data.status } : x));
      showToast(`User ${res.data.status}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Toggle failed', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const roleBadge = (role) => {
    const cls = {
      admin: 'bg-purple-900/40 text-purple-400 border-purple-800/50',
      agent: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
      user: 'bg-gray-800 text-gray-400 border-gray-700',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${cls[role] || cls.user}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">User Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all system users</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={total} color="orange" />
        <StatCard label="Admins" value={admins} color="blue" />
        <StatCard label="Agents" value={agentsCount} color="green" />
        <StatCard label="Inactive" value={inactive} color="red" />
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  {['User', 'Email', 'Phone', 'Role', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-600">No users found</td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u.user_id} className="border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1E1E1E] flex items-center justify-center text-xs text-[#FF6B00] font-bold">
                          {u.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">{u.full_name}</p>
                          <p className="text-gray-600 text-xs">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{u.telephone}</td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{u.province}, {u.district}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        u.status === 'active'
                          ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={u.status === 'active'}
                          onChange={() => togglingId !== u.user_id && handleToggle(u)}
                        />
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setDeletingId(u.user_id); setConfirmOpen(true); }}
                          className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add/Edit Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => !submitLoading && setModalOpen(false)}
        title={editingItem ? 'Edit User' : 'Add New User'}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              className={inputCls}
              value={form.full_name}
              onChange={e => setField('full_name', e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className={labelCls}>Username *</label>
            <input
              className={inputCls}
              value={form.username}
              onChange={e => setField('username', e.target.value)}
              placeholder="username"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              className={inputCls}
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className={labelCls}>Telephone *</label>
            <input
              className={inputCls}
              value={form.telephone}
              onChange={e => setField('telephone', e.target.value)}
              placeholder="+250..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Role *</label>
            <select
              className={inputCls}
              value={form.role}
              onChange={e => setField('role', e.target.value)}
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Agent</label>
            <select
              className={inputCls}
              value={form.agent_id}
              onChange={e => setField('agent_id', e.target.value)}
            >
              <option value="">None</option>
              {agents.map(a => (
                <option key={a.user_id} value={a.user_id}>{a.full_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Province *</label>
            <select
              className={inputCls}
              value={form.province}
              onChange={e => setField('province', e.target.value)}
            >
              <option value="">Select...</option>
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>District *</label>
            <input
              className={inputCls}
              value={form.district}
              onChange={e => setField('district', e.target.value)}
              placeholder="District"
            />
          </div>
          <div>
            <label className={labelCls}>Cell *</label>
            <input
              className={inputCls}
              value={form.cell}
              onChange={e => setField('cell', e.target.value)}
              placeholder="Cell"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{editingItem ? 'New Password' : 'Password *'}</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                className={inputCls + ' pr-9'}
                value={form.password}
                onChange={e => setField('password', e.target.value)}
                placeholder={editingItem ? 'Leave blank to keep' : 'Min 8 chars'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>{editingItem ? 'Confirm New Password' : 'Confirm Password *'}</label>
            <input
              type={showPwd ? 'text' : 'password'}
              className={inputCls}
              value={form.confirm_password}
              onChange={e => setField('confirm_password', e.target.value)}
              placeholder="Repeat password"
            />
          </div>
        </div>
      </CrudModal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => !deleteLoading && setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to permanently delete this user? All associated data will be removed."
        loading={deleteLoading}
      />
    </div>
  );
};

export default UserManagement;
