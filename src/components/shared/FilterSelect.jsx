export default function FilterSelect({ options = [], value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-200 outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
