import React, { useState, useEffect } from "react"
import Card from "../components/Card"
import Table from "../components/Table"
import Modal from "../components/Modal"
import { getCourses, addCourse, deleteCourse } from "../services/api"
import { useToast } from "../components/ui/ToastContext"

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", code: "", credits: 3 })
  const { push } = useToast()

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const res = await getCourses()
      if (mounted) setCourses(res)
      setLoading(false)
    }
    load()
    return () => (mounted = false)
  }, [])

  async function handleAdd() {
    if (!form.title) {
      push('Course title is required', 'error')
      return
    }
    try {
      const newCourse = await addCourse(form)
      setCourses((s) => [newCourse, ...s])
      setOpen(false)
      setForm({ title: "", code: "", credits: 3 })
      push('Course added')
    } catch (err) {
      push('Failed to add course', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete course?")) return
    try {
      await deleteCourse(id)
      setCourses((s) => s.filter((c) => c.id !== id))
      push('Course deleted')
    } catch (err) {
      push('Failed to delete course', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setOpen(true)}
        >
          Add Course
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="p-8">Loading courses...</div>
        ) : (
          <Table
            columns={["Title", "Code", "Credits", "Actions"]}
            data={courses.map((c) => [c.title, c.code, c.credits, c.id])}
            renderRow={(row) => (
              <tr key={row[3]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(row[3])}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </Card>

      <Modal title="Add Course" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-2">
          <input
            className="w-full border p-2 rounded"
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Course code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 rounded mr-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAdd}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
