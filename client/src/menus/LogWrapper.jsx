import { useEffect } from 'react'
import PropTypes from 'prop-types'

LoggingWrapper.propTypes = {
  enableLogging: PropTypes.bool.isRequired,
}

function LoggingWrapper({ enableLogging }) {
  const originalConsole = { ...console }
  const disableConsole = () => {
    console.log = () => {}
    console.warn = () => {}
    console.error = () => {}
    console.info = () => {}
  }

  const enableConsole = () => {
    console = { ...originalConsole } // eslint-disable-line no-global-assign
  }

  useEffect(() => {
    if (!enableLogging) {
      disableConsole()
    }

    // Clean up
    return () => {
      enableConsole()
    }
  }, [enableLogging])

  return {
    enable: enableConsole,
    disable: disableConsole,
  }
}

LogWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  enableLogging: PropTypes.bool.isRequired,
}

function LogWrapper({ children, enableLogging }) {
  const logger = LoggingWrapper(enableLogging)

  useEffect(() => {
    if (enableLogging) {
      logger.enable()
    } else {
      logger.disable()
    }

    // Clean up
    return () => {
      logger.enable()
    }
  }, [enableLogging, logger])

  return <>{children}</>
}

export default LogWrapper
