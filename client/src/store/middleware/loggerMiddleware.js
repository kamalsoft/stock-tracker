import logger from '../../utils/logger'

const loggerMiddleware = (store) => (next) => (action) => {
  logger.time(`Redux: ${action.type}`)

  const prevState = store.getState()
  const result = next(action)
  const nextState = store.getState()

  logger.logReduxAction(action, prevState, nextState)
  logger.timeEnd(`Redux: ${action.type}`)

  return result
}

export default loggerMiddleware
