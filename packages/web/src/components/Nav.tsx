import React from 'react'
import logoMobile from '../images/logo-mobile.svg'
import logoLight from '../images/logo-light.svg'
import logoDark from '../images/logo-dark.svg'
import iconPlus from '../images/icon-add-task-mobile.svg'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import Menu from './Menu'

const Nav = (): JSX.Element => {
  return (
    <header className='top-0 z-20 flex items-center justify-between px-4 py-4 bg-white xl:container md:px-6 dark:bg-grey-dark dark:text-white'>
      <div className='flex items-center gap-4 md:hidden'>
        <img src={logoMobile} alt='Kanban' />
        <Menu />
      </div>
      <div className='hidden md:flex'>
        <img src={logoDark} alt='Kanban' />
      </div>

      <div className='flex'>
        <button className='btn btn-primary py-[10px]'>
          <img src={iconPlus} aria-hidden='true' />
          <span className='sr-only'>Add new task</span>
        </button>
        <button className='px-4'>
          <img className='h-4' src={iconVerticalEllipsis} aria-hidden='true' />
          <span className='sr-only'>Open menu</span>
        </button>
      </div>
    </header>
  )
}

export default Nav
