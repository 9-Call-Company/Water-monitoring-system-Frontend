import { useState, useEffect } from 'react';
import { Plus, Pencil, Eye, EyeOff, Loader2, Droplets } from 'lucide-react';
import CrudModal from '../../components/shared/CrudModal';
import { useToast } from '../../contexts/ToastContext';
import { getRobines, createRobine, updateRobine, toggleRobineStatus } from '../../services/robineService';
import { getUsers } from '../../services/userService';
import { getSources } from '../../services/sourceService';
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

const EMPTY_FORM = { user_id: '', source_id: '', province: '', district: '', cell: '' };

const AgentRobines = () => {
  const { showToast } = useToast();
  const [robines, setRobines] = useState([]);
  const [users, setUsers] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, uRes, sRes] = await Promise.all([
        getRobines(),
        getUsers({ limit: 100 }),
        getSources(),
      ]);
      setRobines(Array.isArray(rRes.data) ? rRes.data : []);
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

  const openEdit = (r) => {
    setEditingItem(r);
    setForm({
      user_id: '',
      source_id: r.source_id?.toString() || '',
      province: r.province,
      district: r.district,
      cell: r.cell,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (editingItem) {
      if (!form.source_id || !form.province || !form.district || !form.cell) {
        setSubmitError('All fields required');
        return;
      }
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        const res = await updateRobine(editingItem.robine_id, {
          source_id: parseInt(form.source_id),
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        setRobines((prev) =>
          prev.map((r) =>
            r.robine_id === editingItem.robine_id ? { ...r, ...res.data } : r
          )
        );
        showToast('Robine updated', 'success');
        setModalOpen(false);
        fetchAll();
      } catch (err) {
        const msg = err.response?.data?.message || 'Update failed';
        setSubmitError(msg);
        showToast(msg, 'error');
      } finally {
        setSubmitLoading(false);
      }
    } else {
      if (!form.user_id || !form.source_id || !form.province || !form.district || !form.cell) {
        setSubmitError('All fields required');
        return;
      }
      setSubmitLoading(true);
      setSubmitError(null);
      try {
        const agent = getCurrentUser();
        await createRobine({
          user_id: parseInt(form.user_id),
          source_id: parseInt(form.source_id),
          agent_id: agent.userId,
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        showToast('Robine assigned successfully', 'success');
        setModalOpen(false);
        fetchAll();
      } catch (err) {
        const msg = err.response?.data?.message || 'Assignment failed';
        setSubmitError(msg);
        showToast(msg, 'error');
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const handleToggle = async (r) => {
    setTogglingId(r.robine_id);
    try {
      const res = await toggleRobineStatus(r.robine_id);
      setRobines((prev) =>
        prev.map((x) =>
          x.robine_id === r.robine_id ? { ...x, status: res.data.status } : x
        )
      );
      showToast(`Robine ${res.data.status}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Toggle failed', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const total = robines.length;
  const active = robines.filter((r) => r.status === 'active').length;
  const inactive = robines.filter((r) => r.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#FF6B00]" />
            My Robines
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage robines assigned under your supervision
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Assign Robine
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Robines" value={total} color="orange" />
        <StatCard label="Active" value={active} color="green" />
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
                  {['Robine ID', 'Owner', 'Source', 'Location', 'M3 Used', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {robines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-600">
                      No robines found
                    </td>
                  </tr>
                ) : (
                  robines.map((r) => (
                    <>
                      <tr
                        key={r.robine_id}
                        className="border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                      >
                        <td className="px-4 py-3 text-[#FF6B00] text-xs font-bold">
                          #{r.robine_id}
                        </td>
                        <td className="px-4 py-3 text-white text-xs">
                          {r.user?.full_name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs">
                          {r.source?.source_name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {r.province}, {r.district}
                        </td>
                        <td className="px-4 py-3 text-[#FF6B00] text-xs font-bold">
                          {parseFloat(r.m3_consumed ?? 0).toFixed(3)} m³
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                              r.status === 'active'
                                ? 'bg-green-900/40 text-green-400 border-green-800/50'
                                : 'bg-gray-800 text-gray-400 border-gray-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Toggle
                              checked={r.status === 'active'}
                              onChange={() =>
                                togglingId !== r.robine_id && handleToggle(r)
                              }
                            />
                            <button
                              onClick={() => openEdit(r)}
                              className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setViewingId((p) =>
                                  p === r.robine_id ? null : r.robine_id
                                )
                              }
                              className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
                            >
                              {viewingId === r.robine_id ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {viewingId === r.robine_id && (
                        <tr
                          key={`detail-${r.robine_id}`}
                          className="border-b border-[#1E1E1E] bg-[#141414]"
                        >
                          <td colSpan={7} className="px-6 py-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Robine ID
                                </p>
                                <p className="text-[#FF6B00] font-bold text-sm">
                                  #{r.robine_id}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Owner
                                </p>
                                <p className="text-white text-sm">
                                  {r.user?.full_name ?? '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Source
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {r.source?.source_name ?? '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  M3 Consumed
                                </p>
                                <p className="text-[#FF6B00] font-bold text-lg">
                                  {parseFloat(r.m3_consumed ?? 0).toFixed(3)} m³
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Province
                                </p>
                                <p className="text-gray-300 text-sm">{r.province}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  District
                                </p>
                                <p className="text-gray-300 text-sm">{r.district}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Cell
                                </p>
                                <p className="text-gray-300 text-sm">{r.cell}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Assigned At
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {r.assigned_at
                                    ? new Date(r.assigned_at).toLocaleDateString()
                                    : '—'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase mb-0.5">
                                  Status
                                </p>
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                                    r.status === 'active'
                                      ? 'bg-green-900/40 text-green-400 border-green-800/50'
                                      : 'bg-gray-800 text-gray-400 border-gray-700'
                                  }`}
                                >
                                  {r.status}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
        title={editingItem ? 'Edit Robine' : 'Assign Robine'}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        {/* User select — add mode only */}
        {!editingItem && (
          <div>
            <label className={labelCls}>User (Owner) *</label>
            <select
              className={inputCls}
              value={form.user_id}
              onChange={(e) => setF('user_id', e.target.value)}
            >
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Source */}
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

        {/* Location */}
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
                <option key={p} value={p}>
                  {p}
                </option>
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
      </CrudModal>
    </div>
  );
};

export default AgentRobines;
