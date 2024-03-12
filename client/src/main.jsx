import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import UI from './ui/UI'
import game from './game/Game.jsx'
import InGameMenu from './menus/InGameMenu.jsx'
import AlertWrapper from './menus/AlertWrapper.jsx'
import LogWrapper from './menus/LogWrapper.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* set to enableLogging={false} during production */}
    <LogWrapper enableLogging={true}>
      <AlertWrapper>
        {showAlert => (
          <>
            <UI showAlert={showAlert}/>

            <InGameMenu
              handleClose={() => {}}
              inGame={true}
              showAlert={showAlert}
            />
          </>
        )}
      </AlertWrapper>
    </LogWrapper>
  </React.StrictMode>,
)

game()
