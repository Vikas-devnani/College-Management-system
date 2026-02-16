import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { getAttendance, addAttendance, getStudents, getCourses } from '../services/api'
import { format } from 'date-fns'

export default function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ student_id: '', course_id: '', date: format(new Date(), 'yyyy-MM-dd'), status: 'present' })
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [attData, studData, courseData] = await Promise.all([
        getAttendance(),
        getStudents(),
        getCourses()
      ])
      setAttendance(Array.isArray(attData) ? attData : attData.data || [])
      setStudents(Array.isArray(studData) ? studData : studData.data || [])
      setCourses(Array.isArray(courseData) ? courseData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addAttendance(form)
      toast.push('Attendance marked', 'success')
      setOpen(false)
      setForm({ student_id: '', course_id: '', date: format(new Date(), 'yyyy-MM-dd'), status: 'present' })
      fetchData()
    } catch (err) {
      toast.push('Error marking attendance', 'error')
    }
  }

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-slate-500 mt-1">Track and manage student attendance</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Mark Attendance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Records" value={attendance.length} />
        <Card title="Present" value={stats.present} />
        <Card title="Absent" value={stats.absent} />
        <Card title="Late" value={stats.late} />
      </div>

      {/* Attendance Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Attendance Records</h3>
          <span className="text-sm text-slate-500">{attendance.length} records</span>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : attendance.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No attendance records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Student</th>
                  <th className="text-left p-3 font-semibold">Course</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{record.date}</td>
                    <td className="p-3 font-medium">{record.student_name || 'N/A'}</td>
                    <td className="p-3">{record.course_title || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Attendance Modal */}
      <Modal title="Mark Attendance" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student *</label>
            <select
              value={form.student_id}
              onChange={(e) => setForm({...form, student_id: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
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
              Mark Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
