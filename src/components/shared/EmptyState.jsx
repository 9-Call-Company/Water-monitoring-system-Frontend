export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-wcam-border bg-wcam-card p-8 text-center text-zinc-500">
      {Icon ? <Icon className="mb-3 h-8 w-8 text-wcam-orange" /> : null}
      <p className="max-w-sm text-sm">{message}</p>
    </div>
  );
}
