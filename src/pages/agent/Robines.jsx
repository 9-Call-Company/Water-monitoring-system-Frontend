import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";

const robines = [
  {
    id: "R-1001",
    owner: "Alice M.",
    source: "Kigali Central",
    m3: 42.1,
    status: true,
  },
  {
    id: "R-1002",
    owner: "Clara T.",
    source: "Huye Valley",
    m3: 18.4,
    status: true,
  },
];

export default function Robines() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Robines</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your assigned customer connections.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Total Robines" value={robines.length} accent />
        <StatCard
          label="Active"
          value={robines.filter((item) => item.status).length}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">Robine</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">M3 consumed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {robines.map((robine) => (
              <tr
                key={robine.id}
                className="border-t border-wcam-border hover:bg-[#151515]"
              >
                <td className="px-4 py-3 text-white">{robine.id}</td>
                <td className="px-4 py-3 text-zinc-300">{robine.owner}</td>
                <td className="px-4 py-3 text-zinc-300">{robine.source}</td>
                <td className="px-4 py-3 text-wcam-orange">
                  {robine.m3.toFixed(1)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    type={robine.status ? "active" : "inactive"}
                    label={robine.status ? "Active" : "Inactive"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
