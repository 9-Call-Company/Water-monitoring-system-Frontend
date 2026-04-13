import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const issues = [
  { id: 1, name: "Pipe leak", status: "open" },
  { id: 2, name: "Low pressure", status: "in_progress" },
];

export default function Issues() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Issues</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Field issues reported by your users.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">Issue</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-t border-wcam-border">
                <td className="px-4 py-3 text-white">{issue.name}</td>
                <td className="px-4 py-3">
                  <Badge
                    type={
                      issue.status === "resolved"
                        ? "resolved"
                        : issue.status === "in_progress"
                          ? "warning"
                          : "critical"
                    }
                    label={issue.status}
                  />
                </td>
                <td className="px-4 py-3">
                  <ActionBtn label="View" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
