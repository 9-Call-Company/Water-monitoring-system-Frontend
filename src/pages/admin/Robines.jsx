import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Droplets,
  Loader2,
} from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import CrudModal from "../../components/shared/CrudModal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const PROVINCES = ["Kigali", "Northern", "Southern", "Eastern", "Western"];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
      checked ? "bg-[#FF6B00]" : "bg-gray-700"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const EMPTY = {
  user_id: "",
  source_id: "",
  agent_id: "",
  province: "",
  district: "",
  cell: "",
};

export default function Robines() {
  const { showToast } = useToast();

  const [robines, setRobines] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [togglingId, setTogglingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, uRes, sRes] = await Promise.all([
        api.get("/robines"),
        api.get("/users", { params: { limit: 200 } }),
        api.get("/sources"),
      ]);
      setRobines(Array.isArray(rRes.data) ? rRes.data : []);
      const allUsers = uRes.data?.users || [];
      setUsers(allUsers.filter((u) => u.role === "user"));
      setAgents(allUsers.filter((u) => u.role === "agent"));
      setSources(Array.isArray(sRes.data) ? sRes.data : []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY);
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditingItem(r);
    setForm({
      user_id: "",
      source_id: String(r.source_id),
      agent_id: r.agent_id ? String(r.agent_id) : "",
      province: r.province,
      district: r.district,
      cell: r.cell,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      if (editingItem) {
        if (!form.source_id || !form.province || !form.district || !form.cell) {
          setSubmitError("All fields required");
          setSubmitLoading(false);
          return;
        }
        await api.put(`/robines/${editingItem.robine_id}`, {
          source_id: parseInt(form.source_id),
          ...(form.agent_id ? { agent_id: parseInt(form.agent_id) } : {}),
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        showToast("Robine updated", "success");
      } else {
        if (
          !form.user_id ||
          !form.source_id ||
          !form.province ||
          !form.district ||
          !form.cell
        ) {
          setSubmitError("All fields required");
          setSubmitLoading(false);
          return;
        }
        await api.post("/robines", {
          user_id: parseInt(form.user_id),
          source_id: parseInt(form.source_id),
          ...(form.agent_id ? { agent_id: parseInt(form.agent_id) } : {}),
          province: form.province,
          district: form.district,
          cell: form.cell,
        });
        showToast("Robine created", "success");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Operation failed";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/robines/${deletingId}`);
      showToast("Robine deleted", "success");
      setConfirmOpen(false);
      setRobines((p) => p.filter((r) => r.robine_id !== deletingId));
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (r) => {
    setTogglingId(r.robine_id);
    try {
      const res = await api.patch(`/robines/${r.robine_id}/status`);
      setRobines((p) =>
        p.map((x) =>
          x.robine_id === r.robine_id ? { ...x, status: res.data.status } : x,
        ),
      );
      showToast(`Robine ${res.data.status}`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Toggle failed", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const total = robines.length;
  const active = robines.filter((r) => r.status === "active").length;
  const inactive = robines.filter((r) => r.status === "inactive").length;

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#FF6B00]" />
            Robines
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage home connections, sensor state, and consumption.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Robine
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Robines" value={total} accent icon={Droplets} />
        <StatCard label="Active" value={active} icon={Droplets} />
        <StatCard label="Inactive" value={inactive} icon={Droplets} />
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#111111]">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#141414] text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  {[
                    "#",
                    "Owner",
                    "Source",
                    "Agent",
                    "M3 Used",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {robines.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-600"
                    >
                      No robines found
                    </td>
                  </tr>
                ) : (
                  robines.map((robine) => (
                    <>
                      <tr
                        key={robine.robine_id}
                        className="border-t border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                      >
                        <td className="px-4 py-3 text-[#FF6B00] font-bold text-xs">
                          #{robine.robine_id}
                        </td>
                        <td className="px-4 py-3 text-white text-xs">
                          {robine.user?.full_name ?? `User #${robine.user_id}`}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs">
                          {robine.source?.source_name ??
                            `Source #${robine.source_id}`}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {robine.agent_id ? `Agent #${robine.agent_id}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#FF6B00] font-bold text-xs">
                          {parseFloat(robine.m3_consumed || 0).toFixed(3)} m³
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            type={
                              robine.status === "active" ? "active" : "inactive"
                            }
                            label={robine.status}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {togglingId === robine.robine_id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#FF6B00]" />
                            ) : (
                              <Toggle
                                checked={robine.status === "active"}
                                onChange={() => handleToggle(robine)}
                              />
                            )}
                            <button
                              onClick={() => openEdit(robine)}
                              className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingId(robine.robine_id);
                                setConfirmOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setViewingId((p) =>
                                  p === robine.robine_id
                                    ? null
                                    : robine.robine_id,
                                )
                              }
                              className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
                              title="Toggle details"
                            >
                              {viewingId === robine.robine_id ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {viewingId === robine.robine_id && (
                        <tr
                          key={`detail-${robine.robine_id}`}
                          className="border-t border-[#1E1E1E] bg-[#141414]"
                        >
                          <td colSpan={7} className="px-6 py-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {[
                                ["Robine ID", `#${robine.robine_id}`],
                                ["Owner", robine.user?.full_name ?? "—"],
                                ["Source", robine.source?.source_name ?? "—"],
                                [
                                  "M3 Consumed",
                                  `${parseFloat(
                                    robine.m3_consumed || 0,
                                  ).toFixed(3)} m³`,
                                ],
                                ["Province", robine.province ?? "—"],
                                ["District", robine.district ?? "—"],
                                ["Cell", robine.cell ?? "—"],
                                [
                                  "Assigned",
                                  robine.assigned_at
                                    ? new Date(
                                        robine.assigned_at,
                                      ).toLocaleDateString()
                                    : "—",
                                ],
                              ].map(([l, v]) => (
                                <div
                                  key={l}
                                  className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-3"
                                >
                                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                                    {l}
                                  </div>
                                  <div
                                    className={`mt-1 text-sm ${
                                      l === "M3 Consumed"
                                        ? "text-[#FF6B00] font-bold"
                                        : "text-white"
                                    }`}
                                  >
                                    {v}
                                  </div>
                                </div>
                              ))}
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
      </section>

      {/* Add / Edit Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => !submitLoading && setModalOpen(false)}
        title={editingItem ? "Edit Robine" : "Add New Robine"}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        {!editingItem && (
          <div>
            <label className={labelCls}>Owner (User) *</label>
            <select
              className={inputCls}
              value={form.user_id}
              onChange={(e) => setF("user_id", e.target.value)}
            >
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.full_name} (@{u.username})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelCls}>Water Source *</label>
          <select
            className={inputCls}
            value={form.source_id}
            onChange={(e) => setF("source_id", e.target.value)}
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
          <label className={labelCls}>Assigned Agent</label>
          <select
            className={inputCls}
            value={form.agent_id}
            onChange={(e) => setF("agent_id", e.target.value)}
          >
            <option value="">Select agent...</option>
            {agents.map((a) => (
              <option key={a.user_id} value={a.user_id}>
                {a.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Province *</label>
            <select
              className={inputCls}
              value={form.province}
              onChange={(e) => setF("province", e.target.value)}
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
              onChange={(e) => setF("district", e.target.value)}
              placeholder="District"
            />
          </div>
          <div>
            <label className={labelCls}>Cell *</label>
            <input
              className={inputCls}
              value={form.cell}
              onChange={(e) => setF("cell", e.target.value)}
              placeholder="Cell"
            />
          </div>
        </div>
      </CrudModal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => !deleteLoading && setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Permanently delete this robine? All associated sensor readings and alerts will remain but this robine will be unlinked."
        loading={deleteLoading}
      />
    </div>
  );
}
