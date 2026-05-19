import { useState } from 'react'
import { assistUser } from '../services/ai'

const AiAssistant = () => {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setAnswer('')

    try {
      const data = await assistUser({ prompt })
      setAnswer(data.answer)
    } catch (err) {
      setError(err.response?.data?.message || 'AI assistant failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="assistant-page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>AI helpdesk</h2>
            <p>Ask the AI for next steps or guidance on your complaint.</p>
          </div>
          <span className="pill">User guidance</span>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="full">
            Your question
            <textarea
              rows="4"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Water leak near my house, what should I do first?"
              required
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="form-actions full">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
        </form>
      </div>
      <div className="panel assistant-response">
        <h3>AI response</h3>
        {answer ? <p>{answer}</p> : <p className="empty">No response yet.</p>}
      </div>
    </section>
  )
}

export default AiAssistant
