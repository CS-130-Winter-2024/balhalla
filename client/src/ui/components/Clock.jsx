import { useEffect, useState } from 'react'
import {
  add_listener,
  get_global,
  set_global,
  remove_listener,
} from '../../constants'
import clockImage from '../../../assets/images/Clock.png'
const clockImageUrl = 'url(' + clockImage + ')'

/**
 * Component for displaying a clock with countdown functionality.
 */
export default function Clock({}) {
  const [time, setTime] = useState(null)
  const [display, setDisplay] = useState(0)
  const [text, setText] = useState('Waiting for players')

  useEffect(() => {
    let listener = add_listener('CURRENT_TIMER', setTime)
    let textListener = add_listener('TIMER_LABEL', setText)
    return () => {
      remove_listener('CURRENT_TIMER', listener)
      remove_listener('TIMER_LABEL', textListener)
    }
  }, [])

  useEffect(() => {
    let tDiff = time - Date.now()
    let ms = tDiff % 1000

    if (get_global('CLOCK_ID')) {
      clearInterval(get_global('CLOCK_ID'))
    }

    if (get_global('TIMEOUT_ID')) {
      clearTimeout(get_global('TIMEOUT_ID'))
    }

    if (time == null) {
      setDisplay('')
      return
    }

    setDisplay(Math.ceil(tDiff / 1000))
    set_global(
      'TIMEOUT_ID',
      setTimeout(() => {
        let tDiff = time - Date.now()
        setDisplay(Math.ceil(tDiff / 1000))
        set_global(
          'CLOCK_ID',
          setInterval(() => {
            let tDiff = time - Date.now()
            setDisplay(Math.ceil(tDiff / 1000))
          }, 1000),
        )
      }, ms),
    )
  }, [time])

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '100px',
        width: '300px',
        backgroundImage: clockImageUrl,
      }}
    >
      <p
        style={{
          width: '100%',
          lineHeight: '55px',
          color: '#ffffff',
          margin: 0,
          textAlign: 'center',
          fontSize: '24px',
        }}
      >
        {text}
      </p>
      <p
        style={{
          width: '100%',
          lineHeight: '10px',
          color: '#ffffff',
          margin: 0,
          textAlign: 'center',
          fontSize: '24px',
        }}
      >
        {display == ''
          ? ''
          : ((display - (display % 60)) / 60).toString() +
            ' : ' +
            (display % 60).toString()}
      </p>
    </div>
  )
}
