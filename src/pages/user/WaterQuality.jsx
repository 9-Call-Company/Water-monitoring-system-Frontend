import { useEffect, useState } from "react";
import { Droplets, Loader2 } from "lucide-react";
import Badge from "../../components/shared/Badge";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function WaterQuality() {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    api
      .get("/quality", { params: { limit: 20 } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.records || [];
        setRecords(list);
        setLatest(list[0] || null);
      })
      .catch(() => showToast("Failed to load water quality data", "error"))
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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Droplets className="w-5 h-5 text-[#FF6B00]" /> Water Quality
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Quality readings for your water source.
        </p>
      </div>

      {/* Latest status banner */}
      {latest && (
        <section
          className={`rounded-2xl border p-4 ${latest.is_safe ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10"}`}
        >
          <div
            className={`text-sm font-medium ${latest.is_safe ? "text-emerald-300" : "text-red-300"}`}
          >
            {latest.is_safe
              ? "✓ Safe water quality"
              : "⚠ Water quality concern detected"}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            pH {parseFloat(latest.ph_level).toFixed(2)} · Turbidity{" "}
            {parseFloat(latest.turbidity).toFixed(2)} NTU
            {latest.notes && ` · ${latest.notes}`}
          </p>
        </section>
      )}

      {records.length === 0 ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm">
            No water quality records available yet.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#111111]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-widest text-gray-500">
              <tr>
                {["Date", "Source", "pH", "Turbidity", "Safe", "Notes"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr
                  key={row.quality_id}
                  className="border-t border-[#1E1E1E] hover:bg-[#161616] transition-colors"
                >
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {new Date(row.recorded_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {row.source?.source_name ?? `Source #${row.source_id}`}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {parseFloat(row.ph_level).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {parseFloat(row.turbidity).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={row.is_safe ? "active" : "critical"}
                      label={row.is_safe ? "Safe" : "Unsafe"}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {row.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
