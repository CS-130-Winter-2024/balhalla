import {useState, useEffect } from "react";
import { Modal, Fade, Paper, Backdrop } from "@mui/material";



// modal constants
const WIDTH_PERCENT = "50%";
const HEIGHT_PERCENT = "60%";
const MIN_WIDTH = "400px";
const MIN_HEIGHT = "250px";


function InGameMenu({ handleClose, inGame }) {

    // conditions and states
    const [open, setOpen] = useState(false);


    // if spacebar pressed, toggle the open state
    document.addEventListener("spaceBarPressed", () => {
        setOpen(!open);
    });



    if (!inGame) return null;

    return (
        <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
        }}
        >
        <Fade in={open} timeout={{ enter: 500, exit: 300 }}>
            <Paper style={styles.customModal}>
            {/* Your modal content goes here */}
            <h2>Your Modal Content</h2>
            </Paper>
        </Fade>
        </Modal>
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
        // backgroundColor: "blue", // CHANGE
        padding: "20px", 
        display: "flex",
        borderRadius: "20px",
        border: "5px solid black",

    },
  };

export default InGameMenu;
