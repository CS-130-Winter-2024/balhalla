import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Slider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  MenuItem,
  FormControl,
  Select,
  Box
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
    })
  ),
  ownedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onBuy: PropTypes.func.isRequired,
  onEquip: PropTypes.func.isRequired,
  equippedItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
  }),
};

// make copy of object
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const TYPE_MAP = [
    'weapon',
    'weapon',
    'accessory',
    'armor',
    'weapon',
]

function Store({ isOpen, availableItems, ownedItems, onClose, onBuy, onEquip, equippedItem }) {
  const [currentlyEquipped, setCurrentlyEquipped] = useState(deepCopy(equippedItem));
  const [prevEquippedItem, setPrevEquippedItem] = useState(deepCopy(currentlyEquipped));
  const ITEMS_COUNT = availableItems.length;

  const handleBuy = (item) => {
    onBuy(item);
  };

  const handleEquipChange = (event) => {
    const selectedItemId = event.target.value;
    const selectedOwnedItem = ownedItems.find((item) => item.id === selectedItemId);
    setCurrentlyEquipped(deepCopy(selectedOwnedItem));
    console.log('Selected item:', selectedOwnedItem)
    console.log('Currently equipped:', currentlyEquipped)
    console.log('Prev equipped:', prevEquippedItem)
  };

  const handleSave = () => {
    if (currentlyEquipped && (prevEquippedItem === null || currentlyEquipped.id !== prevEquippedItem.id)) {
      onEquip(deepCopy(currentlyEquipped));
      setPrevEquippedItem(deepCopy(currentlyEquipped));
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth style={{ marginLeft: OFFSET }}>
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
                    <CardContent style={{height: "100%"}}>
                        <Box style={{width: "100%", height: "80%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: 'center'}}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="caption" color={primaryColor}> {TYPE_MAP[item.id % ITEMS_COUNT]} </Typography>
                      {ownedItems.some((ownedItem) => ownedItem.id === item.id) ? (
                        <Typography variant="caption" color="textSecondary">
                          OWNED
                        </Typography>
                      ) : (
                        <Box style={{display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "space-around", marginBottom: 20}}> 
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={ownedItems.some((ownedItem) => ownedItem.id === item.id)}
                          onClick={() => handleBuy(item)}
                          style={{width: "30%", maxHeight: "20%"}}
                        >
                          Buy
                        </Button>
                        <Typography variant="subtitle2"  style={{fontFamily, fontWeight: "bold", color: "#C8b273"}}>
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
                Equip Item
              </Typography>
              <Select value={currentlyEquipped ? currentlyEquipped.id : ''} onChange={handleEquipChange}>
                {ownedItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!(currentlyEquipped && (prevEquippedItem === null || currentlyEquipped.id !== prevEquippedItem.id))}
                style={{ marginTop: '16px' }}
              >
                Save
              </Button>
              
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default Store;
