import React, { useState, useRef, useEffect } from 'react'
import logo from '../images/logo-mobile.svg'
import iconPlus from '../images/icon-add-task-mobile.svg'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import Menu from './Menu'

const Nav = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)

  const firstMenuItemRef = useRef<HTMLButtonElement>(null)

  function openMenu(e: React.MouseEvent | React.KeyboardEvent) {
    console.log(e)
    if (e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') {
      setOpen(true)
    }
  }

  function moveFocus(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      console.log(e.key)
    }
  }

  useEffect(() => {
    if (open) {
      firstMenuItemRef?.current?.focus()
    }
  }, [open])

  const menuItems = ['Platform Launch', 'Marketing Plan', 'Roadmap']

  return (
    <header className='container py-5 flex justify-between items-center'>
      <div className='flex gap-4'>
        <img src={logo} />
        <Menu menuItems={menuItems} />
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
