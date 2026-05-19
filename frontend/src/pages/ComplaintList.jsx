import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ComplaintCard from '../components/ComplaintCard'
import FilterBar from '../components/FilterBar'
import Loader from '../components/Loader'
import { getComplaints, searchComplaintsByLocation } from '../services/complaints'
import { triageComplaints } from '../services/ai'
import { useAuth } from '../context/AuthContext'

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [triage, setTriage] = useState([])
  const [triaging, setTriaging] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const loadComplaints = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const data = await getComplaints(params)
      setComplaints(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = async () => {
    if (filters.location.trim()) {
      setLoading(true)
      try {
        const data = await searchComplaintsByLocation(filters.location)
        setComplaints(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Search failed')
      } finally {
        setLoading(false)
      }
      return
    }

    loadComplaints({ category: filters.category, status: filters.status })
  }

  const handleTriage = async () => {
    setTriaging(true)
    setError('')
    try {
      const data = await triageComplaints({
        filters: { ...filters },
      })
      setTriage(data.analysis || [])
    } catch (err) {
      setError(err.response?.data?.message || 'AI triage failed')
    } finally {
      setTriaging(false)
    }
  }

  return (
    <section className="list-page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>{user?.role === 'admin' ? 'All complaints' : 'My complaints'}</h2>
            <p>Filter by category, status, or location.</p>
          </div>
          {user?.role === 'admin' ? (
            <button
              type="button"
              className="secondary-btn"
              onClick={handleTriage}
              disabled={triaging}
            >
              {triaging ? 'Analyzing...' : 'AI triage'}
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={() => navigate('/complaints/new')}
            >
              Register complaint
            </button>
          )}
        </div>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        {loading ? <Loader label="Loading complaints" /> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <div className="card-stack">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onView={() => navigate(`/complaints/${complaint._id}`)}
            />
          ))}
          {!loading && complaints.length === 0 ? (
            <p className="empty">No complaints found.</p>
          ) : null}
        </div>
        {user?.role === 'admin' && triage.length > 0 ? (
          <div className="panel ai-panel triage-panel">
            <div className="panel-header">
              <div>
                <h3>AI urgency insights</h3>
                <p>Urgency and department suggestions for the current filters.</p>
              </div>
              <span className="pill">{triage.length} analyzed</span>
            </div>
            <div className="card-stack">
              {triage.map((item) => (
                <div key={item.complaintId} className="complaint-card">
                  <div>
                    <div className="complaint-header">
                      <h3>{item.title}</h3>
                      <span
                        className={`status-badge ${item.urgency?.toLowerCase()}`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="complaint-meta">
                      {item.category} • {item.location} • {item.department}
                    </p>
                    <p className="complaint-description">{item.summary}</p>
                    {item.adminAdvice ? (
                      <p className="complaint-meta">{item.adminAdvice}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ComplaintList
