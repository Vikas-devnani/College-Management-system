const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const Database = require('better-sqlite3')

const app = express()
app.use(cors())
app.use(express.json())

const DB_FILE = path.join(__dirname, 'data.db')
const db = new Database(DB_FILE)

function ensureTables(){
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT);
    CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, email TEXT, course TEXT, year TEXT);
    CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, title TEXT, code TEXT, credits INTEGER);
    CREATE TABLE IF NOT EXISTS faculty (id INTEGER PRIMARY KEY, name TEXT, department TEXT, email TEXT);
    CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY, activity TEXT, time TEXT);
    CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY, student_id INTEGER, course_id INTEGER, date TEXT, status TEXT);
    CREATE TABLE IF NOT EXISTS assignments (id INTEGER PRIMARY KEY, title TEXT, description TEXT, course_id INTEGER, due_date TEXT, created_by INTEGER);
    CREATE TABLE IF NOT EXISTS exams (id INTEGER PRIMARY KEY, title TEXT, course_id INTEGER, date TEXT, duration INTEGER, total_marks INTEGER);
    CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY, student_id INTEGER, exam_id INTEGER, marks REAL, grade TEXT);
    CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, message TEXT, type TEXT, read INTEGER DEFAULT 0, created_at TEXT);
    CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, sender_id INTEGER, receiver_id INTEGER, subject TEXT, message TEXT, read INTEGER DEFAULT 0, created_at TEXT);
  `)

  const users = db.prepare('SELECT COUNT(*) as c FROM users').get().c
  if(users === 0){
    const insert = db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)')
    insert.run('Super Admin','admin@college.edu','admin123','admin')
    insert.run('Prof. Alice','alice@college.edu','faculty123','faculty')
    insert.run('Bob Student','bob@student.edu','student123','student')
  }

  const courses = db.prepare('SELECT COUNT(*) as c FROM courses').get().c
  if(courses === 0){
    const insertCourse = db.prepare('INSERT INTO courses (title,code,credits) VALUES (?,?,?)')
    insertCourse.run('Mathematics','MATH101',4)
    insertCourse.run('Physics','PHYS101',4)
    insertCourse.run('English','ENG101',3)
    insertCourse.run('Economics','ECON101',3)
    insertCourse.run('History','HIST101',3)
    insertCourse.run('Chemistry','CHEM101',4)
  }

  const students = db.prepare('SELECT COUNT(*) as c FROM students').get().c
  if(students === 0){
    const insertStudent = db.prepare('INSERT INTO students (name,email,course,year) VALUES (?,?,?,?)')
    insertStudent.run('Aarav Sharma','aarav@student.edu','Computer Science','2nd Year')
    insertStudent.run('Priya Patel','priya@student.edu','Electronics','1st Year')
    insertStudent.run('Amit Kumar','amit@student.edu','Mechanical','3rd Year')
    insertStudent.run('Neha Gupta','neha@student.edu','Computer Science','2nd Year')
    insertStudent.run('Rohan Singh','rohan@student.edu','Civil','2nd Year')
  }

  const faculty = db.prepare('SELECT COUNT(*) as c FROM faculty').get().c
  if(faculty === 0){
    const insertFaculty = db.prepare('INSERT INTO faculty (name,department,email) VALUES (?,?,?)')
    insertFaculty.run('Prof. Alice Johnson','Computer Science','alice@college.edu')
    insertFaculty.run('Dr. Rajesh Kumar','Mathematics','rajesh@college.edu')
    insertFaculty.run('Prof. Sarah Lee','Physics','sarah@college.edu')
    insertFaculty.run('Dr. Vikram Patel','Electronics','vikram@college.edu')
    insertFaculty.run('Prof. Ananya Singh','Chemistry','ananya@college.edu')
  }

  // Seed Attendance
  const attendance = db.prepare('SELECT COUNT(*) as c FROM attendance').get().c
  if(attendance === 0){
    const insertAttendance = db.prepare('INSERT INTO attendance (student_id, course_id, date, status) VALUES (?,?,?,?)')
    insertAttendance.run(1, 1, '2024-01-15', 'present')
    insertAttendance.run(2, 1, '2024-01-15', 'present')
    insertAttendance.run(3, 1, '2024-01-15', 'present')
    insertAttendance.run(4, 1, '2024-01-15', 'present')
    insertAttendance.run(5, 1, '2024-01-15', 'present')
  }

  // Seed Assignments
  const assignments = db.prepare('SELECT COUNT(*) as c FROM assignments').get().c
  if(assignments === 0){
    const insertAssignment = db.prepare('INSERT INTO assignments (title, description, course_id, due_date, created_by) VALUES (?,?,?,?,?)')
    insertAssignment.run('Math Homework 1', 'Complete exercises 1-10 from Chapter 3', 1, '2024-02-01', 1)
    insertAssignment.run('Physics Lab Report', 'Write a lab report on the pendulum experiment', 2, '2024-02-05', 2)
    insertAssignment.run('English Essay', 'Write an essay on Shakespeare', 3, '2024-02-10', 1)
    insertAssignment.run('Economics Project', 'Create a presentation on supply and demand', 4, '2024-02-15', 2)
    insertAssignment.run('History Presentation', 'Prepare a presentation on World War II', 5, '2024-02-20', 1)
  }

  // Seed Exams
  const exams = db.prepare('SELECT COUNT(*) as c FROM exams').get().c
  if(exams === 0){
    const insertExam = db.prepare('INSERT INTO exams (title, course_id, date, duration, total_marks) VALUES (?,?,?,?,?)')
    insertExam.run('Math Midterm', 1, '2024-03-01', 120, 100)
    insertExam.run('Physics Midterm', 2, '2024-03-05', 90, 100)
    insertExam.run('English Midterm', 3, '2024-03-10', 60, 50)
    insertExam.run('Economics Midterm', 4, '2024-03-15', 90, 100)
    insertExam.run('History Midterm', 5, '2024-03-20', 60, 50)
  }

  // Seed Grades
  const grades = db.prepare('SELECT COUNT(*) as c FROM grades').get().c
  if(grades === 0){
    const insertGrade = db.prepare('INSERT INTO grades (student_id, exam_id, marks, grade) VALUES (?,?,?,?)')
    insertGrade.run(1, 1, 85, 'A')
    insertGrade.run(2, 1, 92, 'A+')
    insertGrade.run(3, 1, 78, 'B+')
    insertGrade.run(4, 1, 88, 'A')
    insertGrade.run(5, 1, 75, 'B')
    insertGrade.run(1, 2, 90, 'A+')
    insertGrade.run(2, 2, 82, 'A')
    insertGrade.run(3, 2, 70, 'B')
    insertGrade.run(4, 2, 85, 'A')
    insertGrade.run(5, 2, 68, 'C+')
  }

  // Seed Notifications
  const notifications = db.prepare('SELECT COUNT(*) as c FROM notifications').get().c
  if(notifications === 0){
    const insertNotification = db.prepare('INSERT INTO notifications (user_id, title, message, type, read, created_at) VALUES (?,?,?,?,?,?)')
    insertNotification.run(1, 'Welcome', 'Welcome to College Management System!', 'info', 0, '2024-01-01T10:00:00Z')
    insertNotification.run(2, 'Assignment Due', 'Math Homework 1 is due soon', 'warning', 0, '2024-01-20T10:00:00Z')
    insertNotification.run(3, 'Exam Schedule', 'Midterm exams have been scheduled', 'info', 0, '2024-02-01T10:00:00Z')
    insertNotification.run(1, 'New Student', 'A new student has registered', 'success', 1, '2024-01-15T10:00:00Z')
    insertNotification.run(2, 'Grade Posted', 'Your grades have been posted', 'info', 0, '2024-03-01T10:00:00Z')
  }

  // Seed Messages
  const messages = db.prepare('SELECT COUNT(*) as c FROM messages').get().c
  if(messages === 0){
    const insertMessage = db.prepare('INSERT INTO messages (sender_id, receiver_id, subject, message, read, created_at) VALUES (?,?,?,?,?,?)')
    insertMessage.run(1, 2, 'Question about assignment', 'Can you please clarify the assignment requirements?', 0, '2024-01-25T10:00:00Z')
    insertMessage.run(2, 1, 'Re: Question about assignment', 'Sure, I have clarified the requirements.', 0, '2024-01-25T11:00:00Z')
    insertMessage.run(1, 3, 'Exam Query', 'When will the midterm exams be scheduled?', 0, '2024-02-01T10:00:00Z')
    insertMessage.run(3, 1, 'Re: Exam Query', 'The exams will be scheduled for next month.', 1, '2024-02-01T11:00:00Z')
    insertMessage.run(2, 1, 'Student Progress', 'I wanted to discuss a student progress report', 0, '2024-03-01T10:00:00Z')
  }
}

ensureTables()

// Auth
app.post('/auth/login', (req, res)=>{
  const { email, password } = req.body
  const user = db.prepare('SELECT id,name,email,role FROM users WHERE email=? AND password=?').get(email,password)
  if(!user) return res.status(401).json({ error: 'Invalid credentials' })
  res.json(user)
})

// Users (admin)
app.get('/api/users', (req,res)=>{
  const rows = db.prepare('SELECT id,name,email,role FROM users').all()
  res.json(rows)
})
app.post('/api/users', (req,res)=>{
  const { name,email,password,role } = req.body
  try{
    const info = db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)').run(name,email,password,role)
    res.json({ id: info.lastInsertRowid, name,email,role })
  }catch(e){ res.status(400).json({ error: e.message }) }
})

// Students
app.get('/api/students', (req,res)=>{
  const rows = db.prepare('SELECT * FROM students ORDER BY id DESC').all()
  res.json(rows)
})
app.post('/api/students', (req,res)=>{
  const { name,email,course,year } = req.body
  const info = db.prepare('INSERT INTO students (name,email,course,year) VALUES (?,?,?,?)').run(name,email,course,year)
  res.json({ id: info.lastInsertRowid, name,email,course,year })
})
app.put('/api/students/:id', (req,res)=>{
  const id = Number(req.params.id)
  const { name,email,course,year } = req.body
  db.prepare('UPDATE students SET name=?,email=?,course=?,year=? WHERE id=?').run(name,email,course,year,id)
  res.json({ id, name,email,course,year })
})
app.delete('/api/students/:id', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('DELETE FROM students WHERE id=?').run(id)
  res.json({ ok:true })
})

// Courses
app.get('/api/courses', (req,res)=>{
  const rows = db.prepare('SELECT * FROM courses ORDER BY id DESC').all()
  res.json(rows)
})
app.post('/api/courses', (req,res)=>{
  const { title,code,credits } = req.body
  const info = db.prepare('INSERT INTO courses (title,code,credits) VALUES (?,?,?)').run(title,code,credits)
  res.json({ id: info.lastInsertRowid, title,code,credits })
})
app.delete('/api/courses/:id', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('DELETE FROM courses WHERE id=?').run(id)
  res.json({ ok:true })
})

// Faculty
app.get('/api/faculty', (req,res)=>{
  const rows = db.prepare('SELECT * FROM faculty ORDER BY id DESC').all()
  res.json(rows)
})
app.post('/api/faculty', (req,res)=>{
  const { name,department,email } = req.body
  const info = db.prepare('INSERT INTO faculty (name,department,email) VALUES (?,?,?)').run(name,department,email)
  res.json({ id: info.lastInsertRowid, name,department,email })
})
app.delete('/api/faculty/:id', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('DELETE FROM faculty WHERE id=?').run(id)
  res.json({ ok:true })
})

// Activities
app.get('/api/activities', (req,res)=>{
  const rows = db.prepare('SELECT * FROM activities ORDER BY id DESC').all()
  res.json(rows)
})

// Attendance
app.get('/api/attendance', (req,res)=>{
  const { student_id, course_id, date } = req.query
  let query = 'SELECT a.*, s.name as student_name, c.title as course_title FROM attendance a LEFT JOIN students s ON a.student_id = s.id LEFT JOIN courses c ON a.course_id = c.id'
  const conditions = []
  const params = []
  if(student_id){ conditions.push('a.student_id = ?'); params.push(student_id) }
  if(course_id){ conditions.push('a.course_id = ?'); params.push(course_id) }
  if(date){ conditions.push('a.date = ?'); params.push(date) }
  if(conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ')
  query += ' ORDER BY a.id DESC'
  const rows = db.prepare(query).all(...params)
  res.json(rows)
})
app.post('/api/attendance', (req,res)=>{
  const { student_id, course_id, date, status } = req.body
  const info = db.prepare('INSERT INTO attendance (student_id, course_id, date, status) VALUES (?,?,?,?)').run(student_id, course_id, date, status)
  res.json({ id: info.lastInsertRowid, student_id, course_id, date, status })
})
app.put('/api/attendance/:id', (req,res)=>{
  const id = Number(req.params.id)
  const { student_id, course_id, date, status } = req.body
  db.prepare('UPDATE attendance SET student_id=?, course_id=?, date=?, status=? WHERE id=?').run(student_id, course_id, date, status, id)
  res.json({ id, student_id, course_id, date, status })
})

// Assignments
app.get('/api/assignments', (req,res)=>{
  const { course_id } = req.query
  let query = 'SELECT a.*, c.title as course_title, u.name as creator_name FROM assignments a LEFT JOIN courses c ON a.course_id = c.id LEFT JOIN users u ON a.created_by = u.id'
  if(course_id){ query += ' WHERE a.course_id = ?'; const rows = db.prepare(query).all(course_id); return res.json(rows) }
  query += ' ORDER BY a.id DESC'
  const rows = db.prepare(query).all()
  res.json(rows)
})
app.post('/api/assignments', (req,res)=>{
  const { title, description, course_id, due_date, created_by } = req.body
  const info = db.prepare('INSERT INTO assignments (title, description, course_id, due_date, created_by) VALUES (?,?,?,?,?)').run(title, description, course_id, due_date, created_by)
  res.json({ id: info.lastInsertRowid, title, description, course_id, due_date, created_by })
})
app.delete('/api/assignments/:id', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('DELETE FROM assignments WHERE id=?').run(id)
  res.json({ ok:true })
})

// Exams
app.get('/api/exams', (req,res)=>{
  const { course_id } = req.query
  let query = 'SELECT e.*, c.title as course_title FROM exams e LEFT JOIN courses c ON e.course_id = c.id'
  if(course_id){ query += ' WHERE e.course_id = ?'; const rows = db.prepare(query).all(course_id); return res.json(rows) }
  query += ' ORDER BY e.id DESC'
  const rows = db.prepare(query).all()
  res.json(rows)
})
app.post('/api/exams', (req,res)=>{
  const { title, course_id, date, duration, total_marks } = req.body
  const info = db.prepare('INSERT INTO exams (title, course_id, date, duration, total_marks) VALUES (?,?,?,?,?)').run(title, course_id, date, duration, total_marks)
  res.json({ id: info.lastInsertRowid, title, course_id, date, duration, total_marks })
})
app.delete('/api/exams/:id', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('DELETE FROM exams WHERE id=?').run(id)
  res.json({ ok:true })
})

// Grades
app.get('/api/grades', (req,res)=>{
  const { student_id, exam_id } = req.query
  let query = 'SELECT g.*, s.name as student_name, e.title as exam_title FROM grades g LEFT JOIN students s ON g.student_id = s.id LEFT JOIN exams e ON g.exam_id = e.id'
  const conditions = []
  const params = []
  if(student_id){ conditions.push('g.student_id = ?'); params.push(student_id) }
  if(exam_id){ conditions.push('g.exam_id = ?'); params.push(exam_id) }
  if(conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ')
  query += ' ORDER BY g.id DESC'
  const rows = db.prepare(query).all(...params)
  res.json(rows)
})
app.post('/api/grades', (req,res)=>{
  const { student_id, exam_id, marks, grade } = req.body
  const info = db.prepare('INSERT INTO grades (student_id, exam_id, marks, grade) VALUES (?,?,?,?)').run(student_id, exam_id, marks, grade)
  res.json({ id: info.lastInsertRowid, student_id, exam_id, marks, grade })
})
app.put('/api/grades/:id', (req,res)=>{
  const id = Number(req.params.id)
  const { student_id, exam_id, marks, grade } = req.body
  db.prepare('UPDATE grades SET student_id=?, exam_id=?, marks=?, grade=? WHERE id=?').run(student_id, exam_id, marks, grade, id)
  res.json({ id, student_id, exam_id, marks, grade })
})

// Notifications
app.get('/api/notifications', (req,res)=>{
  const { user_id, unread } = req.query
  let query = 'SELECT * FROM notifications'
  const conditions = []
  const params = []
  if(user_id){ conditions.push('user_id = ?'); params.push(user_id) }
  if(unread === 'true'){ conditions.push('read = 0') }
  if(conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ')
  query += ' ORDER BY id DESC'
  const rows = db.prepare(query).all(...params)
  res.json(rows)
})
app.post('/api/notifications', (req,res)=>{
  const { user_id, title, message, type } = req.body
  const created_at = new Date().toISOString()
  const info = db.prepare('INSERT INTO notifications (user_id, title, message, type, created_at) VALUES (?,?,?,?,?)').run(user_id, title, message, type, created_at)
  res.json({ id: info.lastInsertRowid, user_id, title, message, type, created_at })
})
app.put('/api/notifications/:id/read', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id)
  res.json({ ok: true })
})

// Messages
app.get('/api/messages', (req,res)=>{
  const { user_id } = req.query
  let query = 'SELECT m.*, sender.name as sender_name, receiver.name as receiver_name FROM messages m LEFT JOIN users sender ON m.sender_id = sender.id LEFT JOIN users receiver ON m.receiver_id = receiver.id'
  const conditions = []
  const params = []
  if(user_id){ conditions.push('(m.sender_id = ? OR m.receiver_id = ?)'); params.push(user_id, user_id) }
  if(conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ')
  query += ' ORDER BY m.id DESC'
  const rows = db.prepare(query).all(...params)
  res.json(rows)
})
app.post('/api/messages', (req,res)=>{
  const { sender_id, receiver_id, subject, message } = req.body
  const created_at = new Date().toISOString()
  const info = db.prepare('INSERT INTO messages (sender_id, receiver_id, subject, message, created_at) VALUES (?,?,?,?,?)').run(sender_id, receiver_id, subject, message, created_at)
  res.json({ id: info.lastInsertRowid, sender_id, receiver_id, subject, message, created_at })
})
app.put('/api/messages/:id/read', (req,res)=>{
  const id = Number(req.params.id)
  db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(id)
  res.json({ ok: true })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('API server running on', PORT))
