import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAdmin } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const r = params.get('role')
    if (r) setRole(r)
  }, [location.search])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (role === 'admin') {
      if (!password) return setError('Please enter admin secret')
      try {
        await loginAdmin(password)
        navigate('/dashboard')
      } catch (err) {
        setError(err.message)
      }
      return
    }
    if (!email || !password) return setError('Please fill all fields')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  // demo autofill removed for production-like flow

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in {role && <span className="text-sm text-slate-500">as {role}</span>}</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role !== 'admin' && (
            <div>
              <label className="block text-sm text-slate-600">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-600">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div className="flex items-center justify-end">
            <button className="bg-primary-500 text-white px-4 py-2 rounded-md">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}
