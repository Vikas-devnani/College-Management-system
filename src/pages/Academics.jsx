import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import DashboardChart from '../components/DashboardChart'
import { useToast } from '../components/ui/ToastContext'

const mockSchedule = [
  { id: 1, course: 'Mathematics', instructor: 'Dr. Rajesh Kumar', time: '09:00 - 10:30', day: 'Monday', room: 'A101', type: 'Lecture' },
  { id: 2, course: 'Physics', instructor: 'Prof. Sarah Lee', time: '10:45 - 12:15', day: 'Monday', room: 'B205', type: 'Lab' },
  { id: 3, course: 'English', instructor: 'Prof. Ananya Singh', time: '14:00 - 15:30', day: 'Tuesday', room: 'C301', type: 'Seminar' },
  { id: 4, course: 'Computer Science', instructor: 'Prof. Alice Johnson', time: '09:00 - 10:30', day: 'Wednesday', room: 'D102', type: 'Lab' },
  { id: 5, course: 'Chemistry', instructor: 'Dr. Vikram Patel', time: '15:45 - 17:15', day: 'Thursday', room: 'E205', type: 'Practical' },
]

const mockAssignments = [
  { id: 1, course: 'Mathematics', title: 'Calculus Problem Set', dueDate: '2025-02-20', submitted: true, grade: 'A' },
  { id: 2, course: 'Physics', title: 'Lab Report', dueDate: '2025-02-22', submitted: false, grade: null },
  { id: 3, course: 'English', title: 'Essay - Literature Analysis', dueDate: '2025-02-25', submitted: true, grade: 'B+' },
  { id: 4, course: 'Computer Science', title: 'Programming Assignment', dueDate: '2025-02-18', submitted: true, grade: 'A+' },
]

const mockGrades = [
  { id: 1, course: 'Mathematics', midterm: 85, final: 88, lab: 90, assignment: 92, grade: 'A' },
  { id: 2, course: 'Physics', midterm: 78, final: 82, lab: 80, assignment: 85, grade: 'B+' },
  { id: 3, course: 'English', midterm: 88, final: 85, participation: 90, assignment: 87, grade: 'A' },
  { id: 4, course: 'Computer Science', midterm: 92, final: 95, project: 98, assignment: 96, grade: 'A+' },
]

export default function Academics() {
  const { push } = useToast()
  const [activeTab, setActiveTab] = useState('schedule')
  const [schedule, setSchedule] = useState(mockSchedule)
  const [assignments, setAssignments] = useState(mockAssignments)
  const [grades, setGrades] = useState(mockGrades)

  const gpaChartData = {
    labels: ['Mathematics', 'Physics', 'English', 'Computer Science'],
    values: [88, 82, 87, 95]
  }

  const attendanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    values: [95, 92, 88, 94, 96]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Academic Center</h1>
        <div className="text-sm text-slate-500">GPA: 3.9 / 4.0</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Courses" value={schedule.length} />
        <Card title="Assignments" value={assignments.filter(a => !a.submitted).length} />
        <Card title="Completed" value={assignments.filter(a => a.submitted).length} />
        <Card title="Current GPA" value="3.9" />
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 rounded-t-lg">
        <div className="flex">
          {['schedule', 'assignments', 'grades'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card>
          <h3 className="font-semibold mb-4">Class Schedule</h3>
          <div className="space-y-3">
            {schedule.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-900">{s.course}</div>
                  <div className="text-sm text-slate-600">{s.instructor}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.day} • {s.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">{s.room}</div>
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">{s.type}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <Card>
          <h3 className="font-semibold mb-4">Assignments & Submissions</h3>
          <div className="space-y-3">
            {assignments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{a.title}</div>
                  <div className="text-sm text-slate-600">{a.course}</div>
                  <div className="text-xs text-slate-500 mt-1">Due: {a.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {a.submitted ? (
                      <>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Submitted</span>
                        {a.grade && <span className="font-semibold text-lg text-green-600">{a.grade}</span>}
                      </>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <Card>
          <h3 className="font-semibold mb-4">Course Grades</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Course</th>
                  <th className="text-center p-3 font-semibold">Midterm</th>
                  <th className="text-center p-3 font-semibold">Final</th>
                  <th className="text-center p-3 font-semibold">Assignments</th>
                  <th className="text-center p-3 font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{g.course}</td>
                    <td className="text-center p-3">{g.midterm}</td>
                    <td className="text-center p-3">{g.final}</td>
                    <td className="text-center p-3">{g.assignment}</td>
                    <td className="text-center p-3">
                      <span className="font-semibold text-lg text-blue-600">{g.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4">Grade Trend by Course</h3>
          <div className="h-64">
            <DashboardChart data={gpaChartData} />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Attendance Rate</h3>
          <div className="h-64">
            <DashboardChart data={attendanceData} />
          </div>
        </Card>
      </div>
    </div>
  )
}
