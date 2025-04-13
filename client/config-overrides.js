module.exports = function override(config, env) {
  // Update webpack-dev-server config
  console.log('config', config)
  if (config.devServer) {
    const { onBeforeSetupMiddleware, onAfterSetupMiddleware } = config.devServer

    // Remove deprecated options
    delete config.devServer.onBeforeSetupMiddleware
    delete config.devServer.onAfterSetupMiddleware

    // Add setupMiddlewares
    config.devServer.setupMiddlewares = (middlewares, devServer) => {
      // Call the old handlers if they exist
      if (onBeforeSetupMiddleware) {
        onBeforeSetupMiddleware(devServer)
      }

      // Return middlewares
      const result = middlewares

      if (onAfterSetupMiddleware) {
        onAfterSetupMiddleware(devServer)
      }

      return result
    }
  }

  return config
}
