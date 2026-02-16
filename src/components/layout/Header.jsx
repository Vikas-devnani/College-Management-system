import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationsPanel from '../NotificationsPanel'

function pathToBreadcrumb(path){
  const parts = path.split('/').filter(Boolean)
  return parts.map((p,i)=> ({ label: p.charAt(0).toUpperCase()+p.slice(1), to: '/' + parts.slice(0,i+1).join('/') }))
}

export default function Header({ onToggle }){
  const { user, logout } = useAuth()
  const loc = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const crumbs = pathToBreadcrumb(loc.pathname)
  const [notifOpen, setNotifOpen] = useState(false)

  function onSearch(){
    if(!q) return
    navigate(`/students?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded bg-gray-100" onClick={onToggle}>Menu</button>
        <div className="text-lg font-semibold">College ERP</div>
        <div className="ml-4">
          <div className="text-sm text-slate-500">{crumbs.length? crumbs.map(c=> c.label).join(' / ') : 'Home'}</div>
          <div className="mt-2 relative">
            <input value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Search students, courses..." className="px-3 py-2 border rounded-md w-72" />
            <button onClick={onSearch} className="ml-2 absolute right-1 top-1 px-2 py-1 bg-primary-500 text-white rounded">Go</button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button onClick={()=> setNotifOpen(s=>!s)} className="p-2 rounded hover:bg-gray-100">Notifications</button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{3}</span>
          <NotificationsPanel open={notifOpen} onClose={()=> setNotifOpen(false)} />
        </div>
        <div className="text-sm text-slate-600">{user?.name}</div>
        <button onClick={() => { logout(); navigate('/'); }} className="px-2 py-1 border rounded">Sign out</button>
      </div>
    </header>
  )
}
