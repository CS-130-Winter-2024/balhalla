import { set_global, get_global } from '../constants'

/**
 * Generates a guest username in the format 'Guest [random number]'.
 *
 * @returns {string} A guest username.
 */
function getUsername() {
  //return prompt("What is your username?");
  return 'Guest ' + Math.floor(Math.random() * 1000)
}

/**
 * Handles the user signup process by sending a POST request to the server with the provided username and password. Ensures both user-entered passwords match. The token is saved as a cookie. The following values retrieved from Response object are set as global constants:
 * {
 *  {string} username,
 *  {integer} ball,
 *  {integer} pet,
 *  {integer} icon,
 *  {integer[]} item_array,
 *  {integer} points,
 *  {
 *    {integer} wins,
 *    {integer} losses,
 *    {integer} hits,
 *    {float} winrate,
 *    {integer} games,
 *    {float} hitrate,
 *  }
 * }
 *
 * @async
 * @param {string} username - The username entered by the user.
 * @param {string} pw - The password entered by the user.
 * @param {string} conf_pw - The confirmed password entered by the user.
 */
export async function handleSignup(username, pw, conf_pw) {
  // check if pw is same as conf_pw
  if (pw !== conf_pw) {
    alert('Passwords do not match. Please try again with matching passwords.')
  }

  await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then(response => response.json())
    .then(jsondata => {
      if (jsondata.error) {
        console.log(jsondata.error)
      }
      localStorage.setItem('token', jsondata.token)

      set_global('USERNAME', jsondata.username)
      set_global('BALL', jsondata.ball)
      set_global('PET', jsondata.pet)
      set_global('ICON', jsondata.icon)
      set_global('OWNED', jsondata.item_array)
      set_global('POINTS', jsondata.points)
      const { wins, losses, hits } = jsondata
      set_global('STATS', {
        Wins: wins,
        Losses: losses,
        Hits: hits,
        Winrate: parseFloat(((wins / (wins + losses)) * 100).toFixed(2)),
        Games: wins + losses,
        Hitrate: parseFloat(((hits / (wins + losses)) * 100).toFixed(2)),
      })

      set_global('AUTHENTICATED', true)
      set_global("IN_QUEUE",get_global("IN_QUEUE")) //this is so jank but don't worry about it
    })
}

/**
 * Handles the user login process by sending a POST request to the server with the provided username and password. The following values retrieved from Response object are set as global constants if username and password are correctly matched:
 * {
 *  {string} username,
 *  {integer} ball,
 *  {integer} pet,
 *  {integer} icon,
 *  {integer[]} item_array,
 *  {integer} points,
 *  {
 *    {integer} wins,
 *    {integer} losses,
 *    {integer} hits,
 *    {float} winrate,
 *    {integer} games,
 *    {float} hitrate,
 *  }
 * }
 *
 * @async
 * @param {string} username - The username entered by the user.
 * @param {string} pw - The password entered by the user.
 */
export async function handleLogin(username, pw) {

  await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then(response => response.json())
    .then(jsondata => {
      if (jsondata.error) {
        console.log(jsondata.error)
        return
      }
      // setSharedBool(true);
      localStorage.setItem('token', jsondata.token)
      set_global('AUTHENTICATED', true)

      set_global('BALL', jsondata.ball)
      set_global('PET', jsondata.pet)
      set_global('POINTS', jsondata.points)
      set_global('USERNAME', jsondata.username)
      set_global('ICON', jsondata.icon)
      set_global('OWNED', jsondata.item_array)

      const { wins, losses, hits } = jsondata
      set_global('STATS', {
        Wins: wins,
        Losses: losses,
        Hits: hits,
        Winrate: parseFloat(((wins / (wins + losses)) * 100).toFixed(2)),
        Games: wins + losses,
        Hitrate: parseFloat(((hits / (wins + losses)) * 100).toFixed(2)),
      })

      set_global("IN_QUEUE",get_global("IN_QUEUE")) //this is so jank but don't worry about it
    })
}

/**
 * Handles the user login process by sending a POST request to the server with the stored token at page load. The following values retrieved from Response object are set as global constants if username and password are correctly matched:
 * {
 *  {string} username,
 *  {integer} ball,
 *  {integer} pet,
 *  {integer} icon,
 *  {integer[]} item_array,
 *  {integer} points,
 *  {
 *    {integer} wins,
 *    {integer} losses,
 *    {integer} hits,
 *    {float} winrate,
 *    {integer} games,
 *    {float} hitrate,
 *  }
 * }
 *
 * @async
 * @param {string} tokem - The user's token stored as a cookie.
 * @returns {boolean} True - if the token exists and is valid. False - otherwise.
 */
export async function handleTokenLogin() {
  await fetch('/token_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: localStorage.getItem('token'),
    }),
  })
    .then(response => response.json())
    .then(jsondata => {
      if (jsondata.error) {
        set_global('USERNAME', getUsername())
        localStorage.removeItem('token')
        return
      }

      set_global('AUTHENTICATED', true)

      set_global('BALL', jsondata.ball)
      set_global('PET', jsondata.pet)
      set_global('POINTS', jsondata.points)
      set_global('USERNAME', jsondata.username)
      set_global('ICON', jsondata.icon)
      set_global('OWNED', jsondata.item_array)

      const { wins, losses, hits } = jsondata
      set_global('STATS', {
        Wins: wins,
        Losses: losses,
        Hits: hits,
        Winrate: parseFloat(((wins / (wins + losses)) * 100).toFixed(2)),
        Games: wins + losses,
        Hitrate: parseFloat(((hits / (wins + losses)) * 100).toFixed(2)),
      })

      set_global("IN_QUEUE",get_global("IN_QUEUE")) //this is so jank but don't worry about it
      return true
    })
}

/**
 * Sends a POST request to the server to retrieve and update the user's ball, pet, and icon items.
 *
 * @async
 * @param {number} ball - The new ball item for the user.
 * @param {number} pet - The new pet item for the user.
 * @param {number} icon - The new icon item for the user.
 */
export async function handleItemUpdates(ball, pet, icon) {
  await fetch('/update_items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: localStorage.getItem('token'),
      ball: ball,
      pet: pet,
      icon: icon,
    }),
  })
}

if (localStorage.getItem('token')) {
  console.log('token login attempt', localStorage.getItem('token'))
  handleTokenLogin()
} else {
  set_global('USERNAME', getUsername())
}
