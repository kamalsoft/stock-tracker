import { useEffect, useRef } from 'react'
import logger from './logger'

const useLogger = (componentName, props = {}) => {
  const renderTimeRef = useRef(null)

  useEffect(() => {
    logger.logComponentLifecycle(componentName, 'mount', props)
    renderTimeRef.current = performance.now()

    return () => {
      const renderTime = performance.now() - renderTimeRef.current
      logger.logComponentLifecycle(componentName, 'unmount')
      if (renderTime > 100) {
        logger.warn(
          `Component ${componentName} was mounted for ${Math.round(
            renderTime
          )}ms`
        )
      }
    }
  }, [componentName, props])

  useEffect(() => {
    logger.logComponentLifecycle(componentName, 'update', props)
  }, [componentName, props])
}

export default useLogger
