import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const [showRoles, setShowRoles] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [showAdmin, setShowAdmin] = useState(false)
  const navigate = useNavigate()

  // Disabled auto-redirect so user can see the Home landing page
  // useEffect(() => {
  //   try {
  //     const session = localStorage.getItem('cms_session')
  //     if (session) navigate('/dashboard')
  //   } catch (e) { }
  // }, [navigate])

  function revealAdmin(){
    const next = logoClicks + 1
    setLogoClicks(next)
    if(next >= 6) setShowAdmin(true)
  }

  function goLogin(role){
    navigate(`/login?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div onClick={revealAdmin} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg">CE</div>
            <div className="font-bold text-xl text-slate-900">StudentBuddy</div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={()=> goLogin('student')} className="px-4 py-2 text-slate-700 hover:text-slate-900">For Students</button>
            <button onClick={()=> goLogin('faculty')} className="px-4 py-2 text-slate-700 hover:text-slate-900">For Faculty</button>
            <button onClick={()=> goLogin('admin')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-extrabold leading-tight text-slate-900 mb-6">
                Manage Your College Effortlessly
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A modern, secure platform designed for students, faculty, and administrators. Streamline admissions, track attendance, manage courses, and connect with your academic community.
              </p>
              <div className="flex gap-4">
                <button onClick={()=> goLogin('student')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg">
                  Get Started
                </button>
                <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-slate-400">
                  Explore Features
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="font-semibold text-slate-900">Courses</div>
                  <div className="text-sm text-slate-500">Access all course materials</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="font-semibold text-slate-900">Students</div>
                  <div className="text-sm text-slate-500">Manage student profiles</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="font-semibold text-slate-900">Faculty</div>
                  <div className="text-sm text-slate-500">Track faculty assignments</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="font-semibold text-slate-900">Finance</div>
                  <div className="text-sm text-slate-500">Manage payments & fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-4">Why Choose StudentBuddy?</h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Built for modern education with powerful features for the entire academic ecosystem
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Secure & Private', desc: 'Enterprise-grade security with role-based access control' },
              { title: 'Analytics', desc: 'Track progress with real-time dashboards and reports' },
              { title: 'Fast & Reliable', desc: 'Lightning-quick performance on any device' },
              { title: 'Smart Notifications', desc: 'Stay updated with timely alerts and reminders' },
              { title: 'Mobile Ready', desc: 'Access from desktop, tablet, or smartphone' },
              { title: 'Scalable', desc: 'Grows with your institution' }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">Built for Everyone</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students */}
            <div className="bg-white rounded-xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">For Students</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> View enrolled courses & schedules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Track grades & progress
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Submit assignments online
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Connect with peers
                </li>
              </ul>
            </div>

            {/* Faculty */}
            <div className="bg-white rounded-xl p-8 border-2 border-purple-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">For Faculty</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Manage classes & attendance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Grade assignments & exams
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> View class analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Communicate with students
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="bg-white rounded-xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">For Administrators</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Manage all users & roles
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Monitor institution metrics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Configure system settings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Generate reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Transform Your College?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of institutions using StudentBuddy. Start your free trial today.
          </p>
          <button onClick={()=> goLogin('admin')} className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 text-lg shadow-lg">
            Sign In Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-white text-lg mb-2">GROUP09D9</p>
          <p className="text-sm text-slate-400">Team: Sneha Jain, Soumya Barve, Sumit Pawar, Vikas Devnani, Vikas Dhakad</p>
        </div>
      </footer>
    </div>
  )
}
