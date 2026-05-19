import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="not-found">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link className="primary-btn" to="/">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
