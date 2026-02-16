import React, { useContext } from 'react'
import Card from '../components/Card'
import DashboardChart from '../components/DashboardChart'
import { AuthContext } from '../context/AuthContext'

const mockClassmates = [
  { id: 1, name: 'Sita Bhattarai', course: 'CS101', performance: 'A+', status: 'active' },
  { id: 2, name: 'Rishab Khatri', course: 'CS101', performance: 'A', status: 'active' },
  { id: 3, name: 'Rista KC', course: 'CS101', performance: 'B+', status: 'active' },
  { id: 4, name: 'Yadav Kattel', course: 'CS101', performance: 'B', status: 'inactive' },
  { id: 5, name: 'Priya Sharma', course: 'CS101', performance: 'A', status: 'active' },
  { id: 6, name: 'Arjun Singh', course: 'CS101', performance: 'B+', status: 'active' },
]

const mockStudents = [
  { id: 1, name: 'Aarav Sharma', course: 'CS101', performance: 'A', status: 'active' },
  { id: 2, name: 'Neha Gupta', course: 'CS101', performance: 'A+', status: 'active' },
  { id: 3, name: 'Rohan Singh', course: 'CS101', performance: 'B+', status: 'active' },
  { id: 4, name: 'Priya Patel', course: 'CS101', performance: 'A', status: 'inactive' },
  { id: 5, name: 'Amit Kumar', course: 'CS101', performance: 'B', status: 'active' },
  { id: 6, name: 'Sneha Verma', course: 'CS101', performance: 'A', status: 'active' },
]

export default function Dashboard() {
  const auth = useContext(AuthContext)
  const isStudent = auth?.user?.role === 'student'
  const isFaculty = auth?.user?.role === 'faculty'

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    values: [65, 72, 68, 78, 85]
  }

  const performanceDistribution = {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C'],
    values: [8, 15, 12, 10, 6, 3]
  }

  // For Student Dashboard
  if (isStudent) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's your academic overview</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="GPA" value="3.8" />
            <Card title="Courses" value="5" />
            <Card title="Assignments" value="12" />
            <Card title="Attendance" value="94%" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Your Performance Trend</h2>
              <DashboardChart
                type="line"
                labels={performanceData.labels}
                data={performanceData.values}
                label="Score"
                height={300}
              />
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {[
                  { time: '09:00 AM', subject: 'Data Structures', room: 'Room 101', instructor: 'Dr. Smith' },
                  { time: '11:00 AM', subject: 'Web Development', room: 'Lab 5', instructor: 'Prof. Johnson' },
                  { time: '02:00 PM', subject: 'Database Design', room: 'Room 205', instructor: 'Dr. Williams' },
                ].map((cls, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div>
                      <p className="font-semibold text-slate-900">{cls.subject}</p>
                      <p className="text-xs text-slate-500">{cls.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{cls.time}</p>
                      <p className="text-xs text-slate-500">{cls.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Classmates Panel - Right Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Classmates</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockClassmates.map(mate => (
                <div key={mate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {mate.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{mate.name}</p>
                      <p className="text-xs text-slate-500 truncate">{mate.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      mate.performance.startsWith('A')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {mate.performance}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      mate.status === 'active' ? 'bg-green-500' : 'bg-slate-300'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For Faculty Dashboard
  if (isFaculty) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
              <p className="text-slate-600 mt-1">Overview of your classes and student progress</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Total Students" value="28" />
            <Card title="Active Classes" value="4" />
            <Card title="Avg Performance" value="3.6" />
            <Card title="Attendance Rate" value="92%" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Performance Trend */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Class Performance Trend</h2>
              <DashboardChart
                type="line"
                labels={performanceData.labels}
                data={performanceData.values}
                label="Avg Score"
                height={300}
              />
            </div>

            {/* Student Performance Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Grade Distribution</h2>
              <DashboardChart
                type="bar"
                labels={performanceDistribution.labels}
                data={performanceDistribution.values}
                label="Count"
                height={300}
              />
            </div>
          </div>

          {/* Students Panel - Right Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Students</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate">{student.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      student.performance.startsWith('A')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.performance}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      student.status === 'active' ? 'bg-green-500' : 'bg-slate-300'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default/Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Users" value="156" />
          <Card title="Students" value="98" />
          <Card title="Faculty" value="24" />
          <Card title="Courses" value="34" />
        </div>
      </div>
    </div>
  )
}
