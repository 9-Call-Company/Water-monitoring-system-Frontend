import { useEffect, useState } from "react";
import { Bell, Droplets, ShieldCheck, Users, Loader2 } from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/users", { params: { limit: 5 } }),
      api.get("/issues", { params: { limit: 5 } }),
      api.get("/alerts", { params: { limit: 5 } }),
    ])
      .then(([statsRes, usersRes, issuesRes, alertsRes]) => {
        setStats(statsRes.data);
        setUsers((usersRes.data?.users || []).slice(0, 4));
        setIssues(issuesRes.data?.issues || []);
        setAlerts(alertsRes.data?.alerts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
      </div>
    );

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div>
        <h1 className="text-xl font-bold text-white">Agent Overview</h1>
        <p className="mt-1 text-xs text-gray-500">
          Overview of users and equipment under your supervision.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="My Robines"
          value={stats?.robinesCount ?? "—"}
          accent
          icon={Droplets}
        />
        <StatCard
          label="Active Alerts"
          value={stats?.activeAlerts ?? "—"}
          icon={Bell}
        />
        <StatCard
          label="Open Issues"
          value={stats?.openIssues ?? "—"}
          icon={ShieldCheck}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white mb-4">Recent Users</h2>
          {users.length === 0 ? (
            <p className="text-xs text-gray-600">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.user_id}
                  className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-white">{u.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    type={u.status === "active" ? "active" : "inactive"}
                    label={u.status}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white mb-4">Recent Issues</h2>
          {issues.length === 0 ? (
            <p className="text-xs text-gray-600">No issues found.</p>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.issue_id}
                  className="rounded-xl border border-wcam-border bg-[#141414] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{issue.issue_name}</p>
                      <p className="text-xs text-gray-500">
                        {issue.reporter?.full_name ?? "—"}
                      </p>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <h2 className="text-sm font-medium text-white mb-4">Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-xs text-gray-600">No alerts.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.alert_id}
                className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{alert.subject}</p>
                  <p className="text-xs text-gray-500">
                    {alert.user?.full_name ?? "—"} ·{" "}
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge type={alert.severity} label={alert.severity} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
