const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')
const { registerRules, loginRules, validateRequest } = require('../validators/authValidators')

const router = express.Router()

router.post('/register', registerRules, validateRequest, registerUser)
router.post('/login', loginRules, validateRequest, loginUser)

module.exports = router
