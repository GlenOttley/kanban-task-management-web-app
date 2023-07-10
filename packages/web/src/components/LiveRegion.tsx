import React, { useContext, useEffect } from 'react'
import { AppContext } from '../Context'

const LiveRegion = () => {
  const { liveFeedback, setLiveFeedback } = useContext(AppContext)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (liveFeedback) {
      timer = setTimeout(() => {
        setLiveFeedback('')
      }, 6000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [liveFeedback])

  return (
    <div role='status' aria-live='polite' className='sr-only'>
      {liveFeedback}
    </div>
  )
}

export default LiveRegion
