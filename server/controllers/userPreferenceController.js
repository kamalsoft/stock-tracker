const { UserPreference } = require('../db/models')

// Get user preferences
exports.getUserPreferences = async (req, res, next) => {
  try {
    let preferences = await UserPreference.findOne({
      where: { UserId: req.user.id },
    })

    if (!preferences) {
      preferences = await UserPreference.create({
        UserId: req.user.id,
      })
    }

    res.json(preferences)
  } catch (error) {
    next(error)
  }
}

// Update user preferences
exports.updateUserPreferences = async (req, res, next) => {
  try {
    const {
      theme,
      defaultPortfolioId,
      defaultWatchlistId,
      emailNotifications,
      priceAlerts,
      newsAlerts,
      dashboardLayout,
      customSettings,
      refreshInterval,
    } = req.body

    let preferences = await UserPreference.findOne({
      where: { UserId: req.user.id },
    })

    if (!preferences) {
      preferences = await UserPreference.create({
        UserId: req.user.id,
      })
    }

    // Update preferences
    await preferences.update({
      theme: theme !== undefined ? theme : preferences.theme,
      defaultPortfolioId:
        defaultPortfolioId !== undefined
          ? defaultPortfolioId
          : preferences.defaultPortfolioId,
      defaultWatchlistId:
        defaultWatchlistId !== undefined
          ? defaultWatchlistId
          : preferences.defaultWatchlistId,
      emailNotifications:
        emailNotifications !== undefined
          ? emailNotifications
          : preferences.emailNotifications,
      priceAlerts:
        priceAlerts !== undefined ? priceAlerts : preferences.priceAlerts,
      newsAlerts:
        newsAlerts !== undefined ? newsAlerts : preferences.newsAlerts,
      dashboardLayout:
        dashboardLayout !== undefined
          ? dashboardLayout
          : preferences.dashboardLayout,
      customSettings:
        customSettings !== undefined
          ? customSettings
          : preferences.customSettings,
      refreshInterval:
        refreshInterval !== undefined
          ? refreshInterval
          : preferences.refreshInterval,
    })

    res.json(preferences)
  } catch (error) {
    next(error)
  }
}
