export default function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 rounded-full border transition ${checked ? "border-wcam-orange bg-wcam-orange" : "border-zinc-700 bg-zinc-800"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}
