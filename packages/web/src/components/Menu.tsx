import React, { useState, useRef, useEffect } from 'react'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'

interface ComponentProps {
  menuItems: string[]
}

const Menu = ({ menuItems }: ComponentProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[activeIndex])
  const [menuFeedback, setMenuFeedback] = useState<string>('')

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const menuFeedbackRef = useRef<HTMLDivElement | null>(null)

  function handleMenuKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp' || key === ' ') {
      e.preventDefault()
      openDialog()
      if (key === 'ArrowDown') {
        setActiveIndex(0)
      }
      if (key === 'ArrowUp') {
        setActiveIndex(menuItems.length - 1)
      }
    }
  }

  function openDialog() {
    setDialogOpen(true)
    dialogRef.current?.show()
    menuItemsRef.current[activeIndex]?.focus()
  }

  function closeDialog() {
    setDialogOpen(false)
    dialogRef?.current?.close()
  }

  function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter') {
      e.preventDefault()
      setSelectedItem(e.currentTarget.value)
      closeDialog()
    }
    if (
      key === 'ArrowDown' ||
      key === 'ArrowUp' ||
      key === 'Tab' ||
      (e.shiftKey && key === 'Tab')
    ) {
      moveFocus(e)
    }
  }

  function handleItemClick(e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedItem(e.currentTarget.value)
    closeDialog()
  }

  function moveFocus(e: React.KeyboardEvent<HTMLButtonElement>) {
    e.preventDefault()
    setActiveIndex((prevIndex) =>
      e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')
        ? (prevIndex + 1) % menuItems.length
        : (prevIndex - 1 + menuItems.length) % menuItems.length
    )
  }

  useEffect(() => {
    if (dialogOpen) {
      menuItemsRef.current[activeIndex]?.focus()
    }
  }, [dialogOpen, activeIndex])

  useEffect(() => {
    setMenuFeedback(`${selectedItem} selected`)
  }, [selectedItem])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        menuRef.current &&
        menuButtonRef.current &&
        !menuRef.current.contains(target) &&
        target !== menuButtonRef.current
      ) {
        closeDialog()
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
        ref={menuButtonRef}
        className='heading-lg'
        aria-haspopup='true'
        aria-expanded={dialogOpen}
        onKeyDown={handleMenuKeydown}
        onClick={openDialog}
      >
        {selectedItem}
        <img
          src={dialogOpen ? iconChevronUp : iconChevronDown}
          aria-hidden='true'
          className='ml-[9px] inline-block'
        />
      </button>
      <dialog ref={dialogRef}>
        <div ref={menuRef} role='menu' className='flex flex-col'>
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
      </dialog>
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
