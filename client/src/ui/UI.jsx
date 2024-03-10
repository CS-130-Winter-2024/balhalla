import { useEffect, useState } from "react";
import "./ui.css";
import crosshair from "./crosshair.svg";
import Button from "@mui/material/Button";
import Store from "../menus/Store";

function handleLogin() {
  setLoginClicked(true);
}
// CURRENTLY ONLY TESTING SIGNUP/LOGIN
async function handleSignup() {
  let admin = "test2";
  let pw = "12345";
  console.log(location);
  await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then((response) => {console.log("test"); return response.json()})
    .then((data) => console.log("signup data:", data));

  await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("login token:", data.token));
}

function DisplayComponent() {
  return (
    <div>
      <h2>This is the displayed component!</h2>
      <p>Replace this with your desired content.</p>
    </div>
  );
}




export default function UI({showAlert}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Hello World");
  const [loginClicked, setLoginClicked] = useState(false);


  // START: Giang's stuff
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }



  const [showStore, setShowStore] = useState(true);
  const ITEMS_MAP = [
    { id: 1, type: 'weapon', cost: 200, name: 'Frostmourne', image: 'https://cdn.discordapp.com/attachments/371115539365494794/1216243141296914432/il_570xN.png?ex=65ffadb1&is=65ed38b1&hm=1f39c8935a44029669b98b238476b0b0527b3b38ded791244a73b2ef0b9c4c64&' },
    { id: 2, type: 'weapon', cost: 30, name: 'Master Sword', image: 'https://cdn.discordapp.com/attachments/371115539365494794/1216243316409241750/1_51e42ba9-bb2a-4d76-bd31-2e3e9125b043_1200x.png?ex=65ffaddb&is=65ed38db&hm=f0d74a63a49f6c79f495143cd90e4e98552d43b7fcf1c288f1a11c6ae057f092&' },
    { id: 3, type: 'accessory', cost: 150, name: 'Omnitrix', image: 'https://cdn.discordapp.com/attachments/371115539365494794/1216243518641672302/ben-10-omnitrix-3d-model-83155920b5.png?ex=65ffae0b&is=65ed390b&hm=9aefefd4c18fb88da3c60fe16e71a9358d73ef116660540baa95945f6a013e57&' },
    { id: 4, type: 'armor', cost: 25, name: 'Levi Gear', image: 'https://cdn.discordapp.com/attachments/371115539365494794/1216243824943304725/DSC05199-12.png?ex=65ffae54&is=65ed3954&hm=be899a93ee994773b52e7ffa85e356309c61b8c40d803ef498d534a2a4b4c2cf&'},
    {id: 5, type: 'accessory', cost: 35, name: 'Kaiba Duel Disk', image: 'https://cdn.discordapp.com/attachments/371115539365494794/1216243947253399612/Battle20City20Duel20Disk201.png?ex=65ffae71&is=65ed3971&hm=b9a22ef0763703a0f02fc0f891e89ae3e261fd846a9e3fe9e314d8b84e0c1da9&'}
  ];

  // array of item objects
  const [allItems, setAllItems] = useState(deepCopy(ITEMS_MAP));
  const [equippedItems, setEquippedItems] = useState([null, null, null]); // 0 is weapon, 1 is armor, 2 is accessory
  const [ownedItems, setOwnedItems] = useState([]);
  const [coins, setCoins] = useState(1000); // default 1000 coins

  // useEffect to set default values based on endpoint
  useEffect(() => {
    setAllItems(deepCopy(ITEMS_MAP));
    setOwnedItems([]);
    setEquippedItems([null, null, null]);
    setCoins(1000);
  }, []);


  // update the backend with the new owned items
  useEffect(() => {

  }, [ownedItems, equippedItems, coins]);


  const handleBuy = (item) => {
    console.log(`Buying ${item.name} with id ${item.id}`);
    const newlyOwnedItems = deepCopy(ownedItems);

    // check if any item with the same id is already owned
    if (newlyOwnedItems.find((ownedItem) => ownedItem.id === item.id)) {
      console.log('Item already owned');
      return;
    }
    newlyOwnedItems.push(item);
    setOwnedItems(newlyOwnedItems);
  }

  const handleClose = () => {
    setShowStore(false);
  };

  const handleEquip = (weapon, armor, accessory) => {
    setEquippedItems(deepCopy([weapon, armor, accessory]));
  }
  // END Giang's stuff

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
      {/* START: Giang's stuff */}
          <Store isOpen={showStore}
            availableItems={allItems} 
            ownedItems={ownedItems} 
            onClose={handleClose}
            onBuy={handleBuy}
            equippedItems={equippedItems}
            handleEquip={handleEquip}
            showAlert={showAlert}
            coins={coins}
            setCoins={setCoins}
      />
      {/* END: Giang's stuff */}
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
        <Button variant="outlined" id="logIn" onClick={handleLogin}>
          Log In
        </Button>
        {loginClicked && <DisplayComponent />}
        <Button variant="outlined" id="logIn" onClick={handleSignup}>
          Sign Up
        </Button>
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
