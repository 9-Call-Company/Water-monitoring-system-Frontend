import { Bell, Droplets, Home, ShieldCheck } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Consumption",
      data: [2, 3, 2.5, 4, 3.2, 4.2, 3.7],
      borderColor: "#FF6B00",
      backgroundColor: "rgba(255,107,0,0.2)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: "#1f1f1f" }, ticks: { color: "#a3a3a3" } },
    y: { grid: { color: "#1f1f1f" }, ticks: { color: "#a3a3a3" } },
  },
};

export default function Dashboard() {
  const alerts = [
    { title: "Leak detected", severity: "critical", time: "5m ago" },
    { title: "Water quality stable", severity: "info", time: "1h ago" },
    { title: "Service reminder", severity: "warning", time: "2h ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your home water overview is below.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="M3 Water Used Today"
          value="4.2"
          accent
          icon={Droplets}
        />
        <StatCard label="Robine Status" value="Active" icon={Home} />
        <StatCard label="Unread Alerts" value="2" icon={Bell} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Live flow</h2>
            <Badge type="active" label="Flowing" />
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-wcam-orange/40 bg-[#FF6B0010] text-center animate-pulseSoft">
              <div>
                <div className="text-2xl font-semibold text-wcam-orange">
                  2.8
                </div>
                <div className="text-xs text-zinc-500">L/min</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="h-4 w-4" /> Water safety OK
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Last check: 12 Apr 2026 09:40
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <Line data={chartData} options={chartOptions} />
      </section>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <h2 className="text-sm font-medium text-white">Recent alerts</h2>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{alert.title}</p>
                <p className="text-xs text-zinc-500">{alert.time}</p>
              </div>
              <Badge type={alert.severity} label={alert.severity} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
