const express = require('express')
const router = express.Router()
const userPreferenceController = require('../controllers/userPreferenceController')

// Get user preferences
router.get('/', userPreferenceController.getUserPreferences)

// Update user preferences
router.put('/', userPreferenceController.updateUserPreferences)

module.exports = router
