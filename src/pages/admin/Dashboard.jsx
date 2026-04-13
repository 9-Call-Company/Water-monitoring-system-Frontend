import { Droplets, Layers, Users } from "lucide-react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const usageData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "m3 consumed",
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
      borderRadius: 10,
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
  const recentItems = [
    {
      title: "Pump inspection",
      place: "Kigali / Kicukiro",
      date: "Apr 17",
      tone: "orange",
    },
    {
      title: "Valve service",
      place: "Gasabo / Gasanze",
      date: "Apr 19",
      tone: "amber",
    },
    {
      title: "Source check",
      place: "Huye / Tumba",
      date: "Apr 23",
      tone: "gray",
    },
  ];

  const alerts = [
    {
      title: "Leak detected",
      description: "South branch pressure drop",
      time: "5m ago",
      type: "critical",
    },
    {
      title: "Water quality warning",
      description: "Turbidity slightly above threshold",
      time: "26m ago",
      type: "warning",
    },
    {
      title: "Info update",
      description: "Routine data sync completed",
      time: "2h ago",
      type: "info",
    },
  ];

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Users"
          value="1,248"
          sub="Registered across all locations"
          accent
          icon={Users}
        />
        <StatCard
          label="Total Robines"
          value="864"
          sub="Connected home and field units"
          icon={Droplets}
        />
        <StatCard
          label="Total Sources"
          value="142"
          sub="Active monitoring sources"
          icon={Layers}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-white">
                7-day water usage
              </h2>
              <p className="text-xs text-zinc-500">m3 consumed per day</p>
            </div>
          </div>
          <div className="h-[320px]">
            <Bar data={usageData} options={chartOptions} />
          </div>
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">
            Upcoming maintenance
          </h2>
          <div className="mt-4 space-y-3">
            {recentItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-wcam-border bg-[#141414] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.place}</p>
                  </div>
                  <Badge
                    type={
                      item.tone === "orange"
                        ? "warning"
                        : item.tone === "amber"
                          ? "info"
                          : "inactive"
                    }
                    label={item.date}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">Water safety</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Safe</span>
                <span>84%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1c1c1c]">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: "84%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Unsafe</span>
                <span>16%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1c1c1c]">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: "16%" }}
                />
              </div>
            </div>
            <p>Last check: 12 Apr 2026, 09:40 by Agent Grace</p>
          </div>
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">
            Recent issues and alerts
          </h2>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className="rounded-xl border border-wcam-border bg-[#141414] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white">{alert.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {alert.description}
                    </p>
                  </div>
                  <Badge type={alert.type} label={alert.time} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
