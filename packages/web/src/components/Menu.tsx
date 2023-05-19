import React, { useState, useRef, useEffect } from 'react'
import iconChevronDown from '../images/icon-chevron-down.svg'

interface ComponentProps {
  menuItems: string[]
}

const Menu = ({ menuItems }: ComponentProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[0])
  const [menuFeedback, setMenuFeedback] = useState<string>('')
  const menuRef = useRef<HTMLButtonElement | null>(null)
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const menuFeedbackRef = useRef<HTMLDivElement | null>(null)

  function handleMenuKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp' || key === ' ') {
      e.preventDefault()
      setOpen(true)
      if (key === 'Enter' || key === ' ') {
        setActiveIndex(-1)
        open && setOpen(false)
      }
      if (key === 'ArrowDown') {
        setActiveIndex(0)
      }
      if (key === 'ArrowUp') {
        setActiveIndex(menuItems.length - 1)
      }
    }
    if (key === 'Tab') {
      setOpen(false)
    }
  }

  function handleMenuClick() {
    setOpen(!open)
  }

  function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter') {
      setSelectedItem(e.currentTarget.value)
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      moveFocus(e)
    }
    if (key === 'Tab' || key === 'Escape') {
      setOpen(false)
    }
  }

  function handleItemClick(e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedItem(e.currentTarget.value)
    setOpen(false)
  }

  function moveFocus(e: React.KeyboardEvent<HTMLButtonElement>) {
    e.preventDefault()
    setActiveIndex((prevIndex) =>
      e.key === 'ArrowDown'
        ? (prevIndex + 1) % menuItems.length
        : (prevIndex - 1 + menuItems.length) % menuItems.length
    )
  }

  useEffect(() => {
    if (open) {
      menuItemsRef.current[activeIndex]?.focus()
    }
  }, [open, activeIndex])

  useEffect(() => {
    setMenuFeedback(`${selectedItem} selected`)
  }, [selectedItem])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      <button
        className='heading-lg'
        ref={menuRef}
        aria-haspopup='true'
        aria-expanded={open}
        onKeyDown={handleMenuKeydown}
        onClick={handleMenuClick}
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
            onKeyDown={handleItemKeydown}
            onClick={handleItemClick}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        role='alert'
        aria-live='assertive'
        aria-atomic='true'
        className='sr-only'
        ref={menuFeedbackRef}
      >
        {menuFeedback}
      </div>
    </>
  )
}

export default Menu
