import { useState } from "react";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const users = [
  {
    id: 1,
    name: "Alice M.",
    email: "alice@example.com",
    phone: "0782000001",
    robine: "R-1001",
    province: "Kigali",
    active: true,
    date: "Apr 01",
  },
  {
    id: 2,
    name: "Clara T.",
    email: "clara@example.com",
    phone: "0782000002",
    robine: "R-1002",
    province: "South",
    active: true,
    date: "Apr 04",
  },
];

export default function MyUsers() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">My users</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Users registered under your account.
          </p>
        </div>
        <button className="rounded-lg bg-wcam-orange px-4 py-2 text-sm font-medium text-black">
          Register New User
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Total My Users" value={users.length} accent />
        <StatCard
          label="Active Users"
          value={users.filter((item) => item.active).length}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-wcam-border bg-wcam-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#141414] text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telephone</th>
              <th className="px-4 py-3">Robine</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-wcam-border hover:bg-[#151515]"
              >
                <td className="px-4 py-3 text-zinc-500">{index + 1}</td>
                <td className="px-4 py-3 text-white">{user.name}</td>
                <td className="px-4 py-3 text-zinc-300">{user.email}</td>
                <td className="px-4 py-3 text-zinc-300">{user.phone}</td>
                <td className="px-4 py-3 text-zinc-300">{user.robine}</td>
                <td className="px-4 py-3 text-zinc-300">{user.province}</td>
                <td className="px-4 py-3">
                  <Badge
                    type={user.active ? "active" : "inactive"}
                    label={user.active ? "Active" : "Inactive"}
                  />
                </td>
                <td className="px-4 py-3 text-zinc-300">{user.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <ActionBtn label="View" onClick={() => setSelected(user)} />
                    <ActionBtn label="Toggle" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected ? (
          <div className="border-t border-wcam-border p-5 text-sm text-zinc-300">
            Selected: {selected.name}{" "}
            <button
              className="ml-4 text-xs text-zinc-500"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
