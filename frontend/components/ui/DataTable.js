export default function DataTable({ columns, rows, empty = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink/10 bg-ink/[0.03] text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3 font-semibold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">{empty}</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r._id}>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">{c.render ? c.render(r) : r[c.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}