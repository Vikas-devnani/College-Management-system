import React from 'react'

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 transform transition-all duration-200 scale-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  )
}
