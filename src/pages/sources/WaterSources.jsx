import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Droplets, Loader2 } from "lucide-react";
import CrudModal from "../../components/shared/CrudModal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useToast } from "../../contexts/ToastContext";
import {
  getSources,
  createSource,
  updateSource,
  toggleSourceStatus,
  deleteSource,
} from "../../services/sourceService";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const StatCard = ({ label, value, color = "orange" }) => {
  const colors = {
    orange: "text-[#FF6B00]",
    green: "text-green-400",
    red: "text-red-400",
    gray: "text-gray-400",
  };
  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5">
      <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold font-mono ${colors[color]}`}>{value}</p>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-[#FF6B00]" : "bg-gray-700"}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
);

const EMPTY_FORM = { source_name: "", province: "", district: "", cell: "" };

const WaterSources = () => {
  const { showToast } = useToast();
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await getSources();
      setSources(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load sources", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const total = sources.length;
  const active = sources.filter((s) => s.status === "active").length;
  const inactive = sources.filter((s) => s.status === "inactive").length;
  const flagged = sources.filter((s) => (s._count?.robines ?? 0) === 0).length;

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (src) => {
    setEditingItem(src);
    setForm({
      source_name: src.source_name,
      province: src.province,
      district: src.district,
      cell: src.cell,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.source_name || !form.province || !form.district || !form.cell) {
      setSubmitError("All fields are required");
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      if (editingItem) {
        await updateSource(editingItem.source_id, form);
        showToast("Source updated successfully", "success");
      } else {
        await createSource(form);
        showToast("Source created successfully", "success");
      }
      setModalOpen(false);
      fetchSources();
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteSource(deletingId);
      showToast("Source deleted", "success");
      setConfirmOpen(false);
      setSources((prev) => prev.filter((s) => s.source_id !== deletingId));
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (src) => {
    setTogglingId(src.source_id);
    try {
      const res = await toggleSourceStatus(src.source_id);
      setSources((prev) =>
        prev.map((s) =>
          s.source_id === src.source_id ? { ...s, status: res.data.status } : s,
        ),
      );
      showToast(`Source ${res.data.status}`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Toggle failed", "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Water Sources</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage and monitor all water source infrastructure
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Sources" value={total} color="orange" />
        <StatCard label="Active" value={active} color="green" />
        <StatCard label="Inactive" value={inactive} color="red" />
        <StatCard label="Unassigned" value={flagged} color="gray" />
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
                  {[
                    "Source",
                    "Province",
                    "District",
                    "Cell",
                    "Status",
                    "Robines",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide font-mono"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sources.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-600 font-mono text-sm"
                    >
                      No sources found
                    </td>
                  </tr>
                ) : (
                  sources.map((src) => (
                    <tr
                      key={src.source_id}
                      className="border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#1E1E1E] flex items-center justify-center flex-shrink-0">
                            <Droplets className="w-3.5 h-3.5 text-[#FF6B00]" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-semibold">
                              {src.source_name}
                            </p>
                            <p className="text-gray-600 text-xs">
                              ID: {src.source_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {src.province}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {src.district}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {src.cell}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            src.status === "active"
                              ? "bg-green-900/40 text-green-400 border border-green-800/50"
                              : "bg-gray-800 text-gray-400 border border-gray-700"
                          }`}
                        >
                          {src.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {src._count?.robines ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={src.status === "active"}
                            onChange={() =>
                              togglingId !== src.source_id && handleToggle(src)
                            }
                          />
                          <button
                            onClick={() => openEdit(src)}
                            className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(src.source_id);
                              setConfirmOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal */}
      <CrudModal
        isOpen={modalOpen}
        onClose={() => !submitLoading && setModalOpen(false)}
        title={editingItem ? "Edit Source" : "Add New Source"}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        <div>
          <label className={labelCls}>Source Name *</label>
          <input
            className={inputCls}
            value={form.source_name}
            onChange={(e) =>
              setForm((p) => ({ ...p, source_name: e.target.value }))
            }
            placeholder="e.g. Main Reservoir Alpha"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Province *</label>
            <select
              className={inputCls}
              value={form.province}
              onChange={(e) =>
                setForm((p) => ({ ...p, province: e.target.value }))
              }
            >
              <option value="">Select...</option>
              {["Kigali", "Northern", "Southern", "Eastern", "Western"].map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className={labelCls}>District *</label>
            <input
              className={inputCls}
              value={form.district}
              onChange={(e) =>
                setForm((p) => ({ ...p, district: e.target.value }))
              }
              placeholder="District"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Cell *</label>
          <input
            className={inputCls}
            value={form.cell}
            onChange={(e) => setForm((p) => ({ ...p, cell: e.target.value }))}
            placeholder="Cell"
          />
        </div>
      </CrudModal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => !deleteLoading && setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this source? This action cannot be undone and will affect associated robines."
        loading={deleteLoading}
      />
    </div>
  );
};

export default WaterSources;
