import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()

  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    const r = params.get('role')
    if (r) setRole(r)
  },[location.search])

  async function handleSubmit(e){
    e.preventDefault()
    if(!name || !email || !password) return setError('Please fill all fields')
    try{
      await register({ name, email, password, role })
      navigate('/dashboard')
    }catch(err){
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded-md">Create account</button>
          </div>
        </form>
      </div>
    </div>
  )
}
