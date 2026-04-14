import { useState, useEffect } from 'react';
import { Plus, Pencil, Loader2 } from 'lucide-react';
import CrudModal from '../../components/shared/CrudModal';
import { useToast } from '../../contexts/ToastContext';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../../services/userService';
import { getSources } from '../../services/sourceService';
import { createRobine } from '../../services/robineService';
import { getCurrentUser } from '../../utils/auth';

const inputCls = "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls = "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";
const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'];

const StatCard = ({ label, value, color = 'orange' }) => {
  const c = { orange: 'text-[#FF6B00]', green: 'text-green-400', red: 'text-red-400', gray: 'text-gray-400' };
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${c[color]}`}>{value}</p>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-[#FF6B00]' : 'bg-gray-700'}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
    />
  </button>
);

const EMPTY_FORM = {
  full_name: '',
  username: '',
  email: '',
  telephone: '',
  province: '',
  district: '',
  cell: '',
  source_id: '',
  password: '',
};

const MyUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        getUsers({ limit: 100 }),
        getSources(),
      ]);
      setUsers(uRes.data.users || []);
      setSources(Array.isArray(sRes.data) ? sRes.data : []);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingItem(u);
    setForm({
      full_name: u.full_name || '',
      username: u.username || '',
      email: u.email || '',
      telephone: u.telephone || '',
      province: u.province || '',
      district: u.district || '',
      cell: u.cell || '',
      source_id: '',
      password: '',
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (editingItem) {
      if (!form.full_name || !form.telephone || !form.province || !form.district || !form.cell) {
        setSubmitError('Please fill all required fields');
        return;
      }
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        await updateUser(editingItem.user_id, {
          full_name: form.full_name,
          telephone: form.telephone,
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        showToast('User updated', 'success');
        setModalOpen(false);
        fetchAll();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Update failed';
        setSubmitError(msg);
        showToast(msg, 'error');
      } finally {
        setSubmitLoading(false);
      }
    } else {
      if (
        !form.full_name ||
        !form.username ||
        !form.email ||
        !form.telephone ||
        !form.province ||
        !form.district ||
        !form.cell ||
        !form.source_id ||
        !form.password
      ) {
        setSubmitError('All fields are required');
        return;
      }
      if (form.password.length < 8) {
        setSubmitError('Password must be at least 8 characters');
        return;
      }
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        const agent = getCurrentUser();
        const newUserRes = await createUser({
          full_name: form.full_name,
          username: form.username,
          email: form.email,
          telephone: form.telephone,
          password: form.password,
          province: form.province,
          district: form.district,
          cell: form.cell,
          role: 'user',
          agent_id: agent.userId,
        });
        const userId = newUserRes.data.user_id;
        await createRobine({
          user_id: userId,
          source_id: parseInt(form.source_id),
          agent_id: agent.userId,
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        showToast('User registered and robine assigned', 'success');
        setModalOpen(false);
        fetchAll();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed';
        setSubmitError(msg);
        showToast(msg, 'error');
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleToggle = async (u) => {
    setTogglingId(u.user_id);
    try {
      const res = await toggleUserStatus(u.user_id);
      setUsers((prev) =>
        prev.map((x) =>
          x.user_id === u.user_id ? { ...x, status: res.data.status } : x
        )
      );
      showToast(`User ${res.data.status}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Toggle failed', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const total = users.length;
  const active = users.filter((u) => u.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">My Users</h1>
          <p className="text-xs text-gray-500 mt-1">Manage users assigned to you</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register User
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Total Users" value={total} color="orange" />
        <StatCard label="Active" value={active} color="green" />
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
                  {['User', 'Contact', 'Location', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-600">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.user_id}
                      className="border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                    >
                      {/* User */}
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

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <p className="text-gray-300 text-xs">{u.email}</p>
                        <p className="text-gray-500 text-xs">{u.telephone}</p>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {u.province}, {u.district}, {u.cell}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                            u.status === 'active'
                              ? 'bg-green-900/40 text-green-400 border-green-800/50'
                              : 'bg-gray-800 text-gray-400 border-gray-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={u.status === 'active'}
                            onChange={() =>
                              togglingId !== u.user_id && handleToggle(u)
                            }
                          />
                          <button
                            onClick={() => openEdit(u)}
                            className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => !submitLoading && setModalOpen(false)}
        title={editingItem ? 'Edit User' : 'Register New User'}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        {/* Add mode fields */}
        {!editingItem && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  className={inputCls}
                  value={form.full_name}
                  onChange={(e) => setF('full_name', e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelCls}>Username *</label>
                <input
                  className={inputCls}
                  value={form.username}
                  onChange={(e) => setF('username', e.target.value)}
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
                  onChange={(e) => setF('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className={labelCls}>Telephone *</label>
                <input
                  className={inputCls}
                  value={form.telephone}
                  onChange={(e) => setF('telephone', e.target.value)}
                  placeholder="+250..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Province *</label>
                <select
                  className={inputCls}
                  value={form.province}
                  onChange={(e) => setF('province', e.target.value)}
                >
                  <option value="">Select...</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>District *</label>
                <input
                  className={inputCls}
                  value={form.district}
                  onChange={(e) => setF('district', e.target.value)}
                  placeholder="District"
                />
              </div>
              <div>
                <label className={labelCls}>Cell *</label>
                <input
                  className={inputCls}
                  value={form.cell}
                  onChange={(e) => setF('cell', e.target.value)}
                  placeholder="Cell"
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Water Source *</label>
              <select
                className={inputCls}
                value={form.source_id}
                onChange={(e) => setF('source_id', e.target.value)}
              >
                <option value="">Select source...</option>
                {sources.map((s) => (
                  <option key={s.source_id} value={s.source_id}>
                    {s.source_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Password *</label>
              <input
                type="password"
                className={inputCls}
                value={form.password}
                onChange={(e) => setF('password', e.target.value)}
                placeholder="Min 8 characters"
              />
            </div>
          </>
        )}

        {/* Edit mode fields */}
        {editingItem && (
          <>
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                className={inputCls}
                value={form.full_name}
                onChange={(e) => setF('full_name', e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div>
              <label className={labelCls}>Telephone *</label>
              <input
                className={inputCls}
                value={form.telephone}
                onChange={(e) => setF('telephone', e.target.value)}
                placeholder="+250..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Province *</label>
                <select
                  className={inputCls}
                  value={form.province}
                  onChange={(e) => setF('province', e.target.value)}
                >
                  <option value="">Select...</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>District *</label>
                <input
                  className={inputCls}
                  value={form.district}
                  onChange={(e) => setF('district', e.target.value)}
                  placeholder="District"
                />
              </div>
              <div>
                <label className={labelCls}>Cell *</label>
                <input
                  className={inputCls}
                  value={form.cell}
                  onChange={(e) => setF('cell', e.target.value)}
                  placeholder="Cell"
                />
              </div>
            </div>
          </>
        )}
      </CrudModal>
    </div>
  );
};

export default MyUsers;
