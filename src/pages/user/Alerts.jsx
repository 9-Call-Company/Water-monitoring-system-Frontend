import Badge from "../../components/shared/Badge";

const alerts = [
  { title: "Leak detected", severity: "critical", time: "5m ago" },
  { title: "Water quality warning", severity: "warning", time: "1h ago" },
];

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Alerts</h1>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
          >
            <div>
              <p className="text-sm text-white">{alert.title}</p>
              <p className="text-xs text-zinc-500">{alert.time}</p>
            </div>
            <Badge type={alert.severity} label={alert.severity} />
          </div>
        ))}
      </section>
    </div>
  );
}
