import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';

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

  return (
    <Carousel
        index={index}

      autoPlay={false}
    //   navButtonsProps={{
    //     style: {
    //       backgroundColor: 'cornflowerblue',
    //       borderRadius: 0,
    //     },
    //   }}
      navButtonsWrapperProps={{
        style: {
          bottom: '0',
          top: 'unset',
        },
      }}
    //   NextIcon={<Button onClick={handleNext}>Custom Next</Button>}
    //   PrevIcon={<Button onClick={handlePrev}>Custom Prev</Button>}
    >
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </Carousel>
  );
}




function Item(props) {
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      {/* You can customize the button here */}
      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
}

export { TabCarousel, Item };
