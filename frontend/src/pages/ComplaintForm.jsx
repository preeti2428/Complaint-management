import { useState } from 'react'
import { createComplaint } from '../services/complaints'
import { useAuth } from '../context/AuthContext'

const ComplaintForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'Pending',
  })
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const data = await createComplaint(form)
      setMessage(data.message || 'Complaint stored successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save complaint')
    } finally {
      setSaving(false)
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <section className="form-page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Register a complaint</h2>
            <p>Provide the details below to register your complaint.</p>
          </div>
          <span className="pill">Secure submission</span>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </label>
          <label>
            Complaint title
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleChange('title', event.target.value)}
              required
            />
          </label>
          <label>
            Category
            <input
              type="text"
              value={form.category}
              onChange={(event) => handleChange('category', event.target.value)}
              required
            />
          </label>
          <label className="full">
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              required
            />
          </label>
          <label>
            Location
            <input
              type="text"
              value={form.location}
              onChange={(event) => handleChange('location', event.target.value)}
              required
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
              disabled={!isAdmin}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
          {!isAdmin ? (
            <p className="pill">Status is set by admins after review.</p>
          ) : null}
          {message ? <p className="form-success">{message}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions full">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Submitting...' : 'Submit complaint'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ComplaintForm
