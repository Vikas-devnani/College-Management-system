import React from 'react'

export default function Table({ columns, data, actions, sortKey, sortDir, onSort }) {
  function handleSort(key){
    if(!onSort) return
    const dir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc'
    onSort(key, dir)
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {onSort ? (
                  <button onClick={() => handleSort(col.key)} className="flex items-center gap-2">
                    <span>{col.title}</span>
                    <span className="text-xs text-slate-400">{sortKey===col.key? (sortDir==='asc'?'▲':'▼'):''}</span>
                  </button>
                ) : col.title}
              </th>
            ))}
            {actions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-700">{row[col.key]}</td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {actions.map((act) => (
                      <button key={act.key} onClick={() => act.onClick(row)} className={act.className}>
                        {act.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
