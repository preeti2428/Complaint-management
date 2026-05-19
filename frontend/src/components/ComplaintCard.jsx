import StatusBadge from './StatusBadge'

const ComplaintCard = ({ complaint, onView }) => {
  return (
    <div className="complaint-card">
      <div>
        <div className="complaint-header">
          <h3>{complaint.title}</h3>
          <StatusBadge status={complaint.status} />
        </div>
        <p className="complaint-meta">
          {complaint.category} • {complaint.location}
        </p>
        <p className="complaint-description">{complaint.description}</p>
      </div>
      <button type="button" className="secondary-btn" onClick={onView}>
        View details
      </button>
    </div>
  )
}

export default ComplaintCard
