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
} from '@mui/material';
import PropTypes from 'prop-types';



// offset to account for left sidebar
const OFFSET = "300px";

Store.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  availableItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ),
  ownedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onBuy: PropTypes.func.isRequired,
};

function Store({ isOpen, availableItems, ownedItems, onClose, onBuy }) {

  const handleBuy = (item) => {
    onBuy(item);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth style={{marginLeft: OFFSET}}>
      <DialogTitle>Shop</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {availableItems.map((item, index) => (
            <Grid item key={index}>
              <Card style={{ width: 200, height: 300 }}>
                {/* Adjust width and height as needed */}
                <CardMedia
                  component="img"
                  height="140"
                  width="200"
                  image={item.image}
                  alt={item.name}
                  style={ownedItems.includes(item.id) ? { filter: 'grayscale(100%)' } : {}}
                />
                <CardContent>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  {ownedItems.includes(item.id) ? (
                    <Typography variant="caption" color="textSecondary">
                      OWNED
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={ownedItems.includes(item.id)}
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
      </DialogContent>
    </Dialog>
  );
}

export default Store;
