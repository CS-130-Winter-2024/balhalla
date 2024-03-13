import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import UI from './ui/UI'
import game from './game/Game.jsx'
import InGameMenu from './ui/components/InGameMenu.jsx'
import AlertWrapper from './ui/components/AlertWrapper.jsx'
import LogWrapper from './ui/components/LogWrapper.jsx'
import EndScreen from './menus/EndScreen.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* set to enableLogging={false} during production */}
    <LogWrapper enableLogging={true}>
      <AlertWrapper>

        {showAlert => (
          <>
            <EndScreen
              open={true}
              onClose={() => {}}
              />
            <UI showAlert={showAlert}/>

            <InGameMenu
              showAlert={showAlert}
            />
          </>
        )}
      </AlertWrapper>
    </LogWrapper>
  </React.StrictMode>,
)

game()
