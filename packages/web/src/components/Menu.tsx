import React, { useState, useRef, useEffect } from 'react'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'
import iconBoard from '../images/icon-board.svg'
import Modal from './Modal'
import useBoards from '../hooks/useBoards'

interface ComponentProps {
  menuItems: string[]
}

const Menu = ({ menuItems }: ComponentProps): JSX.Element => {
  const { status, data: boards, error } = useBoards()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[activeIndex])
  const [menuFeedback, setMenuFeedback] = useState<string>('')

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const menuFeedbackRef = useRef<HTMLDivElement | null>(null)

  function handleMenuKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp' || key === ' ') {
      e.preventDefault()
      toggleDialog()
      if (key === 'ArrowDown') {
        setActiveIndex(0)
      }
      if (key === 'ArrowUp') {
        setActiveIndex(menuItems.length - 1)
      }
    }
  }

  function handleMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    toggleDialog()
  }

  function toggleDialog() {
    setDialogOpen(!dialogOpen)
    menuItemsRef.current[activeIndex]?.focus()
  }

  function closeDialog() {
    setDialogOpen(false)
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

  return (
    <>
      <button
        ref={menuButtonRef}
        className='heading-lg'
        aria-haspopup='true'
        aria-expanded={dialogOpen}
        onKeyDown={handleMenuKeydown}
        onClick={handleMenuClick}
      >
        {selectedItem}
        <img
          src={dialogOpen ? iconChevronUp : iconChevronDown}
          aria-hidden='true'
          className='ml-[9px] inline-block'
        />
      </button>
      <Modal
        open={dialogOpen}
        setOpen={setDialogOpen}
        triggerElement={menuButtonRef}
        dialogStyles={{
          top: '80px',
          left: '54px',
          right: '54px',
          transform: 'none',
        }}
      >
        <div
          ref={menuRef}
          role='menu'
          className='flex flex-col items-start whitespace-nowrap bg-white rounded-lg'
        >
          <h2 className='heading-sm text-grey-medium px-6 py-4'>
            ALL BOARDS ({menuItems.length})
          </h2>
          {menuItems.map((item, index) => (
            <button
              key={index}
              value={item}
              ref={(el) => (menuItemsRef.current[index] = el)}
              role='menuitem'
              tabIndex={index === activeIndex ? 0 : -1}
              onKeyDown={handleItemKeydown}
              onClick={handleItemClick}
              className={`text-grey-medium py-3 px-6 ${
                index === activeIndex && 'bg-purple text-white rounded-e-full'
              }`}
            >
              <img src={iconBoard} aria-hidden='true' className='inline-block mr-3' />
              {item}
            </button>
          ))}
        </div>
      </Modal>
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
