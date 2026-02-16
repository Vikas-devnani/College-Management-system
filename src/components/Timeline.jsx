import React from 'react'

export default function Timeline({ items = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h4 className="font-semibold mb-3">Today's Study Routine</h4>
      <div className="flex items-center space-x-2 overflow-auto">
        {items.map((it) => (
          <div key={it.label} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: it.color || '#e5e7eb' }}>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  )
}
