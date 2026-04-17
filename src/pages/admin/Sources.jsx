import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";
import Toggle from "../../components/shared/Toggle";

const initialSources = [
  {
    id: 1,
    name: "Kigali Central",
    province: "Kigali",
    district: "Nyarugenge",
    cell: "Biryogo",
    robines: 18,
    status: true,
    flagged: false,
  },
  {
    id: 2,
    name: "Gasabo Hill",
    province: "Kigali",
    district: "Gasabo",
    cell: "Kinyinya",
    robines: 11,
    status: true,
    flagged: true,
  },
  {
    id: 3,
    name: "Huye Valley",
    province: "Southern",
    district: "Huye",
    cell: "Tumba",
    robines: 7,
    status: false,
    flagged: false,
  },
];

export default function Sources() {
  const [sources, setSources] = useState(initialSources);
  const [selected, setSelected] = useState(null);

  const stats = useMemo(
    () => ({
      total: sources.length,
      active: sources.filter((item) => item.status).length,
      inactive: sources.filter((item) => !item.status).length,
      flagged: sources.filter((item) => item.flagged).length,
    }),
    [sources],
  );

  const toggleSource = (id) => {
    setSources((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Water sources</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage source locations, status, and linked robines.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-wcam-orange px-4 py-2 text-sm font-medium text-black transition hover:bg-wcam-orangeHover">
          <Plus className="h-4 w-4" /> Add Source
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Sources" value={stats.total} accent />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Inactive" value={stats.inactive} />
        <StatCard
          label="Flagged"
          value={stats.flagged}
          sub="Needs review"
          accent={stats.flagged > 0}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Province</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Cell</th>
                <th className="px-4 py-3">Robines</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flagged</th>
                <th className="px-4 py-3">Toggle</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source, index) => (
                <tr
                  key={source.id}
                  className="border-t border-wcam-border hover:bg-[#151515]"
                >
                  <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{source.name}</div>
                    <div className="text-xs text-zinc-500">#{source.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{source.province}</td>
                  <td className="px-4 py-3 text-zinc-300">{source.district}</td>
                  <td className="px-4 py-3 text-zinc-300">{source.cell}</td>
                  <td className="px-4 py-3 text-wcam-orange">
                    {source.robines}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={source.status ? "active" : "inactive"}
                      label={source.status ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={source.flagged ? "warning" : "inactive"}
                      label={source.flagged ? "Flagged" : "Clear"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={source.status}
                      onChange={() => toggleSource(source.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn
                        label="View"
                        onClick={() => setSelected(source)}
                      />
                      <ActionBtn label="Edit" />
                      <ActionBtn label="Delete" variant="danger" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected ? (
          <div className="border-t border-wcam-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-white">
                  {selected.name}
                </h2>
                <p className="text-xs text-zinc-500">Source detail panel</p>
              </div>
              <button
                className="text-xs text-zinc-500"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {["id", "province", "district", "cell", "robines", "status"].map(
                (field) => (
                  <div
                    key={field}
                    className="rounded-xl border border-wcam-border bg-[#141414] p-3"
                  >
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      {field}
                    </div>
                    <div className="mt-2 text-sm text-white">
                      {String(selected[field])}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
