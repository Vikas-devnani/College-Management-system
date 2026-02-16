import React from 'react'

export default function Pagination({ page, pageSize, total, onChange }){
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onChange(Math.max(1, page-1))
  const next = () => onChange(Math.min(totalPages, page+1))
  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-slate-600">Showing {(page-1)*pageSize+1} - {Math.min(total, page*pageSize)} of {total}</div>
      <div className="flex items-center gap-2">
        <button onClick={prev} className="px-2 py-1 border rounded disabled:opacity-50" disabled={page===1}>Prev</button>
        <div className="px-3 py-1 border rounded">{page} / {totalPages}</div>
        <button onClick={next} className="px-2 py-1 border rounded disabled:opacity-50" disabled={page===totalPages}>Next</button>
      </div>
    </div>
  )
}
