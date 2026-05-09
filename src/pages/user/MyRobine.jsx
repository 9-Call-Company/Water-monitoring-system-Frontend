import { useEffect, useState } from "react";
import { Droplets, Loader2, Wrench, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const ConsumptionTable = ({ robineId }) => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (!robineId) return;

    setLoading(true);
    api
      .get("/sensor-data", { params: { robine_id: robineId, limit: 500 } })
      .then((res) => {
        const data = Array.isArray(res.data?.readings) ? res.data.readings : [];
        setReadings(data.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at)));
      })
      .catch(() => showToast("Failed to load consumption data", "error"))
      .finally(() => setLoading(false));
  }, [robineId]);

  // Group readings by date and hour
  const groupedData = readings.reduce((acc, reading) => {
    const date = new Date(reading.recorded_at);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const hour = date.getHours().toString().padStart(2, "0") + ":00";
    const key = `${dateKey}|${hour}`;

    if (!acc[key]) {
      acc[key] = {
        date: dateKey,
        hour,
        m3_delta: 0,
        count: 0,
      };
    }

    const delta = parseFloat(reading.m3_delta || 0);
    acc[key].m3_delta += delta;
    acc[key].count += 1;

    return acc;
  }, {});

  const sortedData = Object.values(groupedData)
    .sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.hour.localeCompare(b.hour);
    })
    .reverse(); // Most recent first

  // Filter by date if selected
  const filteredData = filterDate
    ? sortedData.filter((item) => item.date === filterDate)
    : sortedData;

  // Calculate summaries
  const calculatePeriodTotal = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    return filteredData
      .filter((item) => item.date >= cutoffStr)
      .reduce((sum, item) => sum + item.m3_delta, 0);
  };

  const today = filteredData
    .filter((item) => item.date === new Date().toISOString().split("T")[0])
    .reduce((sum, item) => sum + item.m3_delta, 0);

  const thisWeek = calculatePeriodTotal(7);
  const thisMonth = calculatePeriodTotal(30);

  const getConsumptionClass = (m3) => {
    if (m3 > 0.1) return "bg-red-950/30 border-red-700";
    if (m3 > 0.05) return "bg-amber-950/30 border-amber-700";
    return "bg-green-950/30 border-green-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
      <h2 className="text-sm font-medium text-white mb-4">Water Consumption</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-950/30 border border-blue-700 rounded-lg p-3">
          <div className="text-[10px] text-blue-400 uppercase tracking-widest">
            Today
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {today.toFixed(3)} m³
          </div>
        </div>
        <div className="bg-cyan-950/30 border border-cyan-700 rounded-lg p-3">
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest">
            This Week
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {thisWeek.toFixed(3)} m³
          </div>
        </div>
        <div className="bg-purple-950/30 border border-purple-700 rounded-lg p-3">
          <div className="text-[10px] text-purple-400 uppercase tracking-widest">
            This Month
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            {thisMonth.toFixed(3)} m³
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-gray-500 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Consumption Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E1E1E]">
              <th className="text-left py-2 px-3 text-[10px] text-gray-500 uppercase tracking-widest">
                Date
              </th>
              <th className="text-left py-2 px-3 text-[10px] text-gray-500 uppercase tracking-widest">
                Hour
              </th>
              <th className="text-right py-2 px-3 text-[10px] text-gray-500 uppercase tracking-widest">
                Consumption (m³)
              </th>
              <th className="text-right py-2 px-3 text-[10px] text-gray-500 uppercase tracking-widest">
                Readings
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 text-xs">
                  No consumption data available
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={`${item.date}|${item.hour}`}
                  className={`border-b border-[#1E1E1E] ${getConsumptionClass(
                    item.m3_delta
                  )}`}
                >
                  <td className="py-2 px-3 text-white">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-3 text-white">{item.hour}</td>
                  <td className="py-2 px-3 text-right text-white font-semibold">
                    {item.m3_delta.toFixed(4)}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-400 text-xs">
                    {item.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Total records: {filteredData.length} / {sortedData.length}
      </div>
    </section>
  );
};

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

      {/* Consumption Table */}
      <ConsumptionTable robineId={robine.robine_id} />

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
