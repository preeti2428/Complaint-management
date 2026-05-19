const Complaint = require('../models/Complaint')

const createComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location, status } =
      req.body
    const safeStatus = req.user?.role === 'admin' && status ? status : 'Pending'

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      status: safeStatus,
      createdBy: req.user?._id,
    })
    return res.status(201).json({
      message: 'Complaint stored successfully',
      complaint,
    })
  } catch (error) {
    return next(error)
  }
}

const getComplaints = async (req, res, next) => {
  try {
    const { category, status, location } = req.query
    const filters = {}

    if (req.user?.role !== 'admin') {
      filters.createdBy = req.user?._id
    }

    if (category) filters.category = category
    if (status) filters.status = status
    if (location) filters.location = new RegExp(location, 'i')

    const complaints = await Complaint.find(filters).sort({ createdAt: -1 })
    return res.json(complaints)
  } catch (error) {
    return next(error)
  }
}

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    if (req.user?.role !== 'admin') {
      if (
        !complaint.createdBy ||
        complaint.createdBy.toString() !== req.user?._id.toString()
      ) {
        return res.status(403).json({ message: 'Access denied' })
      }
    }

    return res.json(complaint)
  } catch (error) {
    return next(error)
  }
}

const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const complaint = await Complaint.findById(req.params.id)

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    complaint.status = status
    await complaint.save()

    return res.json({ message: 'Status updated', complaint })
  } catch (error) {
    return next(error)
  }
}

const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    await complaint.deleteOne()
    return res.json({ message: 'Complaint removed' })
  } catch (error) {
    return next(error)
  }
}

const searchByLocation = async (req, res, next) => {
  try {
    const { location } = req.query
    const filters = {
      location: new RegExp(location, 'i'),
    }

    if (req.user?.role !== 'admin') {
      filters.createdBy = req.user?._id
    }

    const complaints = await Complaint.find(filters).sort({ createdAt: -1 })

    return res.json(complaints)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
}
