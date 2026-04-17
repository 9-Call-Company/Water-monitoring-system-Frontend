export default function StatCard({ label, value, sub, accent = false, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-wcam-border bg-wcam-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{label}</div>
          <div className={`mt-2 text-3xl font-semibold ${accent ? 'text-wcam-orange' : 'text-white'}`}>
            {value}
          </div>
          {sub ? <div className="mt-2 text-xs text-zinc-500">{sub}</div> : null}
        </div>
        {Icon ? <Icon className="h-5 w-5 text-wcam-orange" /> : null}
      </div>
    </div>
  );
}
