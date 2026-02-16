import { studentsData as seedStudents, coursesData as seedCourses, facultyData as seedFaculty } from '../data/data'

const API_BASE = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 'http://localhost:4000'

function wait(ms=500){ return new Promise(r=> setTimeout(r, ms)) }

async function tryFetch(path, options){
  const res = await fetch(API_BASE + path, options)
  if(!res.ok) throw new Error('Bad response')
  return res.json()
}

function ensureStore(){
  if(!localStorage.getItem('cms_students')) localStorage.setItem('cms_students', JSON.stringify(seedStudents))
  if(!localStorage.getItem('cms_courses')) localStorage.setItem('cms_courses', JSON.stringify(seedCourses))
  if(!localStorage.getItem('cms_faculty')) localStorage.setItem('cms_faculty', JSON.stringify(seedFaculty))
}

export async function getStudents(opts = {}){
  try{
    const data = await tryFetch('/api/students')
    return { data, total: data.length }
  }catch(e){
    ensureStore(); await wait(200)
    const items = JSON.parse(localStorage.getItem('cms_students')||'[]')
    return { data: items, total: items.length }
  }
}

export async function addStudent(payload){
  try{ return await tryFetch('/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ ensureStore(); await wait(200); const items = JSON.parse(localStorage.getItem('cms_students')||'[]'); const id = Math.max(0, ...items.map(i=>i.id)) + 1; const nu = { id, ...payload }; items.push(nu); localStorage.setItem('cms_students', JSON.stringify(items)); return nu }
}

export async function updateStudent(id, payload){
  try{ return await tryFetch(`/api/students/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ ensureStore(); await wait(200); const items = JSON.parse(localStorage.getItem('cms_students')||'[]'); const idx = items.findIndex(i=>i.id===id); if(idx===-1) throw new Error('Not found'); items[idx] = { ...items[idx], ...payload }; localStorage.setItem('cms_students', JSON.stringify(items)); return items[idx] }
}

export async function deleteStudent(id){
  try{ await tryFetch(`/api/students/${id}`, { method:'DELETE' }); return true }
  catch(e){ ensureStore(); await wait(200); let items = JSON.parse(localStorage.getItem('cms_students')||'[]'); items = items.filter(i=> i.id !== id); localStorage.setItem('cms_students', JSON.stringify(items)); return true }
}

export async function getCourses(){
  try{ return await tryFetch('/api/courses') }
  catch(e){ ensureStore(); await wait(200); return JSON.parse(localStorage.getItem('cms_courses')||'[]') }
}

export async function addCourse(payload){
  try{ return await tryFetch('/api/courses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ ensureStore(); await wait(200); const items = JSON.parse(localStorage.getItem('cms_courses')||'[]'); const id = Math.max(0, ...items.map(i=>i.id)) + 1; const nu = { id, ...payload }; items.push(nu); localStorage.setItem('cms_courses', JSON.stringify(items)); return nu }
}

export async function deleteCourse(id){
  try{ await tryFetch(`/api/courses/${id}`, { method:'DELETE' }); return true }
  catch(e){ ensureStore(); await wait(200); let items = JSON.parse(localStorage.getItem('cms_courses')||'[]'); items = items.filter(i=> i.id !== id); localStorage.setItem('cms_courses', JSON.stringify(items)); return true }
}

export async function getFaculty(){
  try{ return await tryFetch('/api/faculty') }
  catch(e){ ensureStore(); await wait(200); return JSON.parse(localStorage.getItem('cms_faculty')||'[]') }
}

export async function addFaculty(payload){
  try{ return await tryFetch('/api/faculty', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ ensureStore(); await wait(200); const items = JSON.parse(localStorage.getItem('cms_faculty')||'[]'); const id = Math.max(0, ...items.map(i=>i.id)) + 1; const nu = { id, ...payload }; items.push(nu); localStorage.setItem('cms_faculty', JSON.stringify(items)); return nu }
}

export async function deleteFaculty(id){
  try{ await tryFetch(`/api/faculty/${id}`, { method:'DELETE' }); return true }
  catch(e){ ensureStore(); await wait(200); let items = JSON.parse(localStorage.getItem('cms_faculty')||'[]'); items = items.filter(i=> i.id !== id); localStorage.setItem('cms_faculty', JSON.stringify(items)); return true }
}

// Users (for Admin Management)
export async function getUsers(opts = {}){
  try{ return await tryFetch('/api/users') }
  catch(e){ 
    ensureStore(); await wait(200)
    const users = JSON.parse(localStorage.getItem('cms_users')||'[]')
    return users
  }
}

export async function addUser(payload){
  try{ return await tryFetch('/api/users', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ ensureStore(); await wait(200); const users = JSON.parse(localStorage.getItem('cms_users')||'[]'); const id = Math.max(0, ...users.map(i=>i.id)) + 1; const nu = { id, ...payload }; users.push(nu); localStorage.setItem('cms_users', JSON.stringify(users)); return nu }
}

export async function deleteUser(id){
  try{ await tryFetch(`/api/users/${id}`, { method:'DELETE' }); return true }
  catch(e){ ensureStore(); await wait(200); let users = JSON.parse(localStorage.getItem('cms_users')||'[]'); users = users.filter(i=> i.id !== id); localStorage.setItem('cms_users', JSON.stringify(users)); return true }
}

// Attendance
export async function getAttendance(opts = {}){
  const { student_id, course_id, date } = opts
  let query = '/api/attendance?'
  if(student_id) query += `student_id=${student_id}&`
  if(course_id) query += `course_id=${course_id}&`
  if(date) query += `date=${date}&`
  try{ return await tryFetch(query) }
  catch(e){ return [] }
}

export async function addAttendance(payload){
  try{ return await tryFetch('/api/attendance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload } }
}

export async function updateAttendance(id, payload){
  try{ return await tryFetch(`/api/attendance/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ return { id, ...payload } }
}

// Assignments
export async function getAssignments(opts = {}){
  const { course_id } = opts
  try{ return await tryFetch(`/api/assignments${course_id ? `?course_id=${course_id}` : ''}`) }
  catch(e){ return [] }
}

export async function addAssignment(payload){
  try{ return await tryFetch('/api/assignments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload } }
}

export async function deleteAssignment(id){
  try{ await tryFetch(`/api/assignments/${id}`, { method:'DELETE' }); return true }
  catch(e){ return true }
}

// Exams
export async function getExams(opts = {}){
  const { course_id } = opts
  try{ return await tryFetch(`/api/exams${course_id ? `?course_id=${course_id}` : ''}`) }
  catch(e){ return [] }
}

export async function addExam(payload){
  try{ return await tryFetch('/api/exams', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload } }
}

export async function deleteExam(id){
  try{ await tryFetch(`/api/exams/${id}`, { method:'DELETE' }); return true }
  catch(e){ return true }
}

// Grades
export async function getGrades(opts = {}){
  const { student_id, exam_id } = opts
  let query = '/api/grades?'
  if(student_id) query += `student_id=${student_id}&`
  if(exam_id) query += `exam_id=${exam_id}&`
  try{ return await tryFetch(query) }
  catch(e){ return [] }
}

export async function addGrade(payload){
  try{ return await tryFetch('/api/grades', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload } }
}

export async function updateGrade(id, payload){
  try{ return await tryFetch(`/api/grades/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ return { id, ...payload } }
}

// Notifications
export async function getNotifications(opts = {}){
  const { user_id, unread } = opts
  let query = '/api/notifications?'
  if(user_id) query += `user_id=${user_id}&`
  if(unread) query += `unread=true&`
  try{ return await tryFetch(query) }
  catch(e){ return [] }
}

export async function addNotification(payload){
  try{ return await tryFetch('/api/notifications', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload, read: 0, created_at: new Date().toISOString() } }
}

export async function markNotificationRead(id){
  try{ await tryFetch(`/api/notifications/${id}/read`, { method:'PUT' }); return true }
  catch(e){ return true }
}

// Messages
export async function getMessages(opts = {}){
  const { user_id } = opts
  try{ return await tryFetch(`/api/messages${user_id ? `?user_id=${user_id}` : ''}`) }
  catch(e){ return [] }
}

export async function sendMessage(payload){
  try{ return await tryFetch('/api/messages', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }) }
  catch(e){ const id = Math.floor(Math.random()*10000); return { id, ...payload, read: 0, created_at: new Date().toISOString() } }
}

export async function markMessageRead(id){
  try{ await tryFetch(`/api/messages/${id}/read`, { method:'PUT' }); return true }
  catch(e){ return true }
}

export default { 
  getStudents, addStudent, updateStudent, deleteStudent, 
  getCourses, addCourse, deleteCourse, 
  getFaculty, addFaculty, deleteFaculty,
  getUsers, addUser, deleteUser,
  getAttendance, addAttendance, updateAttendance,
  getAssignments, addAssignment, deleteAssignment,
  getExams, addExam, deleteExam,
  getGrades, addGrade, updateGrade,
  getNotifications, addNotification, markNotificationRead,
  getMessages, sendMessage, markMessageRead
}
