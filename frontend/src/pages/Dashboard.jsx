import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import ComplaintCard from '../components/ComplaintCard'
import Loader from '../components/Loader'
import { getComplaints } from '../services/complaints'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await getComplaints()
        setComplaints(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaints')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const total = complaints.length
  const pending = complaints.filter((item) => item.status === 'Pending').length
  const resolved = complaints.filter((item) => item.status === 'Resolved').length
  const inProgress = complaints.filter(
    (item) => item.status === 'In Progress'
  ).length

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>
            {user?.role === 'admin'
              ? 'Complaint control room'
              : 'My complaint dashboard'}
          </h2>
          <p>
            {user?.role === 'admin'
              ? 'Track incoming issues and AI-prioritized queues.'
              : 'Track the complaints you have submitted.'}
          </p>
        </div>
        <div className="pill">Live status</div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total complaints" value={total} helper="All time" />
        <StatCard title="Pending" value={pending} helper="Awaiting action" />
        <StatCard
          title="In progress"
          value={inProgress}
          helper="Assigned to departments"
        />
        <StatCard title="Resolved" value={resolved} helper="Closed today" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent complaints</h3>
          <p>Quickly review the latest registered complaints.</p>
        </div>
        {loading ? <Loader label="Loading complaints" /> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <div className="card-stack">
          {complaints.slice(0, 3).map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onView={() => navigate(`/complaints/${complaint._id}`)}
            />
          ))}
          {!loading && complaints.length === 0 ? (
            <p className="empty">No complaints registered yet.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
