import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { getExams, addExam, deleteExam, getCourses } from '../services/api'

export default function Exams() {
  const [exams, setExams] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', course_id: '', date: '', duration: 60, total_marks: 100 })
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [examData, courseData] = await Promise.all([
        getExams(),
        getCourses()
      ])
      setExams(Array.isArray(examData) ? examData : [])
      setCourses(Array.isArray(courseData) ? courseData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addExam(form)
      toast.push('Exam created', 'success')
      setOpen(false)
      setForm({ title: '', course_id: '', date: '', duration: 60, total_marks: 100 })
      fetchData()
    } catch (err) {
      toast.push('Error creating exam', 'error')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteExam(id)
      toast.push('Exam deleted', 'success')
      fetchData()
    } catch (err) {
      toast.push('Error deleting exam', 'error')
    }
  }

  const upcomingExams = exams.filter(e => new Date(e.date) >= new Date()).length
  const pastExams = exams.filter(e => new Date(e.date) < new Date()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exam Management</h1>
          <p className="text-slate-500 mt-1">Schedule and manage exams</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Schedule Exam
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Exams" value={exams.length} />
        <Card title="Upcoming" value={upcomingExams} />
        <Card title="Completed" value={pastExams} />
        <Card title="Total Marks" value={exams.reduce((acc, e) => acc + (e.total_marks || 0), 0)} />
      </div>

      {/* Exams Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Exam Schedule</h3>
          <span className="text-sm text-slate-500">{exams.length} exams</span>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No exams scheduled</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3 font-semibold">Title</th>
                  <th className="text-left p-3 font-semibold">Course</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                  <th className="text-left p-3 font-semibold">Total Marks</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{exam.title}</td>
                    <td className="p-3">{exam.course_title || 'N/A'}</td>
                    <td className="p-3">{exam.date}</td>
                    <td className="p-3">{exam.duration} min</td>
                    <td className="p-3">{exam.total_marks}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Exam Modal */}
      <Modal title="Schedule Exam" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Exam Title *</label>
            <input
              type="text"
              placeholder="Exam title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Marks</label>
              <input
                type="number"
                value={form.total_marks}
                onChange={(e) => setForm({...form, total_marks: parseInt(e.target.value)})}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
