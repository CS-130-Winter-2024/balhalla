import { useEffect, useState } from "react";
import crosshair from "./crosshair.svg";
import { themeColors } from "../constants";
import * as main from '../game/Game.jsx';
import {createLobbyWorld} from "../game/LobbyWorld.jsx";


const pfp_path = "../../assets/images/hehehaw.jpg";
const coinImage = "../../assets/images/coinspin2.gif";

export default function UI() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [hoveringImage, setHoveringImage] = useState(false);
  const [pfp, setPfp] = useState(pfp_path);
  const [isButton1Hovered, setButton1Hovered] = useState(false);
  const [isButton2Hovered, setButton2Hovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [worldState, setWorldState] = useState("game");
  const [gameStats, setGameStats] = useState({
    wins: 10,
    gamesPlayed: 20,
    winRate: "50%",
    eliminations: 100,
    coins: 42,
  });

  const handleStoreClick = () => {
    console.log("Store button clicked");

    if (worldState === "game") {
      main.switchToLobby();
      setWorldState("store");
    }
    else if (worldState === "store") {
      main.switchToGame();
      setWorldState("game");
    }
  };

  // update game stats every 10 seconds for testing purposes, but would use api endpoint in production
  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats((prev) => ({
        ...prev,
        wins: Math.floor(Math.random() * 100),
        gamesPlayed: Math.floor(Math.random() * 100),
        winRate: Math.floor(Math.random() * 100) + "%",
        eliminations: Math.floor(Math.random() * 1000),
        coins: Math.floor(Math.random() * 100),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    document.addEventListener("lock", () => {
      setShowOverlay(true);
    });
    document.addEventListener("unlock", () => {
      setShowOverlay(false);
    });
    document.addEventListener("setUsername", (e) => {
      setUsername(e.detail);
    });
  }, []);

  const handleImageClick = () => {
    if (hoveringImage) {
      document.getElementById("fileInput").click();
    }
  };


const handleIconHover = (isHovered, icon) => {
  if (isHovered) {
    setHoveredIcon(icon);
  } else {
    setHoveredIcon(null);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  console.log("Uploaded file:", file);

  // replace the profile picture with the uploaded image
  const reader = new FileReader();
  reader.onloadend = () => {
    setPfp(reader.result);
  };
  reader.readAsDataURL(file);
};

const handleBuyCoins = () => {
  console.log("Buying coins");
}

const styleHoverButton = (num) => {
  let btn;
  if (num === 1) btn = isButton1Hovered;
  if (num === 2) btn = isButton2Hovered;
  return {
    background: btn ? themeColors.riverside : themeColors.stormcloud,
    boxShadow: btn ? '0 0 10px ' + themeColors.riverside + ', 0 0 25px ' + themeColors.riverside : 'none',
    transition: 'background 0.5s, box-shadow 0.5s'
  }
}

const handleSettingsClick = () => {
  console.log("Settings button clicked");
  // Add logic for handling settings button click
};

const handleTrophyClick = () => {
  console.log("Trophy button clicked");
  // Add logic for handling trophy button click
};

const handleQuestionMarkClick = () => {
  console.log("Question Mark button clicked");
  // Add logic for handling question mark button click
};

  return (
    <>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }} 
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
      />
      <div style={styles.container}>
        <div style={{ ...styles.menu, display: (showOverlay && "none") || "block" }}>
          <div style={styles.layout}>
            <div style={styles.header}>
              <div style={styles.headerText}> MENU</div>
            </div>
            <div style={styles.twoDivide}>

               {/* Left Section */}
              <div style={styles.leftSection}>
                <div style={styles.pfpContainer}>
                  <div style={styles.pfp}> 
                  <img
                    src={pfp}
                    alt="Profile"
                    style={{...styles.profilePicture, opacity: hoveringImage ? 0.8 : 1, transition: "opacity 0.3s"}}
                    onMouseEnter={() => setHoveringImage(true)}
                    onMouseLeave={() => setHoveringImage(false)}
                    onClick={handleImageClick}
                  />
                  </div>
                  <div style={styles.usernameText}>{username}</div>
                </div>
                <div style={styles.divider}></div>

                <div style={styles.statsContainer}>
                  <div style={styles.statBox}>
                    <div style={styles.statText}>Wins: <span style={styles.statNumber}>{gameStats.wins}</span></div>
                    <div style={styles.statText}>Total Games: <span style={styles.statNumber}>{gameStats.gamesPlayed}</span></div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statText}>Win Rate: <span style={styles.statNumber}>{gameStats.winRate}</span></div>
                    <div style={styles.statText}>Eliminations: <span style={styles.statNumber}>{gameStats.eliminations}</span></div>
                  </div>
                </div>
              </div>


              {/* Right Section */}
              <div style={styles.rightSection}>
                <div style={styles.right70}>
                  <div style={styles.leanRight}> 
                    <button style={styles.pointsContainer} onClick={handleBuyCoins}>
                      <div style={styles.pointsBox}>
                        <div style={styles.pointsText}>{gameStats.coins}</div>
                        <img src={coinImage} alt="Coins" style={styles.coinImage} />
                      </div>
                      <div style={styles.buyButton}>
                        <div style={styles.buyButtonInner}>+</div>
                      </div>
                    </button>
                  </div>
                  <div style={styles.centeredButtons}>
                    <button 
                      style={{...styles.centeredButton, ...styleHoverButton(1)}}
                      onMouseEnter={()=>setButton1Hovered(true)}
                      onMouseLeave={()=>setButton1Hovered(false)}
                      onClick={handleStoreClick}
                      >
                        {worldState === "game" ? "Store" : "Back"}
                    </button>
                    <button 
                      style={{...styles.centeredButton, ...styleHoverButton(2)}}
                      onMouseEnter={()=>setButton2Hovered(true)}
                      onMouseLeave={()=>setButton2Hovered(false)}
                      >
                        Collections
                    </button>
                  </div>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.bottomIcons}>
                <div
                  style={{
                    ...styles.icon,
                    opacity: hoveredIcon === 'settings' ? 0.5 : 1,
                  }}
                  onClick={handleSettingsClick}
                  onMouseEnter={() => handleIconHover(true, 'settings')}
                  onMouseLeave={() => handleIconHover(false, 'settings')}
                >
                  <img
                    width="50"
                    height="50"
                    src="https://img.icons8.com/ios-filled/100/settings.png"
                    alt="settings"
                  />
                </div>

                <div
                  style={{
                    ...styles.icon,
                    opacity: hoveredIcon === 'trophy' ? 0.5 : 1,
                  }}
                  onClick={handleTrophyClick}
                  onMouseEnter={() => handleIconHover(true, 'trophy')}
                  onMouseLeave={() => handleIconHover(false, 'trophy')}
                >
                  <img
                    width="50"
                    height="50"
                    src="https://img.icons8.com/ios-glyphs/100/trophy.png"
                    alt="trophy"
                  />
                </div>

                <div
                  style={{
                    ...styles.icon,
                    opacity: hoveredIcon === 'questionMark' ? 0.5 : 1,
                  }}
                  onClick={handleQuestionMarkClick}
                  onMouseEnter={() => handleIconHover(true, 'questionMark')}
                  onMouseLeave={() => handleIconHover(false, 'questionMark')}
                >
                  <img
                    width="50"
                    height="50"
                    src="https://img.icons8.com/ios-glyphs/90/question-mark.png"
                    alt="question-mark"
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ ...styles.crosshair, display: (showOverlay && "block") || "none" }}>
        <img src={crosshair} width={50} height={50} alt="Crosshair" />
      </div>
    </>
  );
}

const styles = {
  right70: {
    height: "70%",
    width: "100%",
    flex: 1,
  },
  bottomIcons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: "pink",
    padding: "15px 0",
    height: "29%",
  },
  icon: {
    color: themeColors.stormcloud,
    cursor: "pointer",
    fontSize: "20px",
    margin: "10px",
    transition: 'color 0.5s',
  },
  centeredButtons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  centeredButton: {
    backgroundColor: themeColors.stormcloud,
    color: "white",
    padding: "20px 40px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    fontSize: "20px",
    margin: "10px",
  },
  leanRight: {
    display: "flex",
    justifyContent: "flex-end",
    // backgroundColor: "pink", 
  },
  pointsContainer: {
    marginTop: 10,
    marginRight: 40,
    backgroundColor: "#f2f2f2",
    padding: "5px 10px",
    borderRadius: "6px 0 0 6px",
    border: `2px solid ${themeColors.stormcloud}`,
    display: "flex",
    alignItems: "center",
    width: "80px",
    height: "40px",
  },

  pointsBox: {
    display: "flex",
    alignItems: "center",
  },

  pointsText: {
    fontSize: "18px",
    fontWeight: "bold",
    marginRight: 10,
    color: themeColors.sea,
  },

  coinImage: {
    width: 25,
    height: 25,
  },

  buyButton: {
    marginLeft: 10,
  },

  buyButtonInner: {
    backgroundColor: themeColors.stormcloud,
    color: "white",
    padding: "10.5px 12px",
    borderRadius: "0 6px 6px 0",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    fontWeight: "bold",
    height: "100%",
  },


  container: {
    width: "40%",
    height: "90%",
    backgroundColor: "transparent",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  headerText: {
    fontSize: "36px",
    fontWeight: "bold",
    color: themeColors.sea,
  },
  divider: {
    width: "80%", 
    height: "1%", 
    backgroundColor: themeColors.riverside,
    margin: "0 auto",
  },
  statText: {
    fontSize: "18px",
    margin: "5px",
    fontWeight: "bold",
    color: themeColors.sea,
  },
  statNumber: {
    fontSize: "18px",
    color: themeColors.driedblood,
  },
  statsContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "29%",
    // backgroundColor: "yellow",
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  pfpContainer: {
    height: "70%",
    width: "100%",
    flex: 3,
    flexDirection: "column",
    // backgroundColor: "purple",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: themeColors.riverside,
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottom: `4px solid ${themeColors.stormcloud}`,
  },
  twoDivide: {
    display: "flex",
    width: "100%",
    flexGrow: 5,
    padding: 10,

  },
  usernameText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: themeColors.stormcloud,
    marginBottom: "3px",
    borderBottom: `2px solid ${themeColors.driedblood}`,
    borderRadius: "6px",
  },
  pfp: {
    width: "150px",
    height: "150px",
    backgroundColor: "transparent",
    display: "flex",
  },
  rightSection: {
    flex: 1, // Takes up 1/2 of the available space
    backgroundColor: themeColors.mist, 
    borderLeft: `2px solid ${themeColors.riverside}`,
    borderRight: `4px solid ${themeColors.stormcloud}`,
    borderBottom: `4px solid ${themeColors.stormcloud}`,
    borderTop: `4px solid ${themeColors.stormcloud}`,
    

  },
  leftSection: {
    flex: 1, // Takes up 1/2 of the available space
    backgroundColor: themeColors.mist, 
    borderLeft: `4px solid ${themeColors.stormcloud}`,
    borderRight: `2px solid ${themeColors.riverside}`,
    borderBottom: `4px solid ${themeColors.stormcloud}`,
    borderTop: `4px solid ${themeColors.stormcloud}`,
  },
 
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    marginBottom: "5px",
    border: `4px solid ${themeColors.stormcloud}`,
    cursor: "pointer",
    overflow: "hidden",
  },
  menu: {
    display: "flex",
    width: "100%",
    height: "60%",
    backgroundColor: themeColors.mist,
  },
  layout: {
    height: "100%",
    width: "100%",
    backgroundColor: themeColors.bluebird,
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    flexDirection: "column", 
    // padding: "20px",
    border: `4px solid ${themeColors.stormcloud}`,
  },
  crosshair: {
    width: "10px",
    height: "10px",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
  },
};
