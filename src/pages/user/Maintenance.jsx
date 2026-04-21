import { useState, useEffect } from "react";
import { Loader2, Send, Wrench } from "lucide-react";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const inputCls =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FF6B00] placeholder-gray-600";
const labelCls =
  "block text-xs text-gray-400 mb-1 font-mono uppercase tracking-wide";

const URGENCY = ["Low", "Medium", "High", "Critical"];

export default function Maintenance() {
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [robine, setRobine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    issue_name: "",
    description: "",
    urgency: "Medium",
  });

  const fetchIssues = async () => {
    try {
      const [issuesRes, robinesRes] = await Promise.all([
        api.get("/issues", { params: { limit: 20 } }),
        api.get("/robines"),
      ]);
      setIssues(issuesRes.data?.issues || []);
      const robines = Array.isArray(robinesRes.data) ? robinesRes.data : [];
      setRobine(robines[0] || null);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.issue_name.trim())
      return showToast("Please enter an issue title", "error");
    setSubmitting(true);
    try {
      const body = {
        issue_name: `[${form.urgency}] ${form.issue_name}`,
        province: robine?.province || "",
        district: robine?.district || "",
        cell: robine?.cell || "",
        robine_id: robine?.robine_id || null,
        source_id: robine?.source_id || null,
      };
      const res = await api.post("/issues", body);
      showToast(
        res.data?.message || "Maintenance request submitted successfully",
        "success",
      );
      setForm({ issue_name: "", description: "", urgency: "Medium" });
      fetchIssues();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Submission failed",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "resolved") return "resolved";
    if (status === "in_progress") return "warning";
    return "critical";
  };

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#FF6B00]" /> Maintenance Requests
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Report issues with your water connection.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Submit form */}
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5 space-y-4">
          <h2 className="text-sm font-medium text-white">New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={labelCls}>Issue Title *</label>
              <input
                className={inputCls}
                placeholder="e.g. Pipe leak near kitchen"
                value={form.issue_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, issue_name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelCls}>Urgency</label>
              <select
                className={inputCls}
                value={form.urgency}
                onChange={(e) =>
                  setForm((p) => ({ ...p, urgency: e.target.value }))
                }
              >
                {URGENCY.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                className={inputCls}
                rows={4}
                placeholder="Describe the problem in detail..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            {robine && (
              <div className="rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2 text-xs text-gray-500">
                📍 {robine.province}, {robine.district}, {robine.cell} · Robine
                #{robine.robine_id}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Request
            </button>
          </form>
        </section>

        {/* Existing requests */}
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5 space-y-3">
          <h2 className="text-sm font-medium text-white">My Requests</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
            </div>
          ) : issues.length === 0 ? (
            <p className="text-xs text-gray-600 py-4">
              No maintenance requests yet.
            </p>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.issue_id}
                className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      {issue.issue_name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(issue.created_at).toLocaleDateString()} ·{" "}
                      {issue.province}
                    </p>
                  </div>
                  <Badge
                    type={statusBadge(issue.status)}
                    label={issue.status.replace("_", " ")}
                  />
                </div>
                {issue.resolved_at && (
                  <p className="mt-2 text-xs text-emerald-400">
                    ✓ Resolved{" "}
                    {new Date(issue.resolved_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
