import { useMemo, useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const usersSeed = [
  {
    id: 1,
    name: "Alice M.",
    email: "alice@example.com",
    phone: "0782000001",
    role: "admin",
    agent: "System",
    province: "Kigali",
    active: true,
  },
  {
    id: 2,
    name: "Ben K.",
    email: "ben@example.com",
    phone: "0782000002",
    role: "agent",
    agent: "Alice M.",
    province: "South",
    active: true,
  },
  {
    id: 3,
    name: "Clara T.",
    email: "clara@example.com",
    phone: "0782000003",
    role: "user",
    agent: "Ben K.",
    province: "West",
    active: false,
  },
];

export default function Users() {
  const [selected, setSelected] = useState(null);
  const stats = useMemo(
    () => ({
      total: usersSeed.length,
      admins: usersSeed.filter((item) => item.role === "admin").length,
      agents: usersSeed.filter((item) => item.role === "agent").length,
      inactive: usersSeed.filter((item) => !item.active).length,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage administrators, agents, and home users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={stats.total} accent />
        <StatCard label="Admins" value={stats.admins} />
        <StatCard label="Agents" value={stats.agents} />
        <StatCard label="Inactive" value={stats.inactive} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telephone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Province</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersSeed.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t border-wcam-border hover:bg-[#151515]"
                >
                  <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-zinc-500">ID #{user.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{user.email}</td>
                  <td className="px-4 py-3 text-zinc-300">{user.phone}</td>
                  <td className="px-4 py-3">
                    <Badge type={user.role} label={user.role} />
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{user.agent}</td>
                  <td className="px-4 py-3 text-zinc-300">{user.province}</td>
                  <td className="px-4 py-3">
                    <Badge
                      type={user.active ? "active" : "inactive"}
                      label={user.active ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionBtn
                        label="View"
                        onClick={() => setSelected(user)}
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
                  {selected.name}
                </h2>
                <p className="text-xs text-zinc-500">Profile details</p>
              </div>
              <button
                className="text-xs text-zinc-500"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                "name",
                "email",
                "phone",
                "role",
                "agent",
                "province",
                "active",
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
