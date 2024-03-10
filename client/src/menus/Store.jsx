import React, { useState } from 'react';
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
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ),
  ownedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onBuy: PropTypes.func.isRequired,
};

function Store({ isOpen, availableItems, ownedItems, onClose, onBuy }) {
  const [equippedItem, setEquippedItem] = useState(null);

  const handleBuy = (item) => {
    onBuy(item);
  };

  const handleEquipChange = (event) => {
    const selectedItemId = event.target.value;
    const selectedOwnedItem = ownedItems.find((item) => item.id === selectedItemId);
    setEquippedItem(selectedOwnedItem);
  };

  const handleSave = () => {
    // Implement save functionality here with the equippedItem
    // You can use equippedItem for further logic or API calls
    console.log('Equipped Item:', equippedItem);
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
                    <CardContent>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      {ownedItems.some((ownedItem) => ownedItem.id === item.id) ? (
                        <Typography variant="caption" color="textSecondary">
                          OWNED
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={ownedItems.some((ownedItem) => ownedItem.id === item.id)}
                          onClick={() => handleBuy(item)}
                        >
                          Buy
                        </Button>
                      )}
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
              <Select value={equippedItem ? equippedItem.id : ''} onChange={handleEquipChange}>
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
                disabled={!equippedItem}
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
