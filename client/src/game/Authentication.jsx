import { set_global, get_global } from '../constants'

function getUsername() {
  //return prompt("What is your username?");
  return 'Guest ' + Math.floor(Math.random() * 1000)
}

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
        alert(jsondata.error)
      }
      console.log('signup data:', jsondata)
      localStorage.setItem('token', jsondata.token)

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

      set_global('AUTHENTICATED', true)
      set_global("IN_QUEUE",get_global("IN_QUEUE")) //this is so jank but don't worry about it
    })
}

export async function handleLogin(username, pw) {
  console.log(username)
  console.log(pw)

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
      console.log(jsondata)
      if (jsondata.error) {
        alert(jsondata.error)
        return
      }
      // setSharedBool(true);
      console.log('login token:', jsondata.token)
      localStorage.setItem('token', jsondata.token)
      set_global('AUTHENTICATED', true)

      set_global('BALL', jsondata.ball)
      set_global('PET', jsondata.pet)
      set_global('POINTS', jsondata.points)
      set_global('USERNAME', jsondata.username)
      set_global('ICON', jsondata.icon)
      set_global('OWNED', jsondata.item_array)
      console.log('[TEST]', jsondata.item_array)

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
      console.log('[LOGINTOKEN]', jsondata)
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
      console.log('[TEST]', jsondata.item_array)

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
    // .then(response => response.json())
    // .then(jsondata => {
    //   if (jsondata.error) {
    //     console.log(jsondata.error)
    //     alert(jsondata.error)
    //   }
    //   console.log('signup data:', jsondata)
    //   localStorage.setItem('token', jsondata.token)

    //   set_global('BALL', jsondata.ball)
    //   set_global('PET', jsondata.pet)
    //   set_global('ICON', jsondata.icon)
    // })
}

if (localStorage.getItem('token')) {
  console.log('token login attempt', localStorage.getItem('token'))
  handleTokenLogin()
} else {
  set_global('USERNAME', getUsername())
}
