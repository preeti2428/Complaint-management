const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, adminCode } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    let safeRole = 'user'
    if (role === 'admin') {
      const expectedCode = process.env.ADMIN_REGISTRATION_CODE
      if (!expectedCode || adminCode !== expectedCode) {
        return res.status(403).json({ message: 'Admin code is invalid' })
      }
      safeRole = 'admin'
    }

    const user = await User.create({ name, email, password, role: safeRole })

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    return next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { registerUser, loginUser }
