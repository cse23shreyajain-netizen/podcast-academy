export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4 text-sm">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-ink/20 px-4 py-2 font-medium disabled:opacity-40"
      >
        Previous
      </button>
      <span>Page {page} of {pages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="rounded-lg border border-ink/20 px-4 py-2 font-medium disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}