const path = require('path')
//const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ... other webpack configuration

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    historyApiFallback: true,
    hot: true,

    // Replace deprecated options with setupMiddlewares
    setupMiddlewares: (middlewares, devServer) => {
      // Your middleware setup code here
      // This replaces both onBeforeSetupMiddleware and onAfterSetupMiddleware

      // Example: if you had code in onBeforeSetupMiddleware:
      // devServer.app.use(/* your middleware */)

      // Always return the middlewares array
      return middlewares
    },
  },

  // ... rest of your webpack configuration
}
