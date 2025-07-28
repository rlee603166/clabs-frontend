"use client"

interface DataTableProps {
  data: Record<string, any>[]
}

export function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) return null

  const columns = Object.keys(data[0])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-white/10 backdrop-blur-sm">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 text-left text-gray-700 font-medium">
                  {column.replace("_", " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-white/10">
                {columns.map((column) => (
                  <td key={column} className="px-3 py-2 text-gray-700">
                    {String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
