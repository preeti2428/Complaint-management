const { analyzeComplaint, assistUser } = require('../utils/aiClient')

const analyzeComplaintHandler = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: 'Title and description are required' })
    }

    const analysis = await analyzeComplaint({
      title,
      description,
      category: category || 'General',
      location: location || 'Unknown',
    })

    return res.json({
      message: 'AI analysis completed',
      analysis,
    })
  } catch (error) {
    return next(error)
  }
}

const triageComplaintsHandler = async (req, res, next) => {
  try {
    const { filters = {} } = req.body

    const query = {}
    if (filters.category) query.category = filters.category
    if (filters.status) {
      query.status = filters.status
    } else {
      query.status = { $ne: 'Resolved' }
    }
    if (filters.location) query.location = new RegExp(filters.location, 'i')

    const complaints = await require('../models/Complaint')
      .find(query)
      .sort({ createdAt: -1 })

    const analysis = await Promise.all(
      complaints.map(async (complaint) => {
        const result = await analyzeComplaint({
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          location: complaint.location,
        })

        return {
          complaintId: complaint._id,
          title: complaint.title,
          category: complaint.category,
          location: complaint.location,
          status: complaint.status,
          urgency: result.priority,
          department: result.department,
          summary: result.summary,
          response: result.response,
          adminAdvice: result.adminAdvice,
        }
      })
    )

    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    analysis.sort(
      (a, b) => (priorityOrder[a.urgency] ?? 3) - (priorityOrder[b.urgency] ?? 3)
    )

    return res.json({
      message: 'AI triage completed',
      count: analysis.length,
      analysis,
    })
  } catch (error) {
    return next(error)
  }
}

const assistUserHandler = async (req, res, next) => {
  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    const answer = await assistUser({ prompt })
    return res.json({ message: 'AI assistance ready', answer })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  analyzeComplaintHandler,
  assistUserHandler,
  triageComplaintsHandler,
}
