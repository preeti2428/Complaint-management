import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="panel auth-panel">
        <h2>Welcome back</h2>
        <p>Sign in to manage and track complaints.</p>
        <form onSubmit={handleSubmit} className="form-grid">
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
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="auth-helper">
          New here? <a href="/register">Create an account</a>
        </p>
      </div>
    </section>
  )
}

export default Login
