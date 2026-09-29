import "./Pagination.css";

// Page numbers to show: always first & last, plus neighbours of the current
// page, with "…" gaps — keeps the bar short enough for a phone screen.
const getPages = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push(`gap-${page}`);
    result.push(page);
  });
  return result;
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className='pagination' aria-label='Pagination'>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label='Previous page'>
        ‹ Prev
      </button>

      {getPages(currentPage, totalPages).map((page) =>
        typeof page === "string" ? (
          <span key={page} className='pagination-gap'>
            …
          </span>
        ) : (
          <button
            key={page}
            className={currentPage === page ? "active-page" : ""}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}>
            {page}
          </button>
        ),
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label='Next page'>
        Next ›
      </button>
    </nav>
  );
}

export default Pagination;
