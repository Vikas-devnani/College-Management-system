import React from 'react'
export default function Badge({ children, color='blue' }){
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-700'
  }
  return <span className={`px-2 py-1 rounded-full text-xs ${colors[color]||colors.gray}`}>{children}</span>
}
