import { useEffect, useState } from "react";
import crosshair from "./crosshair.svg";
import { themeColors } from "../constants";

const pfp_path = "../../assets/images/hehehaw.jpg";

export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [hoveringImage, setHoveringImage] = useState(false);
  const [gameStats, setGameStats] = useState({
    wins: 10,
    gamesPlayed: 20,
    winRate: "50%",
    eliminations: 100,
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
      // Show prompt or trigger file input
      // You can use a library like react-dropzone for a better file upload experience
      console.log("Upload new image");
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={{ ...styles.menu, display: (showOverlay && "none") || "block" }}>
          <div style={styles.layout}>
            <div style={styles.header}>
              <div style={styles.headerText}> MENU</div>
            </div>
            <div style={styles.twoDivide}>

               {/* Right Section */}
              <div style={styles.leftSection}>
                <div style={styles.pfpContainer}>
                  <div style={styles.pfp}> 
                  <img
                    src={pfp_path}
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


              {/* Left Section */}
              <div style={styles.rightSection}>
                {/* Content for the left section */}
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
