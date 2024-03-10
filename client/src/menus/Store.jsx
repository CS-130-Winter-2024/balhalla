import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  MenuItem,
  FormControl,
  Select,
  Box,
  Avatar
} from '@mui/material';
import PropTypes from 'prop-types';

// Constants for styling
const fontFamily = 'Roboto, Helvetica, Arial';
const primaryColor = '#1976D2'; // Replace with your desired primary color

// Offset to account for left sidebar
const OFFSET = '300px';

Store.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      type: PropTypes.oneOf(['weapon', 'armor', 'accessory']).isRequired,

    })
  ),
  ownedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      type: PropTypes.oneOf(['weapon', 'armor', 'accessory']).isRequired,

    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onBuy: PropTypes.func.isRequired,
  handleEquip: PropTypes.func.isRequired,
  equippedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      type: PropTypes.oneOf(['weapon', 'armor', 'accessory']).isRequired,
    })).isRequired,
    showAlert: PropTypes.func.isRequired,
    coins: PropTypes.number.isRequired,
    setCoins: PropTypes.func.isRequired
};

// make copy of object
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function Store({ isOpen, availableItems, ownedItems, onClose, onBuy, handleEquip, equippedItems, showAlert, coins, setCoins }) {
  const [currWeapon, setCurrWeapon] = useState(deepCopy(equippedItems[0]));
  const [prevWeapon, setPrevWeapon] = useState(deepCopy(equippedItems[0]));

  const [currArmor, setCurrArmor] = useState(deepCopy(equippedItems[1]));
    const [prevArmor, setPrevArmor] = useState(deepCopy(equippedItems[1]));

const [currAccessory, setCurrAccessory] = useState(deepCopy(equippedItems[2]));
const [prevAccessory, setPrevAccessory] = useState(deepCopy(equippedItems[2]));

  const handleBuy = (item) => {
    onBuy(item);
  };

  const handleEquipChange = (event) => {

    const selectedItemId = event.target.value;
    const selectedOwnedItem = ownedItems.find((item) => item.id === selectedItemId);
    // finds the type of item
    const itemType = selectedOwnedItem.type;
    if (itemType === "weapon") {
      setCurrWeapon(deepCopy(selectedOwnedItem));
    }
    else if (itemType === "armor") {
        setCurrArmor(deepCopy(selectedOwnedItem));
    }
    else if (itemType === "accessory"){
        setCurrAccessory(deepCopy(selectedOwnedItem));
    }
  };

  const canSave = () => {
    const armorChanged = currArmor && (prevArmor === null || currArmor.id !== prevArmor.id);
  const weaponChanged = currWeapon && (prevWeapon === null || currWeapon.id !== prevWeapon.id);
  const accessoryChanged = currAccessory && (prevAccessory === null || currAccessory.id !== prevAccessory.id);
    return armorChanged || weaponChanged || accessoryChanged;
  }

  const handleSave = () => {
    handleEquip(currWeapon, currArmor, currAccessory);
    setPrevWeapon(deepCopy(currWeapon));
    setPrevArmor(deepCopy(currArmor));
    setPrevAccessory(deepCopy(currAccessory));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth style={{ marginLeft: OFFSET}}>
      <DialogTitle style={{ fontFamily, color: primaryColor }}>Shop</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            {/* Left Side: Display available items for purchase */}
            <Grid container spacing={2}>
              {availableItems.map((item, index) => (
                <Grid item key={index} xs={4}>
                  <Card style={{ width: '90%', height: 300 }}>
                    {/* Adjust width and height as needed */}
                    <CardMedia
                      component="img"
                      height="140"
                      width="100%"
                      image={item.image}
                      alt={item.name}
                      style={ownedItems.some((ownedItem) => ownedItem.id === item.id) ? { filter: 'grayscale(100%)' } : {}}
                    />
                    <CardContent style={{ height: "100%" }}>
                      <Box style={{ width: "100%", height: "80%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: 'center' }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="caption" color={primaryColor}> {item.type} </Typography>
                        {ownedItems.some((ownedItem) => ownedItem.id === item.id) ? (
                          <Typography variant="caption" color="textSecondary">
                            OWNED
                          </Typography>
                        ) : (
                            <Box style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "space-around", marginBottom: 20 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={ownedItems.some((ownedItem) => ownedItem.id === item.id)}
                                onClick={() => handleBuy(item)}
                                style={{ width: "30%", maxHeight: "20%" }}
                              >
                                Buy
                              </Button>
                              <Typography variant="subtitle2" style={{ fontFamily, fontWeight: "bold", color: "#C8b273" }}>
                                {item.cost} C
                              </Typography>
                            </Box>
                          )}

                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={4}>
            {/* Right Side: Equip section */}
            <FormControl fullWidth>
              <Typography variant="h6" gutterBottom style={{ fontFamily, color: primaryColor }}>
                Equip Weapon
              </Typography>

              {/* Select for Weapon */}
              <Select value={currWeapon ? currWeapon.id : ''} onChange={handleEquipChange} style={{height: 40, marginBottom: 10}}>

                {ownedItems.filter((e)=> e.type === 'weapon').map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6" gutterBottom style={{ fontFamily, color: primaryColor }}>
                Equip Armor
              </Typography>

              {/* Select for Armor */}
              <Select value={currArmor ? currArmor.id : ''} onChange={handleEquipChange}  style={{height: 40, marginBottom: 10}}>

                {ownedItems.filter((e)=> e.type === 'armor').map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6" gutterBottom style={{ fontFamily, color: primaryColor }}>
                Equip Assessory
              </Typography>

              {/* Select for Assessories */}
              <Select value={currAccessory ? currAccessory.id : ''} onChange={handleEquipChange}  style={{height: 40, marginBottom: 10}}>

                {ownedItems.filter((e)=> e.type === 'accessory').map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                // disabled={!(currentlyEquipped && (prevEquippedItem === null || currentlyEquipped.id !== prevEquippedItem.id))}
                disabled={!canSave()}
                style={{ marginTop: '16px' }}
              >
                Save
              </Button>
              {equippedItems[0] && (
                <Box style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                    Equipped Weapon:
                  </Typography>
                  <Avatar style={{ border: `2px solid ${primaryColor}`, width: '80px', height: '80px' }}>
                    <img
                      src={equippedItems[0].image}
                      alt={equippedItems[0].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Avatar>
                </Box>
              )}
              {equippedItems[1] && (
                <Box style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                    Equipped Armor:
                  </Typography>
                  <Avatar style={{ border: `2px solid ${primaryColor}`, width: '80px', height: '80px' }}>
                    <img
                      src={equippedItems[1].image}
                      alt={equippedItems[1].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Avatar>
                </Box>
              )}
              {equippedItems[2] && (
                <Box style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                    Equipped Accessory:
                  </Typography>
                  <Avatar style={{ border: `2px solid ${primaryColor}`, width: '80px', height: '80px' }}>
                    <img
                      src={equippedItems[2].image}
                      alt={equippedItems[2].name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Avatar>
                </Box>
              )}

            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default Store;
