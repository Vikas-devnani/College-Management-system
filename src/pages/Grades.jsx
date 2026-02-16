import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { getGrades, addGrade, getStudents, getExams } from '../services/api'

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ student_id: '', exam_id: '', marks: 0, grade: '' })
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [gradeData, studData, examData] = await Promise.all([
        getGrades(),
        getStudents(),
        getExams()
      ])
      setGrades(Array.isArray(gradeData) ? gradeData : [])
      setStudents(Array.isArray(studData) ? studData : studData.data || [])
      setExams(Array.isArray(examData) ? examData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  function calculateGrade(marks) {
    if (marks >= 90) return 'A+'
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B+'
    if (marks >= 60) return 'B'
    if (marks >= 50) return 'C+'
    if (marks >= 40) return 'C'
    return 'F'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const grade = calculateGrade(form.marks)
    try {
      await addGrade({ ...form, grade })
      toast.push('Grade added', 'success')
      setOpen(false)
      setForm({ student_id: '', exam_id: '', marks: 0, grade: '' })
      fetchData()
    } catch (err) {
      toast.push('Error adding grade', 'error')
    }
  }

  const stats = {
    average: grades.length > 0 ? (grades.reduce((acc, g) => acc + (g.marks || 0), 0) / grades.length).toFixed(1) : 0,
    highest: grades.length > 0 ? Math.max(...grades.map(g => g.marks || 0)) : 0,
    lowest: grades.length > 0 ? Math.min(...grades.map(g => g.marks || 0)) : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grade Management</h1>
          <p className="text-slate-500 mt-1">Manage student grades and performance</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Add Grade
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Grades" value={grades.length} />
        <Card title="Average Marks" value={stats.average} />
        <Card title="Highest Marks" value={stats.highest} />
        <Card title="Lowest Marks" value={stats.lowest} />
      </div>

      {/* Grades Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Student Grades</h3>
          <span className="text-sm text-slate-500">{grades.length} records</span>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : grades.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No grades found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3 font-semibold">Student</th>
                  <th className="text-left p-3 font-semibold">Exam</th>
                  <th className="text-left p-3 font-semibold">Marks</th>
                  <th className="text-left p-3 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(grade => (
                  <tr key={grade.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{grade.student_name || 'N/A'}</td>
                    <td className="p-3">{grade.exam_title || 'N/A'}</td>
                    <td className="p-3">{grade.marks}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        grade.grade?.startsWith('A') ? 'bg-green-100 text-green-700' :
                        grade.grade?.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                        grade.grade?.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Grade Modal */}
      <Modal title="Add Grade" open={open} onClose={() => setOpen(false)}>
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
            <label className="block text-sm font-medium mb-1">Exam *</label>
            <select
              value={form.exam_id}
              onChange={(e) => setForm({...form, exam_id: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Exam</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marks *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.marks}
              onChange={(e) => setForm({...form, marks: parseFloat(e.target.value), grade: calculateGrade(parseFloat(e.target.value))})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Grade</label>
            <input
              type="text"
              value={calculateGrade(form.marks)}
              readOnly
              className="w-full border rounded-lg p-2 bg-slate-50"
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
              Add Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
