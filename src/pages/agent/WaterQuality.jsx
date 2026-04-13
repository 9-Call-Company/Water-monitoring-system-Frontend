import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

export default function WaterQuality() {
  const rows = [
    {
      date: "Apr 10",
      source: "Kigali Central",
      ph: 7.1,
      turbidity: 0.4,
      safe: true,
    },
    {
      date: "Apr 11",
      source: "Huye Valley",
      ph: 6.8,
      turbidity: 0.8,
      safe: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Water quality</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Submit readings and review quality history.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-200">
        Safe water quality currently active for your primary source.
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <div className="space-y-3 text-sm text-zinc-400">
            <input
              className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
              placeholder="pH level"
            />
            <input
              className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
              placeholder="Turbidity"
            />
            <textarea
              className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
              rows={4}
              placeholder="Notes"
            />
            <div className="flex justify-end">
              <ActionBtn label="Submit Reading" variant="success" />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">pH</th>
                <th className="px-4 py-3">Turbidity</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t border-wcam-border">
                  <td className="px-4 py-3 text-zinc-300">{row.date}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.source}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.ph}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.turbidity}</td>
                  <td className="px-4 py-3">
                    <Badge
                      type={row.safe ? "active" : "critical"}
                      label={row.safe ? "Safe" : "Not safe"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
