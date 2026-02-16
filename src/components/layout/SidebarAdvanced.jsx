import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to:'/dashboard', label:'Dashboard', roles:['admin','faculty','student'] },
  { to:'/students', label:'Students', roles:['admin'] },
  { to:'/faculty', label:'Faculty', roles:['admin'] },
  { to:'/courses', label:'Courses', roles:['admin','faculty'] },
  { to:'/finance', label:'Finance', roles:['admin'] },
  { to:'/attendance', label:'Attendance', roles:['admin','faculty'] },
  { to:'/assignments', label:'Assignments', roles:['admin','faculty'] },
  { to:'/exams', label:'Exams', roles:['admin','faculty'] },
  { to:'/grades', label:'Grades', roles:['admin','faculty'] },
  { to:'/notifications', label:'Notifications', roles:['admin','faculty','student'] },
  { to:'/messages', label:'Messages', roles:['admin','faculty','student'] }
]

export default function SidebarAdvanced({ collapsed }){
  const { user } = useAuth()
  return (
    <aside className={`min-h-screen transition-[width] duration-200 ${collapsed? 'w-20':'w-72'}`}>
      <div className="h-full bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 text-white rounded-r-2xl shadow-lg min-h-screen flex flex-col">
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center font-bold text-lg">CE</div>
          {!collapsed && (
            <div>
              <div className="font-bold text-lg">Studentbuddy</div>
              <div className="text-xs text-white/80">Learning Portal</div>
            </div>
          )}
        </div>

        <nav className="p-4 flex-1">
          <ul className="space-y-3">
            {navItems.filter(i=> i.roles.includes(user?.role)).map(it=> (
              <li key={it.to}>
                <NavLink to={it.to} className={({isActive})=>`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${isActive? 'bg-white/10 text-white':'text-white/90 hover:bg-white/5'}`}>
                  {!collapsed && <span className="font-medium">{it.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div>
                <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
                <div className="text-xs text-white/80">{user?.role || 'visitor'}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20" />
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
