import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, BottomNavigation, BottomNavigationAction } from '@mui/material';
import PropTypes from 'prop-types';

TabCarousel.propTypes = {
  index: PropTypes.number.isRequired,
};

const MENU_HEIGHT = window.innerHeight * 0.65;

function TabCarousel({ index }) {
  const items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper style={styles.container}>
      <Carousel index={index} autoPlay={false}>
        <Item1 item={items[0]} />
        <Item2 item={items[1]} />
      </Carousel>

      {/* <BottomNavigation
        value={tabValue}
        onChange={handleTabChange}
        showLabels
        style={styles.bottomNavigation}
      >
        <BottomNavigationAction label="Tab 1" icon={<Button>Icon 1</Button>} />
        <BottomNavigationAction label="Tab 2" icon={<Button>Icon 2</Button>} />
      </BottomNavigation> */}
    </Paper>
  );
}

const styles = {
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "maroon",
    flex: 1,
    position: 'relative',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    minHeight: `${MENU_HEIGHT * 0.15}px`,
    backgroundColor: "orange"
  },
  item: {
    flex: 1,
    alignItems: "center",
    height: `${MENU_HEIGHT * 0.6}px`,
    width: "100%",
    backgroundColor: "green",
  },
};

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

export default TabCarousel;
