import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

export default function MyRobine() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          My home connection
        </h1>
      </div>

      <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Robine ID
            </div>
            <div className="mt-2 text-2xl font-semibold text-wcam-orange">
              R-1001
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Kigali / Kicukiro / Biryogo
            </p>
          </div>
          <Badge type="active" label="Active" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total M3", "42.1"],
          ["Flow Rate", "2.8 L/min"],
          ["Valve Status", "Open"],
          ["Leak Status", "No leak"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-wcam-border bg-wcam-card p-4"
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              {label}
            </div>
            <div className="mt-2 text-xl text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">Agent contact</h2>
          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <p>Ben K.</p>
            <p>ben@example.com</p>
            <p>0782000002</p>
          </div>
        </section>

        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">
            Maintenance shortcut
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Report an issue if your connection needs attention.
          </p>
          <div className="mt-4">
            <ActionBtn label="Request Maintenance" variant="success" />
          </div>
        </section>
      </div>
    </div>
  );
}
