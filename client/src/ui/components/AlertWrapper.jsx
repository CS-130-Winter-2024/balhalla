import { useState } from 'react'
import PropTypes from 'prop-types'
import CustomAlert from './CustomAlert'

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
