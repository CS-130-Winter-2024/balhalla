import { useEffect, useState } from "react";
import crosshair from "./crosshair.svg";
import { themeColors } from "../constants";

const pfp_path = "../../assets/images/hehehaw.jpg";
const coinImage = "../../assets/images/coinspin2.gif";

export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [hoveringImage, setHoveringImage] = useState(false);
  const [pfp, setPfp] = useState(pfp_path);
  const [gameStats, setGameStats] = useState({
    wins: 10,
    gamesPlayed: 20,
    winRate: "50%",
    eliminations: 100,
    coins: 42,
  });

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
  leanRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  pointsContainer: {
    marginTop: 20,
    marginRight: 40,
    backgroundColor: "#f2f2f2", // Light gray color for the rectangle
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
    height: "39%",
    backgroundColor: "yellow",
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
    height: "60%",
    width: "100%",
    flex: 3,
    flexDirection: "column",
    backgroundColor: "purple",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "red",
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    backgroundColor: "green", // Adjust color as needed
  },
  leftSection: {
    flex: 1, // Takes up 1/2 of the available space
    backgroundColor: "blue", // Adjust color as needed
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
    backgroundColor: "orange",
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    flexDirection: "column", // Added to ensure a vertical layout
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
