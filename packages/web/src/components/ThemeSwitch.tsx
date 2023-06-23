import React, { forwardRef, useContext, useEffect } from 'react'
import { AppContext } from '../Context'
import iconLightTheme from '../images/icon-light-theme.svg'
import iconDarkTheme from '../images/icon-dark-theme.svg'

const ThemeSwitch = forwardRef<HTMLButtonElement>((props, ref): JSX.Element => {
  const { darkMode, setDarkMode } = useContext(AppContext)

  function toggle() {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    localStorage.setItem('dark', darkMode.toString())
  }, [darkMode])

  return (
    <div className='flex justify-center items-center gap-6 bg-grey-light dark:bg-grey-very-dark py-[14px] w-full rounded-md'>
      <img src={iconLightTheme} alt='light mode' />
      <button
        ref={ref}
        aria-pressed={darkMode}
        onClick={toggle}
        className='relative inline-block w-10 h-5 group'
      >
        <span
          className={` rounded-full absolute cursor-pointer inset-0 bg-purple hover:bg-purple-hover duration-300 
          before:rounded-full before:absolute before:h-[14px] before:w-[14px] before:left-[3px] before:bottom-[3px] 
          before:bg-white before:duration-300  ${darkMode && 'before:translate-x-5'}`}
        />
        <span className='sr-only'>Dark mode</span>
      </button>
      <img src={iconDarkTheme} alt='dark mode' />
    </div>
  )
})

export default ThemeSwitch
