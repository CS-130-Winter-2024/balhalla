import { Typography, Paper } from '@mui/material';
import PropTypes from 'prop-types';


TabInstructionsContent.propTypes = {
  text: PropTypes.string.isRequired,
};

function TabInstructionsContent({ text }) {
  const styles = {
    container: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      width: '100%',
      backgroundColor: 'lightblue', 
      padding: '20px',
    },
    header: {
      ...textStyle(3, true), 
      borderBottom: '2px solid #1976D2', 
    },
    content: {
      ...textStyle(2), 
      marginTop: '10px',
      whiteSpace: 'pre-line',
      lineHeight: '1',
    },
  };

  const renderTextWithBold = () => {
    const parts = text.split(/(\{[^}]*\})/); 
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        // Regular text
        return <span key={index}>{part}</span>;
      } else {
        // Bolded text
        return (
          <span key={index} style={{ fontWeight: 'bold' }}>
            {part}
          </span>
        );
      }
    });
  };

  return (
    <Paper style={styles.container}>
      <Typography variant="h5" style={styles.header}>
        Instructions
      </Typography>
      <Typography variant="body1" style={styles.content}>
        {renderTextWithBold()}
      </Typography>
    </Paper>
  );
}



function textStyle(size = 3, bolded = false, color = 'black') {
  if (size < 0 || size > 6) {
    console.error('Invalid size for textStyle');
    return;
  }
  const fontSizeMapping = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '40px',
  ];

  return {
    color: color,
    fontFamily: 'Roboto, Helvetica, Arial',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  };
}

export default TabInstructionsContent;
