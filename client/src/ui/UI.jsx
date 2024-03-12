import { useEffect, useState, createContext, useContext } from "react";
import "./ui.css";
import crosshair from "./crosshair.svg";
// import ErrorModal from "./ErrorModal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { TablePagination } from "@mui/material";
import backgroundImage from "../../assets/textures/Background.png";

// import pkg from "../../../db/database.cjs";
// const { getLeaderboardList } = pkg;

import sampleData from "./sample-data.json";

// TODO: when page is loaded, check token in cookies against server
// if so, start as logged in, otherwise logged out
var token_to_username = {};

// const SharedBooleanContext = createContext();

// const SharedBooleanProvider = ({ children }) => {
//   const [sharedBoolean, setSharedBoolean] = useState(false);

//   const setSharedBooleanValue = (value) => {
//     setSharedBoolean(value);
//   };

//   const getSharedBooleanValue = () => {
//     return sharedBoolean;
//   };

//   return (
//     <SharedBooleanContext.Provider
//       value={{ sharedBoolean, setSharedBooleanValue, getSharedBooleanValue }}
//     >
//       {children}
//     </SharedBooleanContext.Provider>
//   );
// };

// const setSharedBoolean = (value) => {
//   const { setSharedBooleanValue } = useContext(SharedBooleanContext);
//   setSharedBooleanValue(value);
// };

// // Function to get the shared boolean value
// const getSharedBoolean = () => {
//   const { getSharedBooleanValue } = useContext(SharedBooleanContext);
//   return getSharedBooleanValue();
// };

// const handleOpenModal = () => {
//   console.log(users);
//   console.log("inside handleOpenModal");
//   setOpenModal(true);
// };

// const [sharedBool, setSharedBool] = useState(false);

var tester = true;
async function handleSignup(username, pw, conf_pw) {
  // check if pw is same as conf_pw
  if (pw !== conf_pw) {
    alert("Passwords do not match. Please try again with matching passwords.");
  }

  // console.log(admin);
  // console.log(pw);

  await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
        alert(data.error);
      }
      console.log("signup data:", data);
      localStorage.setItem("token", data.token);
      token_to_username[data.token] = username;
      // setSharedBoolean(true);
      // setSharedBool(true);
    });
}

async function handleLogin(username, pw) {
  console.log(username);
  console.log(pw);

  await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
        alert(data.error);
      }
      // setSharedBool(true);
      console.log("login token:", data.token);
      localStorage.setItem("token", data.token);
      token_to_username[data.token] = username;
      for (var key in token_to_username) {
        console.log(key + " : " + token_to_username[key]);
      }
    });
}

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const testUsers = sampleData.users;

  useEffect(() => {
    console.log("official users");

    fetch("/get_leaderboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("leaderboard data:", data);
        console.log("type of data:", typeof data);

        setUsers(JSON.parse(data));
        console.log("leaderboard data:", users);
        console.log("type of data:", typeof users);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("https://your-api-url.com/users")
  //     .then((response) => {
  //       setUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const handleOpenModal = () => {
    console.log(users);
    console.log("inside handleOpenModal");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    console.log("inside handleClose");
  };

  const indexOfFirstUser = page * rowsPerPage;
  const indexOfLastUser = Math.min((page + 1) * rowsPerPage, users.length);

  // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        style={{ margin: "5px" }}
      >
        Leaderboard
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            height: "550px",
            width: "400px",
          }}
        >
          <h1 style={{ color: "black" }}>Leaderboard</h1>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "black",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#333", color: "white" }}>
                  <th style={{}}>Rank</th>
                  <th style={{}}>Username</th>
                  <th style={{}}>Points</th>
                  <th style={{}}>Hits</th>
                </tr>
              </thead>
              <tbody>
                {users
                  // .slice(indexOfFirstUser, indexOfLastUser)
                  .map((user, index) => (
                    <tr key={user.username}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.wins}</td>
                      <td>{user.losses}</td>
                      <td>{user.hits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
            />
          </div>

          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ToggleLoginScreen() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { sharedBoolean } = getSharedBoolean();
  function handleToggleLogin() {
    setShowLogin(!showLogin);
  }

  return (
    <Box position="relative">
      <Button id="logIn" variant="outlined" onClick={handleToggleLogin}>
        {showLogin ? "Hide Login" : "Login"}
      </Button>
      {showLogin && (
        <Box
          position="absolute"
          top={-150}
          height={250}
          width={250}
          left="calc(100% + 50px)"
          padding="10px"
          border="10px solid #0"
          borderRadius="10px"
          bgcolor="#0"
          alignItems="center"
          gap={4}
          p={2}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2
            id="box"
            style={{
              color: "white",
              paddingLeft: 10,
              paddingTop: -5,
              margin: "5px",
            }}
          >
            Login
          </h2>
          <TextField
            id="field"
            style={{ padding: 10, color: "white" }}
            label="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: {
                color: "white",
                backgroundColor: "#65727d",
                borderRadius: "5px",
              },
              label: { color: "white" },
            }}
          />
          <br />
          <TextField
            id="field"
            label="Password"
            type="password"
            sx={{
              input: {
                color: "white",
                backgroundColor: "#65727d",
                borderRadius: "5px",
              },
              label: { color: "white" },
            }}
            style={{ padding: 10 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button
            onClick={() => handleLogin(email, password)}
            style={{ color: "white", paddingLeft: 10 }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}

function ToggleSignUpScreen() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleToggleSignUp() {
    setShowSignUp(!showSignUp);
  }

  return (
    <Box position="relative">
      <Button id="signUp" variant="outlined" onClick={handleToggleSignUp}>
        {showSignUp ? "Hide Sign Up" : "Sign Up"}
      </Button>
      {showSignUp && (
        <Box
          position="absolute"
          marginTop="20px"
          height={350}
          width={250}
          left="calc(100% + 50px)"
          padding="10px"
          border="10px solid #0"
          borderRadius="10px"
          bgcolor="#0"
          alignItems="center"
          gap={2}
          p={2}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2
            id="box"
            style={{
              color: "white",
              paddingLeft: 10,
              paddingTop: -5,
              margin: "5px",
            }}
          >
            Sign Up
          </h2>
          <TextField
            id="emailField"
            style={{ padding: 10 }}
            label="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: {
                color: "white",
                backgroundColor: "#65727d",
                borderRadius: "5px",
              },
              label: { color: "white" },
            }}
          />
          <br />
          <TextField
            id="passwordField"
            label="Password"
            type="password"
            style={{ padding: 10 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: {
                color: "white",
                backgroundColor: "#65727d",
                borderRadius: "5px",
              },
              label: { color: "white" },
            }}
          />
          <br />
          <TextField
            id="confirmPasswordField"
            label="Confirm Password"
            type="password"
            style={{ padding: 10 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              input: {
                color: "white",
                backgroundColor: "#65727d",
                borderRadius: "5px",
              },
              label: { color: "white" },
            }}
          />
          <br />
          <Button
            onClick={() => handleSignup(email, password, confirmPassword)}
            style={{ color: "white", paddingLeft: 10 }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Hello World");
  const [loginClicked, setLoginClicked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (localStorage.getItem("token") in token_to_username) {
    // TODO: toggle to logged in screen with user token_to_username[localStorage.getItem("token")]
  } else {
    // TODO: toggle to logged out screen
  }

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

  return (
    <>
      <div id="UI" style={{ display: (showOverlay && "none") || "block" }}>
        <h1 id="logo">Balhalla</h1>
        <h2>{username}</h2>

        <Button
          variant="contained"
          id="logIn"
          onClick={() => {
            document.dispatchEvent(new CustomEvent("lock"));
          }}
        >
          Return to Game
        </Button>
        {!loggedIn && <ToggleLoginScreen></ToggleLoginScreen>}
        
        {!loggedIn && <ToggleSignUpScreen id="logIn"></ToggleSignUpScreen>}
        {/* <ToggleSignUpScreen id="logIn"></ToggleSignUpScreen> */}
        <Leaderboard></Leaderboard>
        {/* {sharedBool && <title>Shared Works</title>} */}
      </div>
      <div
        id="crosshair"
        style={{ display: (showOverlay && "block") || "none" }}
      >
        <img src={crosshair} width={50} height={50} />
      </div>
    </>
  );
}
