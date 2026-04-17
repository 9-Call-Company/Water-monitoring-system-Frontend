import ActionBtn from "./ActionBtn";

export default function Pagination({ total, page, limit, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wcam-border px-4 py-3 text-xs text-zinc-400">
      <div>
        Showing {start}-{end} of {total}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (item) => (
            <ActionBtn
              key={item}
              label={String(item)}
              variant={item === page ? "success" : "default"}
              onClick={() => onChange(item)}
            />
          ),
        )}
      </div>
    </div>
  );
}
