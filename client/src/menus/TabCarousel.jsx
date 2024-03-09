import { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, TextField, Box } from '@mui/material';
import PropTypes from 'prop-types';
import SettingsTabContent from './TabSettingsContent';

TabCarousel.propTypes = {
  index: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
};

function TabCarousel({ index, menuHeight }) {

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
  };

  const items = [
    {
      name: 'Random Name #1',
      description: 'Probably the most random thing you have ever seen!',
    },
    {
      name: 'Random Name #2',
      description: 'Hello World!',
    },
  ];

  function Item1(props) {
    return (
      <Paper style={styles.item}>
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>
        <Button className="CheckButton">Check it out!</Button>
      </Paper>
    );
  }
  
  function Item2(props) {
    return (
        <Paper style={styles.item}>
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>
        <Button className="CheckButton">Check it out!</Button>
        <h2>{props.item.name}</h2>
        <h2>{props.item.name}</h2>
      </Paper>
    );
  }

  return (
    <Paper style={styles.container}>
      <Carousel index={index} autoPlay={false} indicatorIconButtonProps={{ style: { display: 'none' } }}>
        {/* <Item1 item={items[0]} menuHeight={menuHeight} /> */}
        <SettingsTabContent height={menuHeight} />
        <Item2 item={items[1]} menuHeight={menuHeight} />
      </Carousel>
    </Paper>
  );
}



  

export default TabCarousel;
