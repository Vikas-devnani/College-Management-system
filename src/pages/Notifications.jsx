import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { AuthContext } from '../context/AuthContext'
import { getNotifications, addNotification, markNotificationRead, getUsers } from '../services/api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ user_id: '', title: '', message: '', type: 'info' })
  const { user } = useContext(AuthContext)
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const notifData = await getNotifications({ user_id: user?.id })
      const userData = await getUsers()
      setNotifications(Array.isArray(notifData) ? notifData : [])
      setUsers(Array.isArray(userData) ? userData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addNotification(form)
      toast.push('Notification sent', 'success')
      setOpen(false)
      setForm({ user_id: '', title: '', message: '', type: 'info' })
      fetchData()
    } catch (err) {
      toast.push('Error sending notification', 'error')
    }
  }

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id)
      fetchData()
    } catch (err) {
      toast.push('Error marking notification', 'error')
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">View and manage notifications</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Send Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Notifications" value={notifications.length} />
        <Card title="Unread" value={unreadCount} />
        <Card title="Read" value={notifications.length - unreadCount} />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No notifications found</div>
        ) : (
          notifications.map(notification => (
            <Card 
              key={notification.id} 
              className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => handleMarkRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {notification.created_at ? new Date(notification.created_at).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Send Notification Modal */}
      <Modal title="Send Notification" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient *</label>
            <select
              value={form.user_id}
              onChange={(e) => setForm({...form, user_id: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              placeholder="Notification title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              placeholder="Notification message"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
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
              Send
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
