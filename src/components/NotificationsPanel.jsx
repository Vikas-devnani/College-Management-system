import React, { useState, useEffect } from 'react'
import { activitiesData } from '../data/data'

export default function NotificationsPanel({ open, onClose }){
  const [items, setItems] = useState([])

  useEffect(()=>{
    // load from mock data; in real app this would be an API call
    setItems(activitiesData)
  },[])

  if(!open) return null
  return (
    <div className="absolute right-4 top-14 w-96 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b">Notifications</div>
      <div className="p-3 max-h-64 overflow-auto space-y-2">
        {items.map(it=> (
          <div key={it.id} className="p-2 rounded hover:bg-gray-50">
            <div className="text-sm text-slate-700">{it.activity}</div>
            <div className="text-xs text-slate-400">{it.time}</div>
          </div>
        ))}
        {items.length===0 && <div className="text-sm text-slate-500 p-3">No notifications</div>}
      </div>
      <div className="p-3 border-t text-center">
        <button onClick={onClose} className="px-3 py-2 rounded bg-primary-500 text-white">Close</button>
      </div>
    </div>
  )
}
