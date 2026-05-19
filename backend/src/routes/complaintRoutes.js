const express = require('express')
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
} = require('../controllers/complaintController')
const { protect, requireRole } = require('../middleware/authMiddleware')
const {
  createComplaintRules,
  updateStatusRules,
  searchRules,
  validateRequest,
} = require('../validators/complaintValidators')

const router = express.Router()

router.get('/', protect, getComplaints)
router.get('/search', protect, searchRules, validateRequest, searchByLocation)
router.get('/:id', protect, getComplaintById)
router.post('/', protect, createComplaintRules, validateRequest, createComplaint)
router.put(
  '/:id',
  protect,
  requireRole('admin'),
  updateStatusRules,
  validateRequest,
  updateComplaintStatus
)
router.delete('/:id', protect, requireRole('admin'), deleteComplaint)

module.exports = router
