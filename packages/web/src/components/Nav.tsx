import React from 'react'
import logo from '../images/logo-mobile.svg'
import iconPlus from '../images/icon-add-task-mobile.svg'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import Menu from './Menu'

const Nav = (): JSX.Element => {
  return (
    <header className='relative z-20 flex items-center justify-between px-4 py-4 bg-white'>
      <div className='flex gap-4'>
        <img src={logo} />
        <Menu />
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
