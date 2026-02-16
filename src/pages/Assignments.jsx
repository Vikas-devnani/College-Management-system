import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { getAssignments, addAssignment, deleteAssignment, getCourses } from '../services/api'
import { format } from 'date-fns'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', course_id: '', due_date: '', created_by: 1 })
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [assignData, courseData] = await Promise.all([
        getAssignments(),
        getCourses()
      ])
      setAssignments(Array.isArray(assignData) ? assignData : [])
      setCourses(Array.isArray(courseData) ? courseData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addAssignment(form)
      toast.push('Assignment created', 'success')
      setOpen(false)
      setForm({ title: '', description: '', course_id: '', due_date: '', created_by: 1 })
      fetchData()
    } catch (err) {
      toast.push('Error creating assignment', 'error')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAssignment(id)
      toast.push('Assignment deleted', 'success')
      fetchData()
    } catch (err) {
      toast.push('Error deleting assignment', 'error')
    }
  }

  const upcomingAssignments = assignments.filter(a => new Date(a.due_date) >= new Date()).length
  const overdueAssignments = assignments.filter(a => new Date(a.due_date) < new Date()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignment Management</h1>
          <p className="text-slate-500 mt-1">Create and manage course assignments</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Create Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Assignments" value={assignments.length} />
        <Card title="Upcoming" value={upcomingAssignments} />
        <Card title="Overdue" value={overdueAssignments} />
        <Card title="Courses" value={courses.length} />
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-6 text-center text-slate-500">Loading...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-full p-6 text-center text-slate-500">No assignments found</div>
        ) : (
          assignments.map(assignment => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                <button
                  onClick={() => handleDelete(assignment.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-3">{assignment.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{assignment.course_title || 'N/A'}</span>
                <span className={`px-2 py-1 rounded ${new Date(assignment.due_date) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  Due: {assignment.due_date}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Assignment Modal */}
      <Modal title="Create Assignment" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              placeholder="Assignment title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Assignment description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course *</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm({...form, course_id: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({...form, due_date: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
