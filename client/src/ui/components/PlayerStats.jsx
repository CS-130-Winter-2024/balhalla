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
  const renderStats = () => {
    const rows = []

    for (let i = 0; i < stats.length; i += 3) {
      const rowStats = stats.slice(i, i + 3)

      const row = (
        <Box
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: "row",
            flex:1,
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
                width: '100%',
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ fontWeight: 'bold', color: 'white', fontFamily:"Jorvik", fontSize:"18px" }}
              >
                {key}
              </Typography>
              <div
                style={{
                  width: '50%',
                  height: '1px',
                  backgroundColor: 'white',
                }}
              />
              <Typography variant="subtitle1" style={{ color: "white", fontFamily: "Jorvik", fontSize:"18px" }}>
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
          flex:1,
        }}
      >
        {rows}
      </Box>
    )
  }

  return <Box style={{ flex:1 }}>{renderStats()}</Box>
}

export default PlayerStats
