import { useEffect, useState } from "react";
import { Plus, Pencil, Loader2, Activity } from "lucide-react";
import Badge from "../../components/shared/Badge";
import CrudModal from "../../components/shared/CrudModal";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

const inputCls =
  "w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const EMPTY = {
  source_id: "",
  ph_level: "",
  turbidity: "",
  is_safe: "true",
  notes: "",
};

export default function WaterQuality() {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchAll = async () => {
    try {
      const [qRes, sRes] = await Promise.all([
        api.get("/quality", { params: { limit: 50 } }),
        api.get("/sources"),
      ]);
      setRecords(
        Array.isArray(qRes.data) ? qRes.data : qRes.data?.records || [],
      );
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
      source_id: String(r.source_id),
      ph_level: String(r.ph_level),
      turbidity: String(r.turbidity),
      is_safe: String(r.is_safe),
      notes: r.notes || "",
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.ph_level || !form.turbidity) {
      setSubmitError("pH and turbidity are required");
      return;
    }
    if (!editingItem && !form.source_id) {
      setSubmitError("Source is required");
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const body = {
        ph_level: parseFloat(form.ph_level),
        turbidity: parseFloat(form.turbidity),
        is_safe: form.is_safe === "true",
        notes: form.notes || null,
      };
      if (editingItem) {
        await api.put(`/quality/${editingItem.quality_id}`, body);
        showToast("Reading updated", "success");
      } else {
        await api.post("/quality", {
          ...body,
          source_id: parseInt(form.source_id),
        });
        showToast("Reading submitted", "success");
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const latest = records[0];

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF6B00]" /> Water Quality
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Submit readings and review quality history.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Submit Reading
        </button>
      </div>

      {latest && (
        <div
          className={`rounded-2xl border p-4 ${latest.is_safe ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10"}`}
        >
          <div
            className={`text-sm font-medium ${latest.is_safe ? "text-emerald-300" : "text-red-300"}`}
          >
            {latest.is_safe
              ? "✓ Latest reading: Safe"
              : "⚠ Latest reading: Unsafe"}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            pH {parseFloat(latest.ph_level).toFixed(2)} · Turbidity{" "}
            {parseFloat(latest.turbidity).toFixed(2)} NTU ·{" "}
            {latest.source?.source_name ?? `Source #${latest.source_id}`}
          </p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#111111]">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#141414] text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  {[
                    "Date",
                    "Source",
                    "pH",
                    "Turbidity",
                    "Status",
                    "Notes",
                    "Edit",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-600"
                    >
                      No quality records yet. Submit the first reading.
                    </td>
                  </tr>
                ) : (
                  records.map((row) => (
                    <tr
                      key={row.quality_id}
                      className="border-t border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {new Date(row.recorded_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {row.source?.source_name ?? `Source #${row.source_id}`}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {parseFloat(row.ph_level).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">
                        {parseFloat(row.turbidity).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          type={row.is_safe ? "active" : "critical"}
                          label={row.is_safe ? "Safe" : "Unsafe"}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">
                        {row.notes || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1.5 text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <CrudModal
        isOpen={modalOpen}
        onClose={() => !submitLoading && setModalOpen(false)}
        title={editingItem ? "Edit Quality Reading" : "Submit New Reading"}
        onSubmit={handleSubmit}
        loading={submitLoading}
        error={submitError}
      >
        {!editingItem && (
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
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>pH Level *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="14"
              className={inputCls}
              value={form.ph_level}
              onChange={(e) => setF("ph_level", e.target.value)}
              placeholder="e.g. 7.2"
            />
          </div>
          <div>
            <label className={labelCls}>Turbidity (NTU) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputCls}
              value={form.turbidity}
              onChange={(e) => setF("turbidity", e.target.value)}
              placeholder="e.g. 0.4"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Safety Status *</label>
          <select
            className={inputCls}
            value={form.is_safe}
            onChange={(e) => setF("is_safe", e.target.value)}
          >
            <option value="true">Safe</option>
            <option value="false">Unsafe</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            className={inputCls}
            rows={3}
            value={form.notes}
            onChange={(e) => setF("notes", e.target.value)}
            placeholder="Any observations..."
          />
        </div>
      </CrudModal>
    </div>
  );
}
