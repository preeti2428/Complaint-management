import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    adminCode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = { ...form }
      if (payload.role !== 'admin') {
        delete payload.adminCode
      }
      await register(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="panel auth-panel">
        <h2>Create your account</h2>
        <p>Register to submit and track complaints.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Full name
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
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              required
            />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => handleChange('role', event.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {form.role === 'admin' ? (
            <label>
              Admin registration code
              <input
                type="password"
                value={form.adminCode}
                onChange={(event) =>
                  handleChange('adminCode', event.target.value)
                }
                placeholder="Enter admin code"
                required
              />
            </label>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Register
