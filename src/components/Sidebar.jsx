import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/courses', label: 'Courses' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/exams', label: 'Exams' },
  { to: '/grades', label: 'Grades' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/messages', label: 'Messages' }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0f1724] text-white min-h-screen hidden md:block">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-semibold text-white">College</h1>
        <p className="text-xs text-slate-300 mt-1">Management System</p>
      </div>
      <nav className="p-4 sidebar-scroll">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md my-1 transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-white/5'
              }`
            }
          >
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
