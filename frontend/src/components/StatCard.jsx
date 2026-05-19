const StatCard = ({ title, value, helper }) => {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      <p className="stat-helper">{helper}</p>
    </div>
  )
}

export default StatCard
