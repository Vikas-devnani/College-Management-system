import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import DashboardChart from '../components/DashboardChart'
import { useToast } from '../components/ui/ToastContext'
import api from '../services/api'

const mockClassmates = [
  { id: 1, name: 'Aarav Sharma', course: 'Computer Science', year: '2nd Year', status: 'active', avatar: '' },
  { id: 2, name: 'Neha Gupta', course: 'Computer Science', year: '2nd Year', status: 'active', avatar: '' },
  { id: 3, name: 'Rohan Singh', course: 'Computer Science', year: '2nd Year', status: 'active', avatar: '' },
  { id: 4, name: 'Priya Patel', course: 'Computer Science', year: '2nd Year', status: 'inactive', avatar: '' },
  { id: 5, name: 'Amit Kumar', course: 'Computer Science', year: '2nd Year', status: 'active', avatar: '' },
  { id: 6, name: 'Sneha Verma', course: 'Computer Science', year: '2nd Year', status: 'active', avatar: '' },
]

export default function Students() {
  const [students, setStudents] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', course: '', year: '' })
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [timePeriod, setTimePeriod] = useState('today')
  const toast = useToast()

  const fetch = useCallback(async ()=>{
    setLoading(true)
    try{
      const res = await api.getStudents()
      setStudents(Array.isArray(res) ? res : res.data || [])
    }catch(err){ 
      toast.push(err.message, 'error')
      // Use mock data on error
      setStudents([
        { id: 1, name: 'Alice Johnson', email: 'alice@student.edu', course: 'CS', year: '3' },
        { id: 2, name: 'Bob Smith', email: 'bob@student.edu', course: 'BM', year: '2' },
      ])
    }
    setLoading(false)
  },[toast])

  useEffect(()=>{ fetch() },[fetch])

  function openAdd() {
    setForm({ name: '', email: '', course: '', year: '' })
    setEditing(null)
    setOpen(true)
  }

  function handleEdit(row) {
    setEditing(row)
    setForm({ name: row.name, email: row.email, course: row.course, year: row.year })
    setOpen(true)
  }

  function handleDelete(row) {
    setToDelete(row)
    setConfirmOpen(true)
  }

  async function confirmDelete(){
    if(!toDelete) return
    try{
      await api.deleteStudent(toDelete.id)
      toast.push('Student deleted', 'success')
      setConfirmOpen(false)
      setToDelete(null)
      fetch()
    }catch(err){ toast.push(err.message, 'error') }
  }

  function handleSave(e) {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.push('Name and email are required', 'error')
      return
    }
    (async ()=>{
      try{
        if (editing) {
          await api.updateStudent(editing.id, form)
          toast.push('Student updated', 'success')
        } else {
          await api.addStudent(form)
          toast.push('Student added', 'success')
        }
        setOpen(false)
        setForm({ name: '', email: '', course: '', year: '' })
        fetch()
      }catch(err){ toast.push(err.message, 'error') }
    })()
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.email.toLowerCase().includes(q.toLowerCase())
  )

  const enrollmentData = {
    labels: ['CS', 'BM', 'Math', 'Physics', 'Economics'],
    values: [24, 18, 15, 12, 10]
  }

  const coursePerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    values: [65, 72, 68, 78, 82]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
          <p className="text-slate-500 mt-1">Manage and track all students</p>
        </div>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Add Student
        </button>
      </div>

      {/* Time Period Filters */}
      <div className="flex gap-2">
        {['today', 'week', 'month'].map(period => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timePeriod === period
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Students" value={students.length} />
        <Card title="Active" value={Math.ceil(students.length * 0.95)} />
        <Card title="Enrolled Courses" value="42" />
        <Card title="Avg Performance" value="78%" />
      </div>

      {/* Charts and Classmates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Chart */}
          <Card>
            <h3 className="font-semibold mb-4">Enrollment by Course</h3>
            <div className="h-64">
              <DashboardChart data={enrollmentData} />
            </div>
          </Card>

          {/* Performance Chart */}
          <Card>
            <h3 className="font-semibold mb-4">Average Performance Trend</h3>
            <div className="h-64">
              <DashboardChart data={coursePerformanceData} />
            </div>
          </Card>
        </div>

        {/* Right: Classmates/Students */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Classmates</h3>
              <span className="text-sm text-slate-500">{mockClassmates.length} people</span>
            </div>
            <div className="space-y-3">
              {mockClassmates.map(mate => (
                <div key={mate.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                    {mate.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">{mate.name}</div>
                    <div className="text-xs text-slate-500">{mate.course}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${mate.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Students Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">All Students</h3>
          <span className="text-sm text-slate-500">{filteredStudents.length} results</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Course</th>
                <th className="text-left p-3 font-semibold">Year</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">Loading...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">No students found</td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3 text-slate-600">{student.email}</td>
                    <td className="p-3">{student.course}</td>
                    <td className="p-3">{student.year}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal title={editing ? 'Edit Student' : 'Add Student'} open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              placeholder="Student name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              placeholder="student@email.com"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              type="text"
              placeholder="Course name"
              value={form.course}
              onChange={(e) => setForm({...form, course: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({...form, year: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Student"
        message={`Are you sure you want to delete "${toDelete?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
