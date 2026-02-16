import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../components/ui/ToastContext'
import { AuthContext } from '../context/AuthContext'
import { getMessages, sendMessage, markMessageRead, getUsers } from '../services/api'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [form, setForm] = useState({ receiver_id: '', subject: '', message: '' })
  const { user } = useContext(AuthContext)
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [msgData, userData] = await Promise.all([
        getMessages({ user_id: user?.id }),
        getUsers()
      ])
      setMessages(Array.isArray(msgData) ? msgData : [])
      setUsers(Array.isArray(userData) ? userData : [])
    } catch (err) {
      toast.push('Error loading data', 'error')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await sendMessage({ ...form, sender_id: user?.id })
      toast.push('Message sent', 'success')
      setOpen(false)
      setForm({ receiver_id: '', subject: '', message: '' })
      fetchData()
    } catch (err) {
      toast.push('Error sending message', 'error')
    }
  }

  async function handleMarkRead(id) {
    try {
      await markMessageRead(id)
      fetchData()
    } catch (err) {
      toast.push('Error marking message', 'error')
    }
  }

  const unreadCount = messages.filter(m => !m.read && m.receiver_id === user?.id).length
  const sentCount = messages.filter(m => m.sender_id === user?.id).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 mt-1">Send and receive messages</p>
        </div>
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          + Compose Message
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Messages" value={messages.length} />
        <Card title="Unread" value={unreadCount} />
        <Card title="Sent" value={sentCount} />
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-slate-500">No messages found</div>
        ) : (
          messages.map(msg => (
            <Card 
              key={msg.id} 
              className={`${!msg.read && msg.receiver_id === user?.id ? 'border-l-4 border-l-blue-500' : ''} hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => { setSelectedMessage(msg); handleMarkRead(msg.id); }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-slate-500">
                      {msg.sender_id === user?.id ? `To: ${msg.receiver_name}` : `From: ${msg.sender_name}`}
                    </span>
                    {!msg.read && msg.receiver_id === user?.id && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <h3 className="font-semibold">{msg.subject}</h3>
                  <p className="text-sm text-slate-600 mt-1">{msg.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Compose Message Modal */}
      <Modal title="Compose Message" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To *</label>
            <select
              value={form.receiver_id}
              onChange={(e) => setForm({...form, receiver_id: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Recipient</option>
              {users.filter(u => u.id !== user?.id).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <input
              type="text"
              placeholder="Message subject"
              value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
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
              Send
            </button>
          </div>
        </form>
      </Modal>

      {/* View Message Modal */}
      <Modal title={selectedMessage?.subject || 'Message'} open={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>From: {selectedMessage.sender_name}</span>
              <span>{selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : ''}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
