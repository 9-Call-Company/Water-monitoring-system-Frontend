import { useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const alertsSeed = [
  {
    id: 1,
    subject: "Pressure drop",
    user: "Alice M.",
    source: "Kigali Central",
    severity: "critical",
    generated: "system",
    status: "active",
    time: "5m ago",
  },
  {
    id: 2,
    subject: "Quality drift",
    user: "Clara T.",
    source: "Huye Valley",
    severity: "warning",
    generated: "manual",
    status: "resolved",
    time: "1h ago",
  },
  {
    id: 3,
    subject: "Sync complete",
    user: "Jude P.",
    source: "Gasabo Hill",
    severity: "info",
    generated: "system",
    status: "active",
    time: "2h ago",
  },
];

export default function Alerts() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Alerts</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Live alerts stream
          </p>
        </div>
        <div className="flex gap-2">
          <ActionBtn label="Email All Users" />
          <button className="rounded-lg bg-wcam-orange px-4 py-2 text-sm font-medium text-black">
            Send Alert
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Total Alerts" value={alertsSeed.length} accent />
        <StatCard
          label="Critical"
          value={
            alertsSeed.filter((item) => item.severity === "critical").length
          }
        />
        <StatCard
          label="Warning"
          value={
            alertsSeed.filter((item) => item.severity === "warning").length
          }
        />
        <StatCard
          label="Info"
          value={alertsSeed.filter((item) => item.severity === "info").length}
        />
        <StatCard
          label="Active"
          value={alertsSeed.filter((item) => item.status === "active").length}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Generated</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alertsSeed.map((alert, index) => (
                <tr
                  key={alert.id}
                  className={`border-t border-wcam-border hover:bg-[#151515] ${alert.severity === "critical" ? "border-l-4 border-l-red-500" : alert.severity === "warning" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-sky-500"}`}
                >
                  <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="text-white">{alert.subject}</div>
                    <div className="text-xs text-zinc-500">#{alert.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{alert.user}</td>
                  <td className="px-4 py-3 text-zinc-300">{alert.source}</td>
                  <td className="px-4 py-3">
                    <Badge type={alert.severity} label={alert.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge type={alert.generated} label={alert.generated} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      type={alert.status === "active" ? "active" : "resolved"}
                      label={alert.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{alert.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn
                        label="View"
                        onClick={() => setSelected(alert)}
                      />
                      <ActionBtn label="Ack" variant="success" />
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
                  {selected.subject}
                </h2>
                <p className="text-xs text-zinc-500">Alert detail panel</p>
              </div>
              <button
                className="text-xs text-zinc-500"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {[
                "id",
                "user",
                "source",
                "severity",
                "generated",
                "status",
                "time",
              ].map((field) => (
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
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
