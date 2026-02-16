import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/ToastContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './routes/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

const Dashboard = lazy(()=> import('./pages/Dashboard'))
const Students = lazy(()=> import('./pages/Students'))
const Courses = lazy(()=> import('./pages/Courses'))
const Faculty = lazy(()=> import('./pages/Faculty'))
const Finance = lazy(()=> import('./pages/Finance'))
const Academics = lazy(()=> import('./pages/Academics'))
const AdminUsers = lazy(()=> import('./pages/AdminUsers'))
const Attendance = lazy(()=> import('./pages/Attendance'))
const Assignments = lazy(()=> import('./pages/Assignments'))
const Exams = lazy(()=> import('./pages/Exams'))
const Grades = lazy(()=> import('./pages/Grades'))
const Notifications = lazy(()=> import('./pages/Notifications'))
const Messages = lazy(()=> import('./pages/Messages'))

export default function App(){
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<div className="p-8 flex items-center justify-center">Loading app...</div>}>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute roles={["admin"]}><Layout><Students/></Layout></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Courses/></Layout></ProtectedRoute>} />
              <Route path="/faculty" element={<ProtectedRoute roles={["admin"]}><Layout><Faculty/></Layout></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute roles={["admin"]}><Layout><Finance/></Layout></ProtectedRoute>} />
              <Route path="/academics" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Academics/></Layout></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><Layout><AdminUsers/></Layout></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Attendance/></Layout></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Assignments/></Layout></ProtectedRoute>} />
              <Route path="/exams" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Exams/></Layout></ProtectedRoute>} />
              <Route path="/grades" element={<ProtectedRoute roles={["admin","faculty"]}><Layout><Grades/></Layout></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications/></Layout></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Layout><Messages/></Layout></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
