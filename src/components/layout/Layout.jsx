import React, { useState } from 'react'
import SidebarAdvanced from './SidebarAdvanced'
import Header from './Header'

export default function Layout({ children }){
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="min-h-screen flex">
      <SidebarAdvanced collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <Header onToggle={()=> setCollapsed(c=>!c)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
