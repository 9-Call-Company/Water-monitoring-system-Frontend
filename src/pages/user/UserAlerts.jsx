import { useState, useEffect } from "react";
import { Bell, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { useSocket } from "../../contexts/SocketContext";
import { getAlerts } from "../../services/alertService";
import { getCurrentUser } from "../../utils/auth";

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

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

const borderBySeverity = {
  critical: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

const UserAlerts = () => {
  const { showToast } = useToast();
  const socket = useSocket();
  const currentUser = getCurrentUser();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAlerts({ limit: 50 });
      setAlerts(res.data.alerts || []);
    } catch {
      showToast("Failed to load alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (alert) => {
      if (alert.user_id === currentUser?.userId) {
        setAlerts((prev) => [alert, ...prev]);
        showToast(`New alert: ${alert.subject}`, "info");
      }
    };
    socket.on("alert:new", handler);
    return () => {
      socket.off("alert:new", handler);
    };
  }, [socket, currentUser?.userId]);

  const total = alerts.length;
  const active = alerts.filter((a) => a.status === "active").length;
  const resolved = alerts.filter((a) => a.status === "resolved").length;
  const supportAlert = alerts.find(
    (a) => a.subject === "Maintenance Request Received",
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FF6B00]" />
          My Alerts
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Track issues affecting your water supply
        </p>
      </div>

      {supportAlert && (
        <div className="mb-6 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00]/10 p-4">
          <p className="text-sm font-semibold text-[#FF6B00]">
            Maintenance Request Confirmation
          </p>
          <p className="mt-1 text-xs text-gray-200">
            You raised a request and your request is received. You are going to
            receive our technical team, or call 0791207357 for quick WCAM
            support.
          </p>
          <p className="mt-2 text-[11px] text-gray-500">
            Last update:{" "}
            {supportAlert.created_at
              ? new Date(supportAlert.created_at).toLocaleString()
              : "Now"}
          </p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["Total", total, "text-[#FF6B00]"],
          ["Active", active, "text-red-400"],
          ["Resolved", resolved, "text-green-400"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
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
                  {["Subject", "Description", "Time", "Status", "View"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide font-mono"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-gray-600 font-mono text-sm"
                    >
                      No alerts for your account
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <>
                      <tr
                        key={alert.alert_id}
                        className={`border-b border-[#1E1E1E] hover:bg-[#161616] transition-colors border-l-[3px] ${
                          borderBySeverity[alert.severity] ||
                          "border-l-transparent"
                        }`}
                      >
                        {/* Subject */}
                        <td className="px-4 py-3 text-white text-xs font-medium max-w-[200px] truncate">
                          {alert.subject}
                        </td>

                        {/* Description (truncated) */}
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-[260px] truncate">
                          {alert.description?.slice(0, 60)}
                          {alert.description?.length > 60 ? "..." : ""}
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {timeAgo(alert.created_at)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                              alert.status === "active"
                                ? "bg-red-900/40 text-red-400 border-red-800/50"
                                : "bg-gray-800 text-gray-400 border-gray-700"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </td>

                        {/* View toggle */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              setViewingId((prev) =>
                                prev === alert.alert_id ? null : alert.alert_id,
                              )
                            }
                            className="p-1.5 text-gray-500 hover:text-blue-400 transition-colors"
                          >
                            {viewingId === alert.alert_id ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Detail row */}
                      {viewingId === alert.alert_id && (
                        <tr
                          key={`detail-${alert.alert_id}`}
                          className="border-b border-[#1E1E1E] bg-[#141414]"
                        >
                          <td colSpan={5} className="px-6 py-5">
                            <div className="grid grid-cols-2 gap-6">
                              {/* Left column */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Subject
                                  </p>
                                  <p className="text-white text-sm font-mono">
                                    {alert.subject}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Description
                                  </p>
                                  <p className="text-gray-300 text-sm font-mono leading-relaxed">
                                    {alert.description}
                                  </p>
                                </div>
                              </div>

                              {/* Right column */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Severity
                                  </p>
                                  <SeverityBadge s={alert.severity} />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Generated By
                                  </p>
                                  <span className="inline-flex px-2 py-0.5 rounded text-xs border border-[#1E1E1E] text-gray-300 font-mono">
                                    {alert.generated_by ?? "—"}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Time
                                  </p>
                                  <p className="text-gray-300 text-sm font-mono">
                                    {alert.created_at
                                      ? new Date(
                                          alert.created_at,
                                        ).toLocaleString()
                                      : "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-mono uppercase mb-0.5">
                                    Source
                                  </p>
                                  <p className="text-gray-300 text-sm font-mono">
                                    {alert.source?.source_name ?? "—"}
                                  </p>
                                </div>
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
    </div>
  );
};

export default UserAlerts;
