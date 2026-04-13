import { useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const robinesSeed = [
  {
    id: "R-1001",
    owner: "Alice M.",
    source: "Kigali Central",
    agent: "Ben K.",
    m3: 42.14,
    sensor: "normal",
    active: true,
  },
  {
    id: "R-1002",
    owner: "Clara T.",
    source: "Huye Valley",
    agent: "Ben K.",
    m3: 18.4,
    sensor: "leak",
    active: true,
  },
  {
    id: "R-1003",
    owner: "Jude P.",
    source: "Gasabo Hill",
    agent: "Alice M.",
    m3: 28.9,
    sensor: "low",
    active: false,
  },
];

export default function Robines() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Robines</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track home connections, sensor state, and consumption.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Robines" value={robinesSeed.length} accent />
        <StatCard
          label="Active"
          value={robinesSeed.filter((item) => item.active).length}
        />
        <StatCard
          label="Inactive"
          value={robinesSeed.filter((item) => !item.active).length}
        />
        <StatCard
          label="Leak Detected"
          value={robinesSeed.filter((item) => item.sensor === "leak").length}
          accent
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Robine</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">M3 Consumed</th>
                <th className="px-4 py-3">Sensor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {robinesSeed.map((robine, index) => (
                <tr
                  key={robine.id}
                  className={`border-t border-wcam-border hover:bg-[#151515] ${robine.sensor === "leak" ? "border-l-4 border-l-red-500" : ""}`}
                >
                  <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {robine.id}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{robine.owner}</td>
                  <td className="px-4 py-3 text-zinc-300">{robine.source}</td>
                  <td className="px-4 py-3 text-zinc-300">{robine.agent}</td>
                  <td className="px-4 py-3 text-wcam-orange">
                    {robine.m3.toFixed(2)} m3
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={
                        robine.sensor === "leak"
                          ? "critical"
                          : robine.sensor === "low"
                            ? "warning"
                            : "active"
                      }
                      label={robine.sensor}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={robine.active ? "active" : "inactive"}
                      label={robine.active ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn
                        label="View"
                        onClick={() => setSelected(robine)}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-white">
                  {selected.id}
                </h2>
                <p className="text-xs text-zinc-500">Selected robine details</p>
              </div>
              <button
                className="text-xs text-zinc-500"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {["owner", "source", "agent", "m3", "sensor", "active"].map(
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
