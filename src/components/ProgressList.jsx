import React from 'react'

export default function ProgressList({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between bg-white px-4 py-3 rounded shadow-sm">
          <div>
            <div className="text-sm font-medium">{it.label}</div>
            <div className="text-xs text-slate-400">{it.sub || ''}</div>
          </div>
          <div className="w-40">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${it.value}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
