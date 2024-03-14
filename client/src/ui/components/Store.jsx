import { useState, useEffect } from 'react'
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
  Avatar,
  DialogActions,
} from '@mui/material'


import {
  BUYABLE_MODELS,
  MODEL_PROPERTIES,
  get_global,
  set_global,
  add_listener,
  remove_listener,
  TEXTURES
} from '../../constants'
const bgUrl = 'url(' + TEXTURES.stone + ')'
const parchUrl = 'url(' + TEXTURES.parchment + ')'

// Constants for styling
const fontFamily = 'Jorvik'
const primaryColor = '#FFFFFF' // Replace with your desired primary color

// Offset to account for left sidebar
const OFFSET = '0px'

// make copy of object

function BuyConfirmationDialog({
  isOpen,
  item,
  remainingBalance,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <Typography>{`You are about to buy ${item.name} for ${item.cost} coins.`}</Typography>
        <Typography>{`Remaining balance: ${remainingBalance} coins.`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(item)} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Store({ isOpen, onClose, showAlert }) {
  const [currWeapon, setCurrWeapon] = useState(get_global('BALL') || 2)
  const [prevWeapon, setPrevWeapon] = useState(get_global('BALL') || 2)

  const [currPet, setCurrPet] = useState(get_global('PET'))
  const [prevPet, setPrevPet] = useState(get_global('PET'))

  const [owned, setOwned] = useState(get_global('OWNED') || [2])
  const [equippedItems, setEquipped] = useState([null, null])

  const [coins, setCoins] = useState(get_global('POINTS') || 0)

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null)
  const [remainingBalance, setRemainingBalance] = useState(
    get_global('POINTS') || 0,
  )

  // useEffect to update values
  useEffect(() => {
    let ownedListener = add_listener('OWNED', setOwned)
    let coinsListener = add_listener('POINTS', setCoins)
    let ballListener = add_listener("BALL",(ball)=>{
      setCurrWeapon(ball)
      setPrevWeapon(ball)
    })
    let petListener = add_listener("PET",(pet)=>{
      setCurrPet(pet)
      setPrevPet(pet)
    })
    let lockedListener = add_listener('LOCKED', x => {
      if (x) onClose()
    })
    return () => {
      remove_listener('WEAPON', ballListener)
      remove_listener('PET', petListener)
      remove_listener('OWNED', ownedListener)
      remove_listener('POINTS', coinsListener)
      remove_listener("LOCKED", lockedListener);
    }
  }, [])

  const handleBuy = item => {
    if (coins < MODEL_PROPERTIES[item].cost) {
      showAlert('You do not have enough points!', 'error')
    }

    //attempt back end call for purchase
    setSelectedItemForPurchase(item)
    setRemainingBalance(coins - MODEL_PROPERTIES[item].cost)
    setShowConfirmationDialog(true)
  }

  const handleEquipChange = (event, type) => {
    const selectedItemId = event.target.value

    switch (type) {
      case 'Weapon':
        setCurrWeapon(selectedItemId)
        break
      case 'Pet':
        setCurrPet(selectedItemId)
        break
    }
  }

  const canSave = () => {
    const weaponChanged = currWeapon != prevWeapon
    const petChanged = currPet != prevPet
    return weaponChanged || petChanged
  }

  const handleSave = () => {
    set_global('BALL', currWeapon)
    set_global('PET', currPet)
    set_global("IN_QUEUE",get_global("IN_QUEUE")) //this is so jank but don't worry about it


    setPrevWeapon(currWeapon)
    setPrevPet(currPet)

    //post to server
    if (!localStorage.getItem("token")) return; //shouldnt happen
    fetch('/update_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        ball: currWeapon,
        pet: currPet,
        icon: get_global("ICON")
      }),
    })
    ///
  }

  const handleConfirmBuy = async (item) => {
    await fetch('/purchase_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        item_id: item,
        item_cost: MODEL_PROPERTIES[item].cost,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          showAlert(
            `You bought ${MODEL_PROPERTIES[item].name} for ${MODEL_PROPERTIES[item].cost} coins`,
            'success',
          )
          setShowConfirmationDialog(false)
          set_global("POINTS",coins-MODEL_PROPERTIES[item].cost)
          setCoins(coins - MODEL_PROPERTIES[item].cost)
          let newOwned = data.itemArray
          console.log("Newowned",newOwned)
          setOwned(newOwned)
          set_global('OWNED', newOwned)
        } else {
          // what to do if item alr bought or not enough coins
          showAlert('Sorry King, you are broke', 'error')
        }
    })
    
  }

  const onCloseDialog = item => {
    setShowConfirmationDialog(false)
    setRemainingBalance(coins + MODEL_PROPERTIES[item].cost)
  }

  const ownedPets = owned
    .filter(e => MODEL_PROPERTIES[e].type === 'Pet')
    .map(item => (
      <MenuItem key={item} value={item} style={{ fontFamily: fontFamily }}>
        {MODEL_PROPERTIES[item].name}
      </MenuItem>
    ))

  const ownedWeapons = owned
    .filter(e => MODEL_PROPERTIES[e].type === 'Weapon')
    .map(item => (
      <MenuItem key={item} value={item} style={{ fontFamily: fontFamily }}>
        {MODEL_PROPERTIES[item].name}
      </MenuItem>
    ))

  return (
    <>
      {showConfirmationDialog && selectedItemForPurchase && (
        <BuyConfirmationDialog
          isOpen={showConfirmationDialog}
          item={MODEL_PROPERTIES[selectedItemForPurchase]}
          remainingBalance={remainingBalance}
          onClose={() => onCloseDialog(selectedItemForPurchase)}
          onConfirm={() => handleConfirmBuy(selectedItemForPurchase)}
        />
      )}

      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        style={{ marginLeft: OFFSET }}
      >
        <DialogTitle
          style={{
            fontFamily,
            color: primaryColor,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '32px',
            backgroundImage: bgUrl,
            backgroundSize: 'cover',
          }}
        >
          Shop
        </DialogTitle>
        <div style={{ borderTop: '3px solid white', width: '100%' }} />
        <DialogContent
          style={{ backgroundImage: bgUrl, backgroundSize: '100% 100%' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {/* Left Side: Display available items for purchase */}
              <Grid container spacing={1}>
                {BUYABLE_MODELS.map((item, index) => {
                  let itemData = MODEL_PROPERTIES[item]
                  return (
                    <Grid item key={index} xs={4}>
                      <Card
                        style={{
                          width: '90%',
                          height: '100%',
                          backgroundImage: parchUrl,
                          backgroundSize: '100% 100%',
                          backgroundColor: 'transparent',
                        }}
                      >
                        {/* Adjust width and height as needed */}
                        <CardMedia
                          component="img"
                          image={itemData.image}
                          alt={itemData.name}
                          style={
                            owned.some(ownedItem => ownedItem == item)
                              ? { filter: 'grayscale(100%)' }
                              : {}
                          }
                        />
                        <CardContent style={{ flex: 2 }}>
                          <Box
                            style={{
                              width: '100%',
                              height: '80%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              style={{
                                fontFamily: fontFamily,
                                fontSize: '18px',
                              }}
                            >
                              {itemData.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              fontFamily={fontFamily}
                              fontSize={'14px'}
                              color={'black'}
                            >
                              {itemData.type}
                            </Typography>
                            {owned.some(ownedItem => ownedItem == item) ? (
                              <Typography
                                variant="caption"
                                fontFamily={fontFamily}
                                fontSize={22}
                                color="textSecondary"
                              >
                                OWNED
                              </Typography>
                            ) : (
                              <Box
                                style={{
                                  display: 'flex',
                                  height: '100%',
                                  width: '100%',
                                  alignItems: 'center',
                                  justifyContent: 'space-around',
                                  marginBottom: 20,
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  disabled={owned.some(
                                    ownedItem => ownedItem == item,
                                  )}
                                  onClick={() => handleBuy(item)}
                                  style={{
                                    maxHeight: '20%',
                                    fontFamily: fontFamily,
                                    backgroundColor: 'black',
                                  }}
                                >
                                  {itemData.cost} P
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid item xs={4}>
              {/* Right Side: Equip section */}
              <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily,
                    color: primaryColor,
                  }}
                >
                  {coins} Points
              </Typography>
              <FormControl fullWidth>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily,
                    color: primaryColor,
                  }}
                >
                  Equip Weapon
                </Typography>

                {/* Select for Weapon */}
                <Select
                  value={currWeapon || ''}
                  onChange={e => {
                    handleEquipChange(e, 'Weapon')
                  }}
                  disabled={ownedWeapons.length == 0}
                  style={{
                    height: 40,
                    marginBottom: 10,
                    backgroundColor: 'white',
                    border: 0,
                    outline: 0,
                    fontFamily: fontFamily,
                    fontSize: 18,
                  }}
                >
                  {ownedWeapons}
                </Select>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    fontFamily,
                    color: primaryColor,
                  }}
                >
                  Equip Pets
                </Typography>

                {/* Select for Accessories */}
                <Select
                  value={currPet || ''}
                  onChange={e => {
                    handleEquipChange(e, 'Pet')
                  }}
                  disabled={ownedPets.length == 0}
                  style={{
                    height: 40,
                    marginBottom: 10,
                    backgroundColor: 'white',
                    border: 0,
                    outline: 0,
                    fontFamily: fontFamily,
                    fontSize: 18,
                  }}
                >
                  <MenuItem
                    key={'none'}
                    value={null}
                    style={{ fontFamily: fontFamily }}
                  >
                    None
                  </MenuItem>
                  {ownedPets}
                </Select>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!canSave()}
                  style={{ marginTop: '16px', display:canSave() ? "inline-flex" : "none", backgroundColor:"white",fontFamily:"Jorvik",color:"black" }}
                >
                  Save
                </Button>
                {equippedItems[0] && (
                  <Box
                    style={{
                      marginTop: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ marginBottom: '8px' }}
                    >
                      Equipped Weapon:
                    </Typography>
                    <Avatar
                      style={{
                        border: `2px solid ${primaryColor}`,
                        width: '80px',
                        height: '80px',
                      }}
                    >
                      <img
                        src={equippedItems[0].image}
                        alt={equippedItems[0].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Avatar>
                  </Box>
                )}
                {equippedItems[1] && (
                  <Box
                    style={{
                      marginTop: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{ marginBottom: '8px' }}
                    >
                      Equipped Pet:
                    </Typography>
                    <Avatar
                      style={{
                        border: `2px solid ${primaryColor}`,
                        width: '80px',
                        height: '80px',
                      }}
                    >
                      <img
                        src={equippedItems[2].image}
                        alt={equippedItems[2].name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Avatar>
                  </Box>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Store
