import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="eyebrow">AI-driven public service</p>
        <h1>Smart Complaint Management System</h1>
        <p className="hero-subtitle">
          A clear, citizen-first workflow that captures complaints fast and
          routes them to the right teams with AI-supported urgency checks.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="primary-btn">
            Create account
          </Link>
          <Link to="/login" className="secondary-btn">
            Access dashboard
          </Link>
        </div>
        <div className="hero-badges">
          <span className="pill">Priority detection</span>
          <span className="pill">Department routing</span>
          <span className="pill">Citizen guidance AI</span>
          <span className="pill">Secure JWT auth</span>
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-card">
          <h3>Live complaint command</h3>
          <p>Track all complaints with filters, status updates, and AI triage.</p>
          <div className="hero-metrics">
            <div>
              <p className="metric-label">Avg response</p>
              <p className="metric-value">2h 14m</p>
            </div>
            <div>
              <p className="metric-label">Resolution rate</p>
              <p className="metric-value">92%</p>
            </div>
          </div>
        </div>
        <div className="hero-card accent">
          <h3>AI triage snapshot</h3>
          <p>
            "Pothole near bus stop with accidents reported. Priority: High.
            Routed to Public Works."
          </p>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-tile">
          <h3>1. Register</h3>
          <p>File a complaint with location, category, and quick description.</p>
        </div>
        <div className="hero-tile">
          <h3>2. Analyze</h3>
          <p>AI highlights urgency and recommends the right department.</p>
        </div>
        <div className="hero-tile">
          <h3>3. Track</h3>
          <p>Get live status updates and a clear resolution timeline.</p>
        </div>
      </div>

      <div className="hero-strip">
        <div>
          <h3>Coverage</h3>
          <p>Water Supply, Sanitation, Electricity, Public Works, Safety.</p>
        </div>
        <div>
          <h3>Built for exams</h3>
          <p>MERN + AI integration, JWT auth, Render-ready deployment.</p>
        </div>
      </div>
    </section>
  )
}

export default Landing
