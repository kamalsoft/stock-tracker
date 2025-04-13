import React from 'react'
import logger from './logger'

const withLogging = (WrappedComponent) => {
  class WithLogging extends React.Component {
    componentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component'

    constructor(props) {
      super(props)
      logger.logComponentLifecycle(this.componentName, 'constructor', props)
    }

    componentDidMount() {
      logger.logComponentLifecycle(this.componentName, 'componentDidMount')
      logger.time(`${this.componentName} render time`)
    }

    componentDidUpdate(prevProps, prevState) {
      logger.logComponentLifecycle(this.componentName, 'componentDidUpdate', {
        prevProps,
        currentProps: this.props,
        prevState,
        currentState: this.state,
      })
    }

    componentWillUnmount() {
      logger.logComponentLifecycle(this.componentName, 'componentWillUnmount')
      logger.timeEnd(`${this.componentName} render time`)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithLogging.displayName = `WithLogging(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`
  return WithLogging
}

export default withLogging
