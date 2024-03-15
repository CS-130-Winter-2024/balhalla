import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'

/**
 * A custom alert component for displaying messages with different severity levels.
 * @param {Object} props - The props object containing message, severity, onClose, and isOpen properties.
 * @param {string} props.message - The message to display in the alert.
 * @param {string} props.severity - Severity level of the alert (info, error, success).
 * @param {Function} props.onClose - Function to handle closing the alert.
 * @param {boolean} props.isOpen - Flag indicating if the alert is open.
 */
const CustomAlert = ({ message, severity, onClose, isOpen }) => {
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      const timeout = setTimeout(() => {
        onClose()
        setVisible(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [message, severity, isOpen, onClose])

  return (
    <Fade in={visible} timeout={500}>
      <Alert
        severity={severity}
        onClose={() => {
          setVisible(false)
          onClose()
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          borderRadius: '5px',
          textAlign: 'center',
        }}
      >
        {message}
      </Alert>
    </Fade>
  )
}

CustomAlert.propTypes = {
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['info', 'error', 'success']).isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default CustomAlert
