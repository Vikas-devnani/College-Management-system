# StudentBuddy - College Management System

A modern, feature-rich React + Vite + Tailwind frontend for comprehensive college management. Built with production-ready code, role-based access control, and a beautiful, intuitive UI.

## Features

### 🎓 For Students
- **Dashboard** - Overview of grades, schedules, and announcements
- **Academics** - Class schedules, assignments, grades tracking with detailed analytics (schedule, assignments tabs, grade distribution charts)
- **Finance** - Fee structure, payment tracking, installments with visual trends and payment history
- **Courses** - Browse and manage available courses
- **Profile** - Personal and academic information

### 👨‍🏫 For Faculty  
- **Faculty Dashboard** - Overall class progress with time period filters (Today/Week/Month), stat cards, and analytics
- **Class Management** - View enrolled students panel with performance grades and status indicators (active/inactive)
- **Performance Analytics** - Class progress trends (line chart) and student performance distribution (bar chart)
- **Student Insights** - See all enrolled students with course assignments and performance metrics in table format
- **Grade Tracking** - Monitor student grades by course and performance bands

### ⚙️ For Admins
- **Admin Dashboard** - Institution-wide metrics and analytics with role distribution
- **User Management** - Create, manage, and delete users with comprehensive filtering by role, status, and join date
- **Students Management** - Full CRUD with professional dashboard layout, filters, time period selection, and classmates context panel
- **Faculty Management** - Manage faculty with enrolled students side panel, performance charts, and course assignments
- **Courses** - Manage course catalog and enrollments
- **Finance** - Oversee fee structures and payments
- **System Settings** - Configure institution details and features

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Faculty | alice@college.edu | faculty123 |
| Student | bob@student.edu | student123 |

## Production Build

### Build
```bash
npm run build
```

### Serve (Static)
```bash
npm run preview-static
# then open http://localhost:8080/
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Chart.js
- **Auth**: Context API
- **Backend**: Node.js + Express + SQLite (optional)

## Pages & Components

### Pages
- `Home.jsx` - Professional landing page with hero section, features showcase, use cases (Students/Faculty/Admin), CTA section, and footer
- `Login.jsx` - Role-based authentication with three user types
- `Dashboard.jsx` - Professional role-based dashboards:
  - **Student**: Performance trends, today's schedule, classmates side panel with grades and status
  - **Faculty**: Class performance trends, grade distribution, enrolled students side panel
  - **Admin**: Institution-wide stats (users, students, faculty, courses)
- `Academics.jsx` - Schedule, assignments, and grades with tabbed interface and performance charts
- `Finance.jsx` - Comprehensive fee management with overview, installments, and transaction history tabs
- `Courses.jsx` - Course management and enrollment
- `Faculty.jsx` - Admin management view: faculty dashboard layout with class progress charts, student performance distribution, and enrolled students side panel
- `Students.jsx` - Admin management view: professional dashboard layout with enrollment analytics, performance trends, classmates side panel, and comprehensive student table
- `AdminUsers.jsx` - User management with stats, filters, and user creation/deletion capabilities

### Components
- `Card.jsx` - Flexible container component
- `Table.jsx` - Sortable data table
- `Modal.jsx` - Dialog component
- `DashboardChart.jsx` - Chart visualization
- `ProgressList.jsx` - Progress tracking
- `Timeline.jsx` - Timeline component
- `ToastContext.jsx` - Toast notifications

## Authentication

Login page supports three roles:
- **Student** - Access to courses, schedules, grades
- **Faculty** - Access to classes, student progress
- **Admin** - Full system access

Session persists via localStorage.

## Backend Integration

The app includes an optional Express + SQLite backend for data persistence:

```bash
# Start backend (runs on port 4000)
node server/index.js
```

The frontend automatically falls back to localStorage if backend is unavailable.

## Troubleshooting

- **Blank page**: Open browser DevTools console and check for errors
- **Port already in use**: Kill the process or change port in vite.config.js
- **Module errors**: Run `npm install` again

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## File Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable UI components
├── context/         # React Context (Auth, Toast)
├── services/        # API services
├── data/            # Mock/seed data
├── routes/          # Route protection
├── utils/           # Utilities
└── main.jsx        # Entry point

server/
├── index.js         # Express backend
└── data.db          # SQLite database (generated)
```

## Deployment

### Static Deployment (Netlify, Vercel, GitHub Pages)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku, Railway, AWS)
```bash
# Deploy server/index.js with Node.js
# Set environment variables as needed
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
