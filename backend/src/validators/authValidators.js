const { body, validationResult } = require('express-validator')

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be user or admin'),
  body('adminCode')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Admin code must be at least 6 characters'),
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
]

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array(),
    })
  }

  return next()
}

module.exports = { registerRules, loginRules, validateRequest }
