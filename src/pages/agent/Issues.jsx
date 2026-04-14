import { useEffect, useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import Badge from "../../components/shared/Badge";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

const STATUS_FLOW = {
  open: "in_progress",
  in_progress: "resolved",
  resolved: "open",
};
const STATUS_LABEL = {
  open: "Start Work",
  in_progress: "Mark Resolved",
  resolved: "Reopen",
};
const STATUS_CLS = {
  open: "bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/30",
  in_progress: "bg-blue-900/30 text-blue-400 border-blue-700/30",
  resolved: "bg-gray-800 text-gray-400 border-gray-700",
};

const urgencyFromName = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("[critical]"))
    return { label: "Critical", cls: "text-red-400" };
  if (n.includes("[high]")) return { label: "High", cls: "text-orange-400" };
  if (n.includes("[medium]")) return { label: "Medium", cls: "text-amber-400" };
  return { label: "Low", cls: "text-gray-500" };
};

export default function Issues() {
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchIssues = async () => {
    try {
      const res = await api.get("/issues", { params: { limit: 50 } });
      setIssues(res.data?.issues || []);
    } catch {
      showToast("Failed to load issues", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusUpdate = async (issue) => {
    const nextStatus = STATUS_FLOW[issue.status];
    setUpdatingId(issue.issue_id);
    setIssues((p) =>
      p.map((x) =>
        x.issue_id === issue.issue_id
          ? {
              ...x,
              status: nextStatus,
              resolved_at:
                nextStatus === "resolved" ? new Date().toISOString() : null,
            }
          : x,
      ),
    );
    try {
      await api.put(`/issues/${issue.issue_id}`, { status: nextStatus });
      showToast(`Issue marked as ${nextStatus.replace("_", " ")}`, "success");
    } catch (err) {
      setIssues((p) =>
        p.map((x) =>
          x.issue_id === issue.issue_id
            ? { ...x, status: issue.status, resolved_at: issue.resolved_at }
            : x,
        ),
      );
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const open = issues.filter((i) => i.status === "open").length;
  const inProg = issues.filter((i) => i.status === "in_progress").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FF6B00]" /> Issues &
          Maintenance
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Monitor and manage field issues and maintenance requests.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          ["Open", open, "text-red-400"],
          ["In Progress", inProg, "text-blue-400"],
          ["Resolved", resolved, "text-emerald-400"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {l}
            </p>
            <p className={`text-2xl font-bold ${c}`}>{v}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#111111]">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#141414] text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  {[
                    "Issue",
                    "Reporter",
                    "Urgency",
                    "Location",
                    "Status",
                    "Reported",
                    "Next Schedule",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-gray-600"
                    >
                      No issues found.
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => {
                    const urgency = urgencyFromName(issue.issue_name);
                    const isExpanded = expandedId === issue.issue_id;
                    return (
                      <>
                        <tr
                          key={issue.issue_id}
                          className="border-t border-[#1E1E1E] hover:bg-[#161616] transition-colors cursor-pointer"
                          onClick={() =>
                            setExpandedId((p) =>
                              p === issue.issue_id ? null : issue.issue_id,
                            )
                          }
                        >
                          <td className="px-4 py-3 text-white text-xs font-medium max-w-[180px] truncate">
                            {issue.issue_name}
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-xs">
                            {issue.reporter?.full_name ?? "—"}
                          </td>
                          <td
                            className={`px-4 py-3 text-xs font-semibold ${urgency.cls}`}
                          >
                            {urgency.label}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {issue.province}, {issue.district}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              type={
                                issue.status === "resolved"
                                  ? "resolved"
                                  : issue.status === "in_progress"
                                    ? "warning"
                                    : "critical"
                              }
                              label={issue.status.replace("_", " ")}
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                            {new Date(issue.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {issue.status === "resolved" &&
                            issue.resolved_at ? (
                              <span className="text-emerald-400">
                                {new Date(
                                  issue.resolved_at,
                                ).toLocaleDateString()}
                              </span>
                            ) : issue.status === "in_progress" ? (
                              <span className="text-amber-400">
                                In progress
                              </span>
                            ) : (
                              <span className="text-gray-600">
                                Not scheduled
                              </span>
                            )}
                          </td>
                          <td
                            className="px-4 py-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleStatusUpdate(issue)}
                              disabled={updatingId === issue.issue_id}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 disabled:opacity-40 ${STATUS_CLS[issue.status]}`}
                            >
                              {updatingId === issue.issue_id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : null}
                              {STATUS_LABEL[issue.status]}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr
                            key={`d-${issue.issue_id}`}
                            className="border-t border-[#1E1E1E] bg-[#141414]"
                          >
                            <td colSpan={8} className="px-6 py-4">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                  ["Issue ID", `#${issue.issue_id}`],
                                  [
                                    "Reporter",
                                    issue.reporter?.full_name ?? "—",
                                  ],
                                  [
                                    "Assigned Agent",
                                    issue.agent?.full_name ?? "Unassigned",
                                  ],
                                  [
                                    "Robine",
                                    issue.robine
                                      ? `#${issue.robine.robine_id}`
                                      : "—",
                                  ],
                                  ["Province", issue.province],
                                  ["District", issue.district],
                                  ["Cell", issue.cell],
                                  [
                                    "Resolved At",
                                    issue.resolved_at
                                      ? new Date(
                                          issue.resolved_at,
                                        ).toLocaleDateString()
                                      : "Pending",
                                  ],
                                ].map(([l, v]) => (
                                  <div
                                    key={l}
                                    className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-3"
                                  >
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500">
                                      {l}
                                    </div>
                                    <div className="mt-1 text-sm text-white">
                                      {v}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
