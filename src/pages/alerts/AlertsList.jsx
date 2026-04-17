import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Loader2, Bell } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { getAlerts, resolveAlert } from "../../services/alertService";
import { getCurrentUser } from "../../utils/auth";

const SeverityBadge = ({ s }) => {
  const cls = {
    critical: "bg-red-900/40 text-red-400 border-red-800/50",
    warning: "bg-amber-900/40 text-amber-400 border-amber-800/50",
    info: "bg-blue-900/40 text-blue-400 border-blue-800/50",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${cls[s] || cls.info}`}
    >
      {s}
    </span>
  );
};

const statusColor = (s) =>
  s === "active"
    ? "bg-green-900/40 text-green-400 border-green-800/50"
    : "bg-gray-800 text-gray-400 border-gray-700";

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const AlertsList = () => {
  const { showToast } = useToast();
  const currentUser = getCurrentUser();
  const canAck = currentUser?.role === "admin" || currentUser?.role === "agent";

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ackingId, setAckingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAlerts({ page, limit: 20 });
      setAlerts(res.data.alerts || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      showToast("Failed to load alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [page]);

  const handleAck = async (alert, e) => {
    e.stopPropagation();
    if (ackingId) return;
    const prev = alerts.find((a) => a.alert_id === alert.alert_id)?.status;
    // Optimistic update
    setAlerts((p) =>
      p.map((a) =>
        a.alert_id === alert.alert_id
          ? { ...a, status: a.status === "active" ? "resolved" : "active" }
          : a,
      ),
    );
    setAckingId(alert.alert_id);
    try {
      await resolveAlert(alert.alert_id);
      showToast(
        prev === "active" ? "Alert acknowledged" : "Alert reopened",
        "success",
      );
    } catch (err) {
      // Revert
      setAlerts((p) =>
        p.map((a) =>
          a.alert_id === alert.alert_id ? { ...a, status: prev } : a,
        ),
      );
      showToast(err.response?.data?.message || "Action failed", "error");
    } finally {
      setAckingId(null);
    }
  };

  const severityBorder = {
    critical: "border-l-red-500",
    warning: "border-l-amber-500",
    info: "border-l-blue-500",
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FF6B00]" /> System Alerts
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {canAck
            ? "Monitor and acknowledge network-wide anomalies"
            : "Track issues affecting your local water supply"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          [
            "Active",
            alerts.filter((a) => a.status === "active").length,
            "text-red-400",
          ],
          [
            "Resolved",
            alerts.filter((a) => a.status === "resolved").length,
            "text-green-400",
          ],
          [
            "Critical",
            alerts.filter((a) => a.severity === "critical").length,
            "text-amber-400",
          ],
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

      {/* Alerts Table */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    {[
                      "Subject",
                      "Description",
                      "Time",
                      "Source",
                      "Severity",
                      "Status",
                      ...(canAck ? ["Action"] : []),
                    ].map((h) => (
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
                  {alerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={canAck ? 7 : 6}
                        className="px-4 py-12 text-center text-gray-600"
                      >
                        No alerts found
                      </td>
                    </tr>
                  ) : (
                    alerts.map((alert) => (
                      <>
                        <tr
                          key={alert.alert_id}
                          onClick={() =>
                            setSelectedId((p) =>
                              p === alert.alert_id ? null : alert.alert_id,
                            )
                          }
                          className={`border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors cursor-pointer border-l-[3px] ${
                            severityBorder[alert.severity] ||
                            "border-l-transparent"
                          }`}
                        >
                          <td className="px-4 py-3 text-white text-xs font-medium max-w-[180px] truncate">
                            {alert.subject}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs max-w-[220px] truncate">
                            {alert.description?.slice(0, 60)}
                            {alert.description?.length > 60 ? "..." : ""}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                            {timeAgo(alert.created_at)}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {alert.source?.source_name ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            <SeverityBadge s={alert.severity} />
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusColor(
                                alert.status,
                              )}`}
                            >
                              {alert.status}
                            </span>
                          </td>
                          {canAck && (
                            <td
                              className="px-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => handleAck(alert, e)}
                                disabled={ackingId === alert.alert_id}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                                  alert.status === "active"
                                    ? "bg-[#FF6B00]/20 text-[#FF6B00] hover:bg-[#FF6B00]/30 border border-[#FF6B00]/30"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                                } disabled:opacity-40`}
                              >
                                {ackingId === alert.alert_id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : alert.status === "active" ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3" />
                                )}
                                {alert.status === "active" ? "Ack" : "Reopen"}
                              </button>
                            </td>
                          )}
                        </tr>

                        {/* Expanded detail row */}
                        {selectedId === alert.alert_id && (
                          <tr
                            key={`detail-${alert.alert_id}`}
                            className="border-b border-[#1E1E1E] bg-[#141414]"
                          >
                            <td colSpan={canAck ? 7 : 6} className="px-6 py-5">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Subject
                                    </p>
                                    <p className="text-white text-sm">
                                      {alert.subject}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Description
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {alert.description}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Generated By
                                    </p>
                                    <span className="inline-flex px-2 py-0.5 rounded text-xs border border-[#1E1E1E] text-gray-300">
                                      {alert.generated_by}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Severity
                                    </p>
                                    <SeverityBadge s={alert.severity} />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Time
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                      {alert.created_at
                                        ? new Date(
                                            alert.created_at,
                                          ).toLocaleString()
                                        : "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase mb-0.5">
                                      Source
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                      {alert.source?.source_name ?? "—"}
                                    </p>
                                  </div>
                                  {alert.resolved_at && (
                                    <div>
                                      <p className="text-xs text-gray-500 uppercase mb-0.5">
                                        Resolved At
                                      </p>
                                      <p className="text-green-400 text-sm">
                                        {new Date(
                                          alert.resolved_at,
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  )}
                                  {canAck && (
                                    <button
                                      onClick={(e) => handleAck(alert, e)}
                                      disabled={ackingId === alert.alert_id}
                                      className={`mt-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                                        alert.status === "active"
                                          ? "bg-[#FF6B00] text-white hover:bg-[#e05f00]"
                                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                      } disabled:opacity-50`}
                                    >
                                      {ackingId === alert.alert_id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : null}
                                      {alert.status === "active"
                                        ? "Acknowledge Alert"
                                        : "Reopen Alert"}
                                    </button>
                                  )}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#1E1E1E]">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-xs text-gray-400 disabled:opacity-30"
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-500">
                  Page {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs text-gray-400 disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlertsList;
