import React, { useEffect, useContext } from 'react'
import iconSuccess from '../images/icon-success.svg'
import iconWarning from '../images/icon-warning.svg'
import iconInfo from '../images/icon-info.svg'
import { AppContext } from '../Context'

export interface Toast {
  message: string
  status?: 'success' | 'info' | 'warning'
  duration?: number
}

const Toast = (): JSX.Element | null => {
  const {
    toastDetails: { message, status, duration },
    setToastDetails,
    sidebarOpen,
  } = useContext(AppContext)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (message) {
      timer = setTimeout(() => {
        setToastDetails({ message: '' })
      }, duration || 6000)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [message])

  return (
    <div
      role='status'
      aria-live='polite'
      className={`absolute z-20 bottom-8 left-4 right-4 transition-opacity ease-in-out duration-300 ${
        message ? 'opacity-100' : 'opacity-0'
      }
      ${sidebarOpen ? '' : ''}
      `}
    >
      <div
        className={`bg-white py-3 px-4 rounded-md border-l-[8px] flex items-center gap-4 shadow-lg  ${
          status === 'success'
            ? 'border-purple'
            : status === 'warning'
            ? 'border-red'
            : 'border-grey-dark'
        }`}
      >
        <img
          src={
            status === 'success'
              ? iconSuccess
              : status === 'warning'
              ? iconWarning
              : iconInfo
          }
          aria-hidden='true'
          className='inline-block'
        />
        <span className='sr-only'>{status}</span>
        <p className='body-lg'>{message}</p>
      </div>
    </div>
  )
}

export default Toast
