"use client"

export function Table({ columns, loading, children }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-sm font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                Cargando...
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}