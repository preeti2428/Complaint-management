const Loader = ({ label }) => {
  return (
    <div className="loader">
      <span className="loader-dot"></span>
      <span className="loader-dot"></span>
      <span className="loader-dot"></span>
      <p>{label || 'Loading...'}</p>
    </div>
  )
}

export default Loader
