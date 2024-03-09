import {useState, useEffect } from "react";
import { Modal, Fade, Paper, Box, Typography, BottomNavigation, BottomNavigationAction, Button , Icon} from "@mui/material";
import PropTypes from "prop-types";
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import TabCarousel from "./TabCarousel";

// modal constants
const WIDTH_PERCENT = "50%";
const HEIGHT_PERCENT = "65%";
const MIN_WIDTH = "400px";
const MIN_HEIGHT = "250px";

// functions for Text
function textStyle(size = 3, bolded = false) {
    if (size < 0 || size > 6) {
        console.error("Invalid size for textStyle");
         return;    
    }
    const fontSizeMapping = ["14px", "16px", "18px", "20px", "24px", "36px", "48px", "60px"]

    return {
        color: "black",
        fontFamily: "Roboto, Helvetica, Arial",
        textAlign: "center",
        fontSize: fontSizeMapping[size],
        fontWeight: bolded ? "bold" : "normal",
    };
}


// prop validation
InGameMenu.propTypes = {
    handleClose: PropTypes.func.isRequired,
    inGame: PropTypes.bool.isRequired,
  };

function InGameMenu({ handleClose, inGame }) {

    // conditions and states
    const [open, setOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [menuHeight, setMenuHeight] = useState(window.innerHeight);



    // if spacebar pressed, toggle the open state
    document.addEventListener("spaceBarPressed", () => {
        setOpen(!open);
        setMenuHeight(window.innerHeight)
        console.log("menuHeight: ", menuHeight);
    });

    // if resized, we close the menu because
    addEventListener("resize", () => {setOpen(false); console.log("resized")});


    if (!inGame) return null;

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
            <Fade in={open} timeout={{ enter: 500, exit: 300 }}>
                <Paper style={styles.customModal}>
                    {/* Modal Header */}
                    <Box style={styles.modalHeader}> 
                        <Typography style={textStyle(5, true)}>Menu</Typography>
                    </Box>

                    {/* Modal Body */}
                    <Box style={styles.modalBody}> 


                        {/* Left Body */}
                        <Box style={styles.leftBody}>

                            <Box style={styles.leftTop}> 

                            </Box>

                            <Box style={styles.leftBottom}>

                            </Box>

                        </Box>

                        {/* Right Body */}
                        <Box style={styles.rightBody}>
                            
                            {/* Don't question it, if it works it works */}
                            <TabCarousel index={carouselIndex} menuHeight={menuHeight}/>
                                <BottomNavigation
                                    value={carouselIndex}
                                    onChange={(event, newValue) => setCarouselIndex(newValue)}
                                    showLabels
                                    style={styles.bottomNavigation}
                                >
                                    <BottomNavigationAction
                                        icon={<SettingsIcon style={{ fontSize: '42px' }}/>}
                                    />
                                    <BottomNavigationAction
                                        icon={<HelpOutlineIcon style={{ fontSize: '42px' }}/>}
                                    />
                                </BottomNavigation>
                            </Box>
                    </Box>



                </Paper>
            </Fade>
            </Modal>
        </>
    );
}


  

const styles = {
    
    customModal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        width: WIDTH_PERCENT,
        height: HEIGHT_PERCENT,
        backgroundColor: "blue", // CHANGE
        padding: "20px", 
        display: "flex",
        borderRadius: "20px",
        border: "5px solid black",
        flexDirection: "column",

    },
    modalHeader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10%",
        width: "100%",
        backgroundColor: "red", // CHANGE
        minHeight: "50px",
    },
    modalBody: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
        width: "100%",
        backgroundColor: "green", // CHANGE
    },
    leftBody: {
        width: "50%",
        height: "100%",
        backgroundColor: "yellow", // CHANGE
    },
    
    rightBody: {
        width: "50%",
        height: "100%",
        backgroundColor: "purple", // CHANGE
        display: "flex",
        flexDirection: "column",
    },
    leftTop: {
        width: "100%",
        height: "50%",
        backgroundColor: "purple", // CHANGE
    },
    leftBottom: {
        width: "100%",
        height: "50%",
        backgroundColor: "pink", // CHANGE
    },
    bottomNavigation: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
        backgroundColor: "orange",
        maxHeight: "75px",
    },
  };

export default InGameMenu;
