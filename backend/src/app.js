const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const complaintRoutes = require('./routes/complaintRoutes')
const aiRoutes = require('./routes/aiRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true,
  })
)
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
