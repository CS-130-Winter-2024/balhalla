import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Alert from '@mui/material/Alert'
import Fade from '@mui/material/Fade'

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
