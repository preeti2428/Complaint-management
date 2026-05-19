const { body, validationResult, query } = require('express-validator')

const createComplaintRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
]

const updateStatusRules = [
  body('status')
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    .withMessage('Status must be valid'),
]

const searchRules = [
  query('location').trim().notEmpty().withMessage('Location is required'),
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

module.exports = {
  createComplaintRules,
  updateStatusRules,
  searchRules,
  validateRequest,
}
