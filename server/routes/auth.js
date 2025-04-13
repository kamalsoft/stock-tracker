const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const { authMiddleware } = require('../middleware/auth')

// Register user
router.post(
  '/register',
  [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  authController.register
)

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  authController.login
)

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser)

// Update profile
router.put(
  '/profile',
  authMiddleware,
  [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please include a valid email'),
  ],
  authController.updateProfile
)

// Change password
router.put(
  '/password',
  authMiddleware,
  [
    body('currentPassword')
      .not()
      .isEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
  ],
  authController.changePassword
)

module.exports = router
