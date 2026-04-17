export default function SearchInput({
  placeholder = "Search",
  onChange,
  icon: Icon,
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-zinc-300">
      {Icon ? <Icon className="h-4 w-4 text-zinc-500" /> : null}
      <input
        type="text"
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full bg-transparent outline-none placeholder:text-zinc-500"
      />
    </div>
  );
}
