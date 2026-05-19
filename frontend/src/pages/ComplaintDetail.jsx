import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AiAnalysisPanel from '../components/AiAnalysisPanel'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'
import { analyzeComplaint } from '../services/ai'
import {
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../services/complaints'
import { useAuth } from '../context/AuthContext'

const ComplaintDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadComplaint = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getComplaintById(id)
        setComplaint(data)
        setStatus(data.status)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint')
      } finally {
        setLoading(false)
      }
    }

    loadComplaint()
  }, [id])

  const handleStatusUpdate = async () => {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const data = await updateComplaintStatus(id, status)
      setComplaint(data.complaint)
      setMessage('Status updated')
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await deleteComplaint(id)
      window.location.assign('/complaints')
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!complaint) return

    setAnalyzing(true)
    setError('')

    try {
      const data = await analyzeComplaint({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
      })
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return <Loader label="Loading complaint" />
  }

  if (!complaint) {
    return <p className="empty">Complaint not found.</p>
  }

  return (
    <section className="detail-page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>{complaint.title}</h2>
            <p>
              {complaint.category} • {complaint.location}
            </p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="detail-description">{complaint.description}</p>
        <div className="detail-meta">
          <div>
            <p className="ai-label">Reported by</p>
            <p>{complaint.name}</p>
          </div>
          <div>
            <p className="ai-label">Email</p>
            <p>{complaint.email}</p>
          </div>
        </div>

        {user?.role === 'admin' ? (
          <div className="status-update">
            <label>
              Update status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </label>
            <div className="status-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={handleStatusUpdate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save status'}
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete complaint
              </button>
            </div>
          </div>
        ) : (
          <p className="pill">Only admins can update status.</p>
        )}

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </div>
      {user?.role === 'admin' ? (
        <AiAnalysisPanel
          analysis={analysis}
          onAnalyze={handleAnalyze}
          loading={analyzing}
        />
      ) : null}
    </section>
  )
}

export default ComplaintDetail
