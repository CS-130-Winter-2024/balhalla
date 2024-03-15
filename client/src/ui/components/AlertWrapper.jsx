import { useState } from 'react'
import PropTypes from 'prop-types'
import CustomAlert from './CustomAlert'


/**
 * Functional component for displaying alerts.
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.children - The child components that can trigger alerts.
 * @returns {JSX.Element} JSX element representing the AlertWrapper component.
 */
const AlertWrapper = ({ children }) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')

  const showAlert = (message, severity) => {
    setAlertMessage(message)
    setAlertSeverity(severity)
    setAlertOpen(true)
  }

  return (
    <>
      {children(showAlert)}
      <CustomAlert
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
        isOpen={alertOpen}
      />
    </>
  )
}

AlertWrapper.propTypes = {
  children: PropTypes.func.isRequired,
}

export default AlertWrapper
