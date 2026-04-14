import { useEffect, useState } from "react";
import { Droplets, Loader2, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function MyRobine() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [robine, setRobine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/robines")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setRobine(list[0] || null);
      })
      .catch(() => showToast("Failed to load robine data", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
      </div>
    );

  if (!robine)
    return (
      <div className="min-h-screen bg-[#0D0D0D] p-6 font-mono">
        <h1 className="text-xl font-bold text-white mb-4">
          My Home Connection
        </h1>
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-8 text-center">
          <Droplets className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No robine has been assigned to your account yet.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Contact your agent to get a robine assigned.
          </p>
        </div>
      </div>
    );

  const metrics = [
    [
      "Total M3 Consumed",
      `${parseFloat(robine.m3_consumed || 0).toFixed(3)} m³`,
    ],
    ["Source", robine.source?.source_name ?? `Source #${robine.source_id}`],
    ["Province", robine.province],
    ["District", robine.district],
    ["Cell", robine.cell],
    [
      "Assigned",
      robine.assigned_at
        ? new Date(robine.assigned_at).toLocaleDateString()
        : "—",
    ],
  ];

  return (
    <div className="space-y-6 bg-[#0D0D0D] min-h-screen p-6 font-mono">
      <div>
        <h1 className="text-xl font-bold text-white">My Home Connection</h1>
        <p className="mt-1 text-xs text-gray-500">
          Your water meter and connection details.
        </p>
      </div>

      {/* Header card */}
      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              Robine ID
            </div>
            <div className="mt-2 text-3xl font-bold text-[#FF6B00]">
              #{robine.robine_id}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {robine.province} / {robine.district} / {robine.cell}
            </p>
          </div>
          <Badge
            type={robine.status === "active" ? "active" : "inactive"}
            label={robine.status}
          />
        </div>
      </section>

      {/* Metrics grid */}
      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-wcam-border bg-wcam-card p-4"
          >
            <div className="text-[10px] uppercase tracking-widest text-gray-500">
              {label}
            </div>
            <div className="mt-2 text-sm text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Agent contact + Maintenance shortcut */}
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white mb-4">
            Assigned Agent
          </h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              {robine.agent?.full_name ?? "Agent not available"}
            </p>
          </div>
        </section>
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white mb-2">Need Help?</h2>
          <p className="text-xs text-gray-500 mb-4">
            Report an issue if your connection needs attention.
          </p>
          <button
            onClick={() => navigate("/user/maintenance")}
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Wrench className="w-4 h-4" /> Request Maintenance
          </button>
        </section>
      </div>
    </div>
  );
}
