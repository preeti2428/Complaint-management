import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-mark">SCMS</span>
        <div>
          <p className="brand-title">Smart Complaint Manager</p>
          <p className="brand-subtitle">AI-assisted grievance routing</p>
        </div>
      </div>
      <nav className="nav-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/complaints">Complaints</NavLink>
            {user?.role !== 'admin' ? (
              <NavLink to="/complaints/new">New Complaint</NavLink>
            ) : null}
            {user?.role !== 'admin' ? (
              <NavLink to="/assistant">AI Assistant</NavLink>
            ) : null}
          </>
        ) : (
          <>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
      {isAuthenticated ? (
        <div className="nav-profile">
          <div>
            <p className="profile-name">{user?.name || 'User'}</p>
            <p className="profile-role">{user?.role || 'user'}</p>
          </div>
          <button type="button" className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-profile">
          <span className="pill">Secure login</span>
        </div>
      )}
    </header>
  )
}

export default NavBar
