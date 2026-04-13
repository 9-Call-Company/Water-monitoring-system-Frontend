import Badge from "../../components/shared/Badge";

export default function WaterQuality() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Water quality</h1>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <div className="text-emerald-300">Safe</div>
        <p className="mt-2 text-sm text-zinc-400">pH 7.1 · Turbidity 0.4 NTU</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Safe</th>
              <th className="px-4 py-3">pH</th>
              <th className="px-4 py-3">Turbidity</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Apr 10", safe: true, ph: 7.1, turbidity: 0.4 },
              { date: "Apr 11", safe: false, ph: 6.8, turbidity: 0.8 },
            ].map((row) => (
              <tr key={row.date} className="border-t border-wcam-border">
                <td className="px-4 py-3 text-zinc-300">{row.date}</td>
                <td className="px-4 py-3">
                  <Badge
                    type={row.safe ? "active" : "critical"}
                    label={row.safe ? "Safe" : "Not safe"}
                  />
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.ph}</td>
                <td className="px-4 py-3 text-zinc-300">{row.turbidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
