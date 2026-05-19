const express = require('express')
const {
	analyzeComplaintHandler,
	assistUserHandler,
	triageComplaintsHandler,
} = require('../controllers/aiController')
const { protect, requireRole } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/analyze', protect, requireRole('admin'), analyzeComplaintHandler)
router.post('/triage', protect, requireRole('admin'), triageComplaintsHandler)
router.post('/assist', protect, assistUserHandler)

module.exports = router
