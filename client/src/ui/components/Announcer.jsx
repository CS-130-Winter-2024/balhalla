import { Typography } from "@mui/material";
import { useEffect, useReducer, useRef, useState } from "react";
import { add_listener, remove_listener } from "../../constants";





const DISPLAY_DURATION = 1000;


const styles = {
    fadeIn: {
        opacity:1,
        transition: `opacity 0.25s linear`,
    },
    hidden: {
        opacity:0,
        transition: `opacity 1s linear`,
    },
    text: {
        fontFamily:"Jorvik",
        fontSize:"40px",
        textShadow:"0px 0px 2px black",
        color:"white",
        textAlign:"center"
    }
}
/**
 * Functional component for displaying announcements.
 * @param {Object} props - The properties passed to the component (currently empty).
 * @returns {JSX.Element} JSX element representing the Announcer component.
 */
export function Announcer({}) {
    const [announcement, setAnnouncement] = useState("");
    const [rendering, setRendering] = useState(false)
    const timerID = useRef(-1)

    useEffect(()=>{
        let announcer = add_listener("ANNOUNCE",(val)=>{
            setAnnouncement(val);
            setRendering(true);
            clearTimeout(timerID.current);
            timerID.current = setTimeout(()=>{
                setRendering(false)
            },DISPLAY_DURATION)
        });

        return ()=>{
            remove_listener("ANNOUNCE",announcer);
            if (timerID.current != -1) {
                clearTimeout(timerID.current)
            }
        }
    },[])

    return (
        <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",top:"140px", width:"600px"}}>
            <div style={rendering ? styles.fadeIn : styles.hidden}>
                <p style={styles.text}>
                    {announcement}
                </p>
            </div>
        </div>
    )
}

