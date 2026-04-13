import { useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const issuesSeed = [
  {
    id: 1,
    name: "Pipe leak",
    reportedBy: "Alice M.",
    source: "Kigali Central",
    province: "Kigali",
    agent: "Ben K.",
    status: "open",
    date: "Apr 11",
  },
  {
    id: 2,
    name: "Low pressure",
    reportedBy: "Clara T.",
    source: "Huye Valley",
    province: "Southern",
    agent: "Alice M.",
    status: "in_progress",
    date: "Apr 10",
  },
  {
    id: 3,
    name: "Valve issue",
    reportedBy: "Jude P.",
    source: "Gasabo Hill",
    province: "Kigali",
    agent: "Ben K.",
    status: "resolved",
    date: "Apr 09",
  },
];

export default function Issues() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered =
    filter === "All"
      ? issuesSeed
      : issuesSeed.filter((item) => item.status === filter.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Issues & monitor</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track and resolve user reported maintenance issues.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["Total Issues", "Open", "In Progress", "Resolved"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`rounded-2xl border p-4 text-left ${filter === label ? "border-wcam-orange bg-[#FF6B0014]" : "border-wcam-border bg-wcam-card"}`}
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              {label}
            </div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {label === "Total Issues"
                ? issuesSeed.length
                : issuesSeed.filter(
                    (item) =>
                      item.status === label.toLowerCase().replace(" ", "_"),
                  ).length}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
        {["All", "open", "in_progress", "resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab === "All" ? "All" : tab)}
            className={`rounded-full border px-3 py-2 ${filter === tab ? "border-wcam-orange text-wcam-orange" : "border-wcam-border bg-wcam-card"}`}
          >
            {tab === "All" ? "All" : tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Reported by</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Province</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue, index) => (
                <tr
                  key={issue.id}
                  className={`border-t border-wcam-border hover:bg-[#151515] ${issue.status === "open" ? "border-l-4 border-l-red-500" : issue.status === "in_progress" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-700"}`}
                >
                  <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="text-white">{issue.name}</div>
                    <div className="text-xs text-zinc-500">#{issue.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {issue.reportedBy}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{issue.source}</td>
                  <td className="px-4 py-3 text-zinc-300">{issue.province}</td>
                  <td className="px-4 py-3 text-zinc-300">{issue.agent}</td>
                  <td className="px-4 py-3">
                    <Badge
                      type={
                        issue.status === "resolved"
                          ? "resolved"
                          : issue.status === "in_progress"
                            ? "warning"
                            : "critical"
                      }
                      label={issue.status.replace("_", " ")}
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{issue.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn
                        label="View"
                        onClick={() => setSelected(issue)}
                      />
                      <ActionBtn label="Resolve" variant="success" />
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
                  {selected.name}
                </h2>
                <p className="text-xs text-zinc-500">Issue detail panel</p>
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
                "reportedBy",
                "source",
                "province",
                "agent",
                "status",
                "date",
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
