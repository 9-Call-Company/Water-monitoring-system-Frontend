const styleMap = {
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  inactive: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/20',
  critical: 'bg-red-500/15 text-red-300 border-red-500/20',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  open: 'bg-red-500/15 text-red-300 border-red-500/20',
  resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  admin: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/20',
  agent: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  user: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  system: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  manual: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
};

export default function Badge({ type = 'info', label }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${styleMap[type] ?? styleMap.info}`}>
      {label}
    </span>
  );
}
