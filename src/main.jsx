import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './main.css'
import { sampleUsers } from './utils/sampleUsers'

// Dev convenience: if no session exists, auto-set an Admin session so UI is visible.
try {
  if (!localStorage.getItem('cms_session')) {
    const admin = sampleUsers.find(u => u.role === 'admin')
    if (admin) {
      localStorage.setItem('cms_session', JSON.stringify({ id: admin.id, name: admin.name, role: admin.role, email: admin.email }))
    }
  }
} catch (e) { /* ignore in restricted environments */ }

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
