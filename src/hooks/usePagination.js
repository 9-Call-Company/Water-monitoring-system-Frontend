import { useMemo, useState } from "react";

export default function usePagination(total, limit = 8) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return { page, totalPages, goToPage, setPage, limit };
}
