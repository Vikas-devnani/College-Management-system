import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/ToastContext'

const mockUsers = [
  { id: 1, name: 'Super Admin', email: 'admin@college.edu', role: 'admin', status: 'Active', joinDate: '2025-01-01', lastLogin: '2025-02-15' },
  { id: 2, name: 'Prof. Alice Johnson', email: 'alice@college.edu', role: 'faculty', status: 'Active', joinDate: '2025-01-05', lastLogin: '2025-02-15' },
  { id: 3, name: 'Bob Student', email: 'bob@student.edu', role: 'student', status: 'Active', joinDate: '2025-01-10', lastLogin: '2025-02-14' },
  { id: 4, name: 'Dr. Rajesh Kumar', email: 'rajesh@college.edu', role: 'faculty', status: 'Active', joinDate: '2025-01-08', lastLogin: '2025-02-15' },
  { id: 5, name: 'Priya Patel', email: 'priya@student.edu', role: 'student', status: 'Inactive', joinDate: '2025-01-15', lastLogin: '2025-02-05' },
]

export default function AdminUsers(){
  const [users, setUsers] = useState(mockUsers)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const toast = useToast()
  const { register } = useAuth()

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || u.role === filterRole
    return matchesSearch && matchesRole
  })

  async function handleCreate(e){
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.push('All fields are required', 'error')
      return
    }
    try {
      const newUser = {
        id: users.length + 1,
        ...form,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
      toast.push('User created successfully', 'success')
      setOpen(false)
      setForm({ name:'', email:'', password:'', role:'student' })
    } catch(err){ 
      toast.push(err.message, 'error') 
    }
  }

  function handleDeleteClick(user) {
    setSelectedUser(user)
    setConfirmDelete(true)
  }

  function confirmDeleteUser() {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id))
      toast.push('User deleted successfully', 'success')
      setConfirmDelete(false)
      setSelectedUser(null)
    }
  }

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    student: users.filter(u => u.role === 'student').length,
    active: users.filter(u => u.status === 'Active').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Users" value={users.length} />
        <Card title="Admins" value={roleStats.admin} />
        <Card title="Faculty" value={roleStats.faculty} />
        <Card title="Students" value={roleStats.student} />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <h3 className="font-semibold mb-4">Users ({filteredUsers.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Role</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Joined</th>
                <th className="text-left p-3 font-semibold">Last Login</th>
                <th className="text-left p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-slate-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{user.joinDate}</td>
                    <td className="p-3 text-slate-600">{user.lastLogin}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      <Modal title="Create New User" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
