// SettingsTabContent.jsx
import React from 'react';
import { Button, Box, Typography } from '@mui/material';

const styles = {
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'maroon',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  keybindBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    backgroundColor: 'lightblue',
  },
  leftSide: {
    height: '100%',
    display: "flex",
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'pink',
    marginBottom: '20px',
  },
  rightSide: {
    height: '100%',
    display: "flex",
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'orange',
  },
  keybindButton: {
    fontWeight: 'bold',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  keybindDescription: {
    backgroundColor: 'lightgrey',
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  saveButton: {
    marginTop: '20px',
    width: '150px',
  },
};

function textStyle(size = 3, bolded = false, color = 'black') {
  if (size < 0 || size > 6) {
    console.error('Invalid size for textStyle');
    return;
  }
  const fontSizeMapping = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px'];

  return {
    color: color,
    fontFamily: 'Roboto, Helvetica, Arial',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  };
}

function SettingsTabContent({ height }) {
  const keybinds = [
    { key: 'W', description: 'Up' },
    { key: 'A', description: 'Left' },
    { key: 'S', description: 'Down' },
    { key: 'D', description: 'Right' },
    { key: 'TAB', description: 'Throw' },
  ];

  const handleSave = () => {
    // Implement logic to save keybinds
    console.log('Keybinds saved:', keybinds);
  };

  return (
    <Box style={styles.container}>
      <Typography variant="h4" gutterBottom style={textStyle(3, true)}>
        Settings
      </Typography>

      <Box style={styles.keybindBody}> 
        <Box style={styles.leftSide}>
          {keybinds.map(({ key }) => (
            <Button key={key} variant="outlined" style={styles.keybindButton}>
              {key}
            </Button>
          ))}
        </Box>

        <Box style={styles.rightSide}>
          {keybinds.map(({ key, description }) => (
            <Box key={key} style={styles.keybindDescription}>
              <Typography variant="body2" style={textStyle(3, false, "#1976d2")}>
                {description}
              </Typography>
              <Button variant="outlined" style={styles.transparentButton}></Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Button variant="contained" onClick={handleSave} style={styles.saveButton}>
        Save Keybinds
      </Button>
    </Box>
  );
}

export default SettingsTabContent;
