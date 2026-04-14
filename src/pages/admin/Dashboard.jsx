import { useEffect, useState } from "react";
import {
  Droplets,
  Layers,
  Users,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Activity,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#111111",
      borderColor: "#1E1E1E",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#a3a3a3",
    },
  },
  scales: {
    x: {
      grid: { color: "#1E1E1E" },
      ticks: { color: "#a3a3a3", font: { family: "monospace", size: 11 } },
    },
    y: {
      grid: { color: "#1E1E1E" },
      ticks: { color: "#a3a3a3", font: { family: "monospace", size: 11 } },
    },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/alerts", { params: { limit: 5 } }),
      api.get("/issues", { params: { limit: 5 } }),
    ])
      .then(([statsRes, alertsRes, issuesRes]) => {
        setStats(statsRes.data);
        setAlerts(alertsRes.data?.alerts || []);
        setIssues(issuesRes.data?.issues || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const usageData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "m³ consumed",
        data: [12, 18, 10, 22, 16, 24, 19],
        backgroundColor: [
          "rgba(255,107,0,0.45)",
          "rgba(255,107,0,0.45)",
          "rgba(255,107,0,0.45)",
          "rgba(255,107,0,0.45)",
          "rgba(255,107,0,0.45)",
          "#FF6B00",
          "rgba(255,107,0,0.45)",
        ],
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div>
        <h1 className="text-xl font-bold text-white">System Overview</h1>
        <p className="mt-1 text-xs text-gray-500">
          Real-time status of all infrastructure and users.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Users"
          value={stats?.usersCount ?? "—"}
          accent
          icon={Users}
        />
        <StatCard
          label="Robines"
          value={stats?.robinesCount ?? "—"}
          icon={Droplets}
        />
        <StatCard
          label="Sources"
          value={stats?.sourcesCount ?? "—"}
          icon={Layers}
        />
        <StatCard
          label="Active Alerts"
          value={stats?.activeAlerts ?? "—"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Open Issues"
          value={stats?.openIssues ?? "—"}
          icon={ShieldAlert}
        />
      </div>

      {/* Chart + Issues */}
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-white">
              7-day water usage
            </h2>
            <p className="text-xs text-gray-500">m³ consumed per day</p>
          </div>
          <div className="h-[260px]">
            <Bar data={usageData} options={chartOptions} />
          </div>
        </section>

        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Recent Issues</h2>
          {issues.length === 0 ? (
            <p className="text-xs text-gray-600">No recent issues.</p>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
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
                        {issue.province} ·{" "}
                        {new Date(issue.created_at).toLocaleDateString()}
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

      {/* Alerts + System Health */}
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-white mb-4">Recent Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-xs text-gray-600">No recent alerts.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">
                        {alert.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {alert.user?.full_name ?? "—"}
                      </p>
                    </div>
                    <Badge type={alert.severity} label={alert.severity} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF6B00]" /> System Health
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Total Volume Processed</span>
                <span className="text-[#FF6B00] font-bold">
                  {parseFloat(stats?.totalVolume || 0).toFixed(2)} m³
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#1E1E1E]">
                <div
                  className="h-2 rounded-full bg-[#FF6B00]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Active Robines</span>
                <span className="text-emerald-400">
                  {stats?.robinesCount ?? 0} online
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#1E1E1E]">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: "82%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>System Uptime</span>
                <span className="text-emerald-400">98.9%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1E1E1E]">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: "98.9%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Open Issues</span>
                <span className="text-red-400">
                  {stats?.openIssues ?? 0} pending
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#1E1E1E]">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{
                    width: stats?.openIssues
                      ? `${Math.min((stats.openIssues / 20) * 100, 100)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
