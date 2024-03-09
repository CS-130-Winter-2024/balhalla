import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

PlayerStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
}

function PlayerStats({ stats }) {
  console.log('TESTING')
  const renderStats = () => {
    const rows = []
    const numRows = Math.ceil(stats.length / 3)
    const rowHeight = `calc(100% / ${numRows})`

    for (let i = 0; i < stats.length; i += 3) {
      const rowStats = stats.slice(i, i + 3)

      const row = (
        <Box
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            height: rowHeight,
            width: '100%', // Set the width to 100%
          }}
        >
          {rowStats.map(({ key, value }, index) => (
            <Box
              key={index}
              style={{
                flex: '1 1 33.33%',
                padding: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%', // Set the width to 100%
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 'bold', color: 'black' }}
              >
                {key}
              </Typography>
              <div
                style={{
                  width: '50%',
                  height: '1px',
                  backgroundColor: 'black',
                  margin: '4px 0', // Adjust the margin to control the spacing between key and value
                }}
              />
              <Typography variant="subtitle1" style={{ color: '#1976D2' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      )

      rows.push(row)
    }

    return (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        {rows}
      </Box>
    )
  }

  return <Box style={{ width: '100%' }}>{renderStats()}</Box>
}

export default PlayerStats
