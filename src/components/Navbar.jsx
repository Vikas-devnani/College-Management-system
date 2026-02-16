import React from 'react'

export default function Navbar({ onToggle }) {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded-md bg-slate-100" onClick={onToggle}>Menu</button>
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">Admin</div>
        <div className="w-8 h-8 rounded-full bg-primary-500 shadow-md" />
      </div>
    </header>
  )
}
