import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'
import UI from './ui/UI'
import game from './game/Game.jsx'
import InGameMenu from './menus/InGameMenu.jsx'
import AlertWrapper from './menus/AlertWrapper.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AlertWrapper>
      {showAlert => (
        <>
          <UI />

          <InGameMenu
            handleClose={() => {}}
            inGame={true}
            showAlert={showAlert}
          />
        </>
      )}
    </AlertWrapper>
  </React.StrictMode>,
)

game()
