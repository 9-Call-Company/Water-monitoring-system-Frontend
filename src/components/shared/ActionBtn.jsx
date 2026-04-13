export default function ActionBtn({ label, variant = 'default', onClick, type = 'button' }) {
  const styles = {
    default: 'border-wcam-border bg-[#151515] text-zinc-200 hover:border-wcam-orange hover:text-white',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400',
    danger: 'border-red-500/30 bg-red-500/10 text-red-200 hover:border-red-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${styles[variant] ?? styles.default}`}
    >
      {label}
    </button>
  );
}
