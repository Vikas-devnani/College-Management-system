import React from 'react'

export default function Card({ title, value, variant='white', children }) {
  // If children are provided, render as a container (used in Dashboard)
  if (children) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        {children}
      </div>
    )
  }

  // Otherwise render as stat card (clean version without icons)
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      </div>
    </div>
  )
}
