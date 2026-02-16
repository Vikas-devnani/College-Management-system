import React from 'react'

export default function ConfirmDialog({ open, title='Confirm', message, onConfirm, onCancel }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <div className="text-sm text-slate-600 mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded-md border">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 rounded-md bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  )
}
