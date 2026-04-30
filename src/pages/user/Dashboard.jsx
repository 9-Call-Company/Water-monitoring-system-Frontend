import { useEffect, useState } from "react";
import { Bell, Droplets, Home, Loader2, ShieldCheck } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

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
  const [robine, setRobine] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [readings, setReadings] = useState([]);
  const [latestQuality, setLatestQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualFlowStatus, setManualFlowStatus] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/robines"),
      api.get("/alerts", { params: { limit: 5 } }),
      api
        .get("/sensor-data", { params: { limit: 14 } })
        .catch(() => ({ data: [] })),
      api
        .get("/quality", { params: { limit: 1 } })
        .catch(() => ({ data: { logs: [] } })),
    ])
      .then(([statsRes, robinesRes, alertsRes, readingsRes, qualityRes]) => {
        setStats(statsRes.data);
        const robines = Array.isArray(robinesRes.data) ? robinesRes.data : [];
        setRobine(robines[0] || null);
        setAlerts((alertsRes.data?.alerts || []).slice(0, 4));
        const raw = Array.isArray(readingsRes.data)
          ? readingsRes.data
          : readingsRes.data?.readings || [];
        setReadings(raw.slice().reverse().slice(-14));

        const qualityList = Array.isArray(qualityRes.data)
          ? qualityRes.data
          : qualityRes.data?.logs || qualityRes.data?.records || [];
        setLatestQuality(qualityList[0] || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = {
    labels:
      readings.length > 0
        ? readings.map((r) =>
            new Date(r.recorded_at).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            }),
          )
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "M3 Consumed",
        data:
          readings.length > 0
            ? readings.map((r) => parseFloat(r.m3_delta || 0))
            : [2, 3, 2.5, 4, 3.2, 4.2, 3.7],
        borderColor: "#FF6B00",
        backgroundColor: "rgba(255,107,0,0.12)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#FF6B00",
        pointRadius: 3,
      },
    ],
  };

  const severityBorder = {
    critical: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const actualIsWaterFlowing = readings.length > 0 && 
    (readings[readings.length - 1].valve_outlet === "open" || parseFloat(readings[readings.length - 1].flow_out) > 0);

  const isWaterFlowing = manualFlowStatus !== null ? manualFlowStatus : actualIsWaterFlowing;

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
      </div>
    );

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-xs text-gray-500">Your home water overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total M3 Consumed"
          value={parseFloat(
            stats?.myConsumption ?? robine?.m3_consumed ?? 0,
          ).toFixed(2)}
          accent
          icon={Droplets}
        />
        <StatCard
          label="Robine Status"
          value={
            robine
              ? robine.status.charAt(0).toUpperCase() + robine.status.slice(1)
              : "—"
          }
          icon={Home}
        />
        <StatCard
          label="Active Alerts"
          value={stats?.activeAlerts ?? 0}
          icon={Bell}
        />
      </div>

      {/* Robine details + Water safety */}
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Robine Details</h2>
            {robine && (
              <Badge
                type={robine.status === "active" ? "active" : "inactive"}
                label={robine.status}
              />
            )}
          </div>
          {robine ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Robine ID", `#${robine.robine_id}`],
                [
                  "M3 Consumed",
                  `${parseFloat(robine.m3_consumed || 0).toFixed(3)} m³`,
                ],
                ["Province", robine.province],
                ["District", robine.district],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-3"
                >
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    {l}
                  </div>
                  <div className="mt-1 text-sm text-white">{v}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600">No robine assigned yet.</p>
          )}
        </section>

        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <div
            className={`flex items-center gap-2 mb-3 ${latestQuality?.is_safe ? "text-emerald-300" : "text-red-300"}`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">Water Safety</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Based on the latest quality reading for your assigned source.
          </p>
          {latestQuality ? (
            <div className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-4 space-y-1.5">
              <p
                className={`text-sm ${latestQuality.is_safe ? "text-emerald-300" : "text-red-300"}`}
              >
                {latestQuality.is_safe
                  ? "Water is good for drinking"
                  : "Water is not safe for drinking"}
              </p>
              <p className="text-xs text-gray-400">
                pH {parseFloat(latestQuality.ph_level).toFixed(2)} · Turbidity{" "}
                {parseFloat(latestQuality.turbidity).toFixed(2)} NTU
              </p>
              <p className="text-xs text-gray-500">
                {new Date(latestQuality.recorded_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1E1E1E] bg-[#141414] p-4">
              <span className="text-xs text-gray-500">
                No quality readings available yet.
              </span>
            </div>
          )}
        </section>
      </div>

      {/* Consumption Chart & Water Flow Animation */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            Recent Consumption History
          </h2>
          <div className="h-[220px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>

        <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <h2 className="text-sm font-medium text-white mb-4 absolute top-5 left-5">
            Live Water Status
          </h2>
          
          <div className="flex flex-col items-center justify-center mt-8 relative h-[180px]">
            {/* Faucet / Tube body */}
            <div className="relative left-[-16px]">
              {/* Horizontal pipe */}
              <div className="w-24 h-7 bg-gradient-to-b from-gray-300 to-gray-500 rounded-l-lg border-2 border-gray-600 shadow-md"></div>
              {/* Vertical spout */}
              <div className="absolute -right-6 top-0 w-8 h-12 bg-gradient-to-r from-gray-300 to-gray-500 rounded-b-lg border-x-2 border-b-2 border-gray-600 shadow-md"></div>
              {/* Handle */}
              <div 
                className={`absolute top-[-16px] left-8 w-10 h-4 bg-[#FF6B00] rounded border-2 border-[#cc5500] shadow-sm transition-all duration-500 origin-bottom ${isWaterFlowing ? 'rotate-[-45deg] translate-y-[2px]' : 'rotate-0'}`}
              ></div>
            </div>

            {/* Water Flow */}
            <div className="relative w-12 h-24 mt-5 ml-6 overflow-hidden flex justify-center items-start gap-1.5">
              <style>{`
                @keyframes dropFlow {
                  0% { transform: translateY(-20px) scaleY(0.8); opacity: 0; }
                  15% { transform: translateY(0px) scaleY(1.1); opacity: 1; }
                  70% { transform: translateY(60px) scaleY(1.1); opacity: 1; }
                  100% { transform: translateY(96px) scaleY(0.5); opacity: 0; }
                }
              `}</style>
              {isWaterFlowing && (
                <>
                  <div className="w-1.5 h-4 bg-blue-400 rounded-[50%] shadow-[0_0_8px_rgba(96,165,250,0.8)]" style={{ animation: 'dropFlow 0.6s infinite linear' }}></div>
                  <div className="w-2 h-5 bg-blue-500 rounded-[50%] shadow-[0_0_10px_rgba(59,130,246,0.8)] mt-2" style={{ animation: 'dropFlow 0.6s infinite linear 0.2s' }}></div>
                  <div className="w-1.5 h-3 bg-blue-300 rounded-[50%] shadow-[0_0_8px_rgba(147,197,253,0.8)]" style={{ animation: 'dropFlow 0.6s infinite linear 0.4s' }}></div>
                </>
              )}
            </div>

            {/* Ground/Puddle */}
            <div className="w-28 h-6 ml-6 border-b-2 border-[#1E1E1E] rounded-[100%] mt-1 relative">
              {isWaterFlowing && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-blue-500 opacity-40 rounded-[100%] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs font-mono text-gray-500">
            {isWaterFlowing ? (
              <span className="text-blue-400">Fetching Water...</span>
            ) : (
              <span>Tube Closed</span>
            )}
          </p>

          <button
            onClick={() => setManualFlowStatus(!isWaterFlowing)}
            className={`mt-4 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isWaterFlowing
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20"
            }`}
          >
            {isWaterFlowing ? "Close Tube" : "Fetch Water"}
          </button>
        </section>
      </div>

      {/* Recent Alerts */}
      <section className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
        <h2 className="text-sm font-medium text-white mb-4">Recent Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-xs text-gray-600">No recent alerts.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.alert_id}
                className="flex items-center justify-between rounded-xl border bg-[#141414] px-4 py-3"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: severityBorder[alert.severity] || "#374151",
                  borderColor: "#1E1E1E",
                }}
              >
                <div>
                  <p className="text-sm text-white">{alert.subject}</p>
                  <p className="text-xs text-gray-500">
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
