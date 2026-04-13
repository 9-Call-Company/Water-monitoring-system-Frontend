import { Bell, Droplets, ShieldCheck, Users } from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";

export default function Dashboard() {
  const users = [
    { name: "Alice M.", date: "Apr 01", status: "active" },
    { name: "Clara T.", date: "Apr 03", status: "active" },
    { name: "Jude P.", date: "Apr 05", status: "inactive" },
  ];

  const issues = [
    { title: "Low pressure at source", status: "open" },
    { title: "Valves need inspection", status: "in_progress" },
    { title: "Water quality stable", status: "resolved" },
  ];

  const alerts = [
    {
      title: "Leak warning for R-1002",
      user: "Clara T.",
      severity: "critical",
      time: "6m ago",
    },
    {
      title: "Quality update",
      user: "Alice M.",
      severity: "warning",
      time: "40m ago",
    },
    {
      title: "Sync finished",
      user: "Jude P.",
      severity: "info",
      time: "2h ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome, Agent</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overview of the users and equipment you manage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="My Total Users" value="32" accent icon={Users} />
        <StatCard label="Active Robines" value="24" icon={Droplets} />
        <StatCard label="Open Issues" value="5" icon={ShieldCheck} />
        <StatCard label="Unread Alerts" value="3" icon={Bell} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">
            Recently registered users
          </h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{user.name}</p>
                  <p className="text-xs text-zinc-500">
                    Registered {user.date}
                  </p>
                </div>
                <Badge
                  type={user.status === "active" ? "active" : "inactive"}
                  label={user.status}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">Open issues</h2>
          <div className="mt-4 space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.title}
                className="rounded-xl border border-wcam-border bg-[#141414] p-4"
              >
                <p className="text-sm text-white">{issue.title}</p>
                <div className="mt-2 flex justify-end">
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
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <h2 className="text-sm font-medium text-white">Recent alerts</h2>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{alert.title}</p>
                <p className="text-xs text-zinc-500">{alert.user}</p>
              </div>
              <Badge type={alert.severity} label={alert.time} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
