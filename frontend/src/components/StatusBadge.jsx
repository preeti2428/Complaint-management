const StatusBadge = ({ status }) => {
  const statusClass = status ? status.toLowerCase().replace(/\s+/g, '-') : 'pending'
  return <span className={`status-badge ${statusClass}`}>{status}</span>
}

export default StatusBadge
