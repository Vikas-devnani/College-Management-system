import React, { createContext, useContext, useEffect, useState } from 'react'
import { sampleUsers } from '../utils/sampleUsers'
export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('cms_session')
    if (raw) setUser(JSON.parse(raw))

    // ensure users store exists
    const usersRaw = localStorage.getItem('cms_users')
    if (!usersRaw) {
      localStorage.setItem('cms_users', JSON.stringify(sampleUsers))
    }
    setLoading(false)
  }, [])

  function login(email, password) {
    // simulate auth with persisted users
    const users = JSON.parse(localStorage.getItem('cms_users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (found) {
          const session = { id: found.id, name: found.name, role: found.role, email: found.email }
          setUser(session)
          localStorage.setItem('cms_session', JSON.stringify(session))
          resolve(session)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 700)
    })
  }

  function loginAdmin(password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('cms_users') || '[]')
        const found = users.find((u) => u.role === 'admin' && u.password === password)
        if (found) {
          const session = { id: found.id, name: found.name, role: found.role, email: found.email }
          setUser(session)
          localStorage.setItem('cms_session', JSON.stringify(session))
          resolve(session)
        } else {
          reject(new Error('Invalid admin secret'))
        }
      }, 500)
    })
  }

  function register({ name, email, password, role }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('cms_users') || '[]')
        if (users.find((u) => u.email === email)) return reject(new Error('Email already exists'))
        const id = Math.max(0, ...users.map((u) => u.id)) + 1
        const nu = { id, name, email, password, role }
        users.push(nu)
        localStorage.setItem('cms_users', JSON.stringify(users))
        const session = { id: nu.id, name: nu.name, role: nu.role, email: nu.email }
        setUser(session)
        localStorage.setItem('cms_session', JSON.stringify(session))
        resolve(session)
      }, 700)
    })
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('cms_session')
  }

  return <AuthContext.Provider value={{ user, loading, login, loginAdmin, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
