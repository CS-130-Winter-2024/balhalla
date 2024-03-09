import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import PropTypes from 'prop-types'
import SettingsTabContent from './TabSettingsContent'

TabCarousel.propTypes = {
  index: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  showAlert: PropTypes.func.isRequired,
}

function TabCarousel({ index, menuHeight, showAlert }) {
  const styles = {
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: 'maroon',
      flex: 1,
      position: 'relative',
    },
    item: {
      flex: 1,
      alignItems: 'center',
      height: `${menuHeight * 0.7 * 0.6}px`,
      width: '100%',
      backgroundColor: 'green',
    },
  }

  function Item2() {
    return (
      <Paper style={styles.item}>
        <h2>goo goo </h2>
        <p>ga ga?</p>
        <Button className="CheckButton">Check it out!</Button>
        <h2>GOOOOOOOOOOOOOOO</h2>
        <h2>Harambe</h2>
      </Paper>
    )
  }

  return (
    <Paper style={styles.container}>
      <Carousel
        index={index}
        autoPlay={false}
        indicatorIconButtonProps={{ style: { display: 'none' } }}
      >
        {/* <Item1 item={items[0]} menuHeight={menuHeight} /> */}
        <SettingsTabContent height={menuHeight} showAlert={showAlert} />
        <Item2 />
      </Carousel>
    </Paper>
  )
}

export default TabCarousel
