import React, { useState, useRef, useEffect } from 'react'
import iconChevronDown from '../images/icon-chevron-down.svg'

interface ComponentProps {
  menuItems: string[]
}

const Menu = ({ menuItems }: ComponentProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[0])
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])

  function openMenu(e: React.MouseEvent | React.KeyboardEvent) {
    console.log(e)
    if (e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') {
      setOpen(true)
    }
  }

  function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || 'ArrowUp') {
      moveFocus(e as React.KeyboardEvent)
    }
    if (e.key === 'Enter' || 'Space') {
      // setSelectedItem((e.target as HTMLButtonElement).value)
    }
    if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  function handleItemClick(e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedItem((e.target as HTMLButtonElement).value)
    setOpen(false)
  }

  function moveFocus(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prevIndex) => (prevIndex + 1) % menuItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prevIndex) => (prevIndex - 1 + menuItems.length) % menuItems.length)
    }
  }

  useEffect(() => {
    if (open) {
      menuItemsRef.current[activeIndex]?.focus()
    }
  }, [open, activeIndex])

  return (
    <>
      <button
        className='heading-lg'
        aria-haspopup='true'
        aria-expanded={open}
        onKeyDown={openMenu}
        onClick={openMenu}
      >
        {selectedItem}
        <img src={iconChevronDown} aria-hidden='true' />
      </button>
      <div role='menu' hidden={!open}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            value={item}
            ref={(el) => (menuItemsRef.current[index] = el)}
            role='menuitem'
            tabIndex={index === activeIndex ? 0 : -1}
            className={index === activeIndex ? 'focus:bg-purple' : ''}
            onKeyDown={handleItemKeydown}
            onClick={handleItemClick}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  )
}

export default Menu
