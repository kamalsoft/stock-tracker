const jwt = require('jsonwebtoken')
const { User } = require('../db/models')

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No authentication token, access denied' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findByPk(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    res.status(401).json({ message: 'Token is not valid' })
  }
}

exports.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res
      .status(403)
      .json({ message: 'Access denied, admin privileges required' })
  }
}
