import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const alerts = [
  {
    id: 1,
    subject: "Leak detected",
    user: "Alice M.",
    severity: "critical",
    time: "5m ago",
  },
  {
    id: 2,
    subject: "Quality update",
    user: "Clara T.",
    severity: "warning",
    time: "36m ago",
  },
];

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Alerts</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Alerts raised for your registered users.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-t border-wcam-border">
                <td className="px-4 py-3 text-white">{alert.subject}</td>
                <td className="px-4 py-3 text-zinc-300">{alert.user}</td>
                <td className="px-4 py-3">
                  <Badge type={alert.severity} label={alert.severity} />
                </td>
                <td className="px-4 py-3 text-zinc-300">{alert.time}</td>
                <td className="px-4 py-3">
                  <ActionBtn label="Ack" variant="success" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
