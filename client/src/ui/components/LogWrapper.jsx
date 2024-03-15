import { useEffect } from 'react'
import PropTypes from 'prop-types'

LoggingWrapper.propTypes = {
  enableLogging: PropTypes.bool.isRequired,
}

/**
 * A component for enabling or disabling logging to the console based on a flag.
 * @param {boolean} enableLogging - Flag to enable or disable logging.
 * @returns {Object} - Object with functions to enable and disable console logging.
 */
function LoggingWrapper({ enableLogging }) {
  const originalConsole = { ...console }
  const disableConsole = () => {
    console.log = () => {}
    console.warn = () => {}
    // console.error = () => {}
    // console.info = () => {}
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

/**
 * A component for wrapping children components with logging functionality based on a flag.
 * @param {ReactNode} children - The child components to be wrapped.
 * @param {boolean} enableLogging - Flag to enable or disable logging.
 * @returns {ReactNode} - The wrapped child components.
 */
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
