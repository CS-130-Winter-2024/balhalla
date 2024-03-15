import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import UI from './ui/UI'
import game from './game/Game.jsx'
import AlertWrapper from './ui/components/AlertWrapper.jsx'
import LogWrapper from './ui/components/LogWrapper.jsx'

/**
 * Main function that renders all UI + runs game from client side.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* set to enableLogging={false} during production */}
    <LogWrapper enableLogging={true}>
      <AlertWrapper>
        {showAlert => (
          <>
            <UI showAlert={showAlert} />
          </>
        )}
      </AlertWrapper>
    </LogWrapper>
  </React.StrictMode>,
)

game()
