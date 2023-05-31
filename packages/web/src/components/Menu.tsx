import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../Context'
import useBoard from '../hooks/useBoard'
import useBoards from '../hooks/useBoards'
import iconBoard from '../images/icon-board.svg'
import iconBoardWhite from '../images/icon-board-white.svg'
import iconBoardPurple from '../images/icon-board-purple.svg'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'
import Modal from './Modal'
import NewBoardForm from './NewBoardForm'
import ThemeSwitch from './ThemeSwitch'

const Menu = (): JSX.Element => {
  const { selectedBoardId, setSelectedBoardId } = useContext(AppContext)
  const {
    status: allBoardsStatus,
    data: allBoards,
    error: allBoardsError,
    refetch,
  } = useBoards()
  const {
    status: selectedBoardStatus,
    data: selectedBoard,
    error: selectedBoardError,
  } = useBoard(selectedBoardId)

  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [newBoardOpen, setNewBoardOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [menuFeedback, setMenuFeedback] = useState<string>('')

  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const themeSwitchRef = useRef<HTMLButtonElement>(null)

  // const buttonMap = [...(allBoards || [])]

  function handleMenuKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp' || key === ' ') {
      e.preventDefault()
      toggleDialog()
      // if (key === 'ArrowDown') {
      //   setActiveIndex(0)
      // }
      // if (key === 'ArrowUp') {
      //   setActiveIndex(Number(allBoards?.length) - 1)
      // }
    }
  }

  function handleMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    toggleDialog()
  }

  function toggleDialog() {
    setMenuOpen(!menuOpen)
    menuItemsRef.current[activeIndex]?.focus()
  }

  function closeDialog() {
    setMenuOpen(false)
  }

  function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter') {
      handleItemSelect(e)
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      moveFocus(e)
    } else if (!e.shiftKey && key === 'Tab') {
      setActiveIndex(0)
    } else if (e.shiftKey && key === 'Tab') {
      e.preventDefault()
      themeSwitchRef.current?.focus()
    }
  }

  function handleItemSelect(e: React.KeyboardEvent<HTMLButtonElement>) {
    e.preventDefault()
    setSelectedBoardId(e.currentTarget.value)
    closeDialog()
  }

  function handleItemClick(e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedBoardId(e.currentTarget.value)
    closeDialog()
  }

  function moveFocus(e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) {
    e.preventDefault()
    setActiveIndex((prevIndex) =>
      e.key === 'ArrowDown'
        ? (prevIndex + 1) % Number(allBoards?.length)
        : (prevIndex - 1 + Number(allBoards?.length)) % Number(allBoards?.length)
    )
  }

  function openNewBoardModal() {
    setMenuOpen(false)
    setNewBoardOpen(true)
  }

  useEffect(() => {
    if (menuOpen) {
      menuItemsRef.current[activeIndex]?.focus()
    }
  }, [menuOpen, activeIndex])

  useEffect(() => {
    setActiveIndex(Number(allBoards?.findIndex((board) => board._id === selectedBoardId)))
    setMenuFeedback(`${selectedBoard?.name} selected`)
  }, [selectedBoard, selectedBoardId, allBoards])

  return (
    <>
      {selectedBoardStatus === 'loading' ? (
        <span>Loading...</span>
      ) : selectedBoardStatus === 'error' ? (
        <span>Error: {selectedBoardError?.message}</span>
      ) : (
        <>
          <button
            ref={menuButtonRef}
            className='heading-lg'
            aria-haspopup='true'
            aria-expanded={menuOpen}
            onKeyDown={handleMenuKeydown}
            onClick={handleMenuClick}
          >
            {selectedBoard.name}
            <img
              src={menuOpen ? iconChevronUp : iconChevronDown}
              aria-hidden='true'
              className='ml-[9px] inline-block'
            />
          </button>
          <Modal
            open={menuOpen}
            setOpen={setMenuOpen}
            triggerElement={menuButtonRef}
            dialogStyles={{
              top: '80px',
              transform: 'translateX(-50%)',
              maxHeight: '450px',
              overflowY: 'scroll',
            }}
            dialogClass='rounded-lg min-w-[264px]'
          >
            <div
              ref={menuRef}
              role='menu'
              className='flex flex-col items-stretch pb-4 pr-4 bg-white dark:bg-grey-dark whitespace-nowrap'
            >
              <h2 className='px-6 py-4 heading-sm text-grey-medium' aria-hidden='true'>
                ALL BOARDS ({allBoards?.length})
              </h2>
              {allBoards?.map((board, index) => (
                <button
                  key={index}
                  value={board._id}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                  role='menuitem'
                  tabIndex={index === activeIndex ? 0 : -1}
                  onKeyDown={handleItemKeydown}
                  onClick={handleItemClick}
                  className={`text-grey-medium text-left py-3 px-6 rounded-e-full ${
                    board._id === selectedBoard._id &&
                    'bg-purple text-white rounded-e-full'
                  }
                      ${
                        board._id !== selectedBoard._id &&
                        'group hover:bg-purple hover:bg-opacity-10 hover:text-purple dark:hover:bg-white focus:bg-purple focus:bg-opacity-10 focus:text-purple dark:focus:bg-white'
                      }`}
                >
                  <img
                    src={board._id === selectedBoard._id ? iconBoardWhite : iconBoard}
                    aria-hidden='true'
                    className='inline-block mr-3 group-hover:filter-purple group-focus:filter-purple'
                  />
                  {board.name}
                </button>
              ))}
              <button
                className='px-6 py-3 mb-4 text-left text-purple rounded-e-full hover:bg-purple hover:bg-opacity-10 hover:text-purple dark:hover:bg-white focus:bg-purple focus:bg-opacity-10 focus:text-purple dark:focus:bg-white'
                onClick={openNewBoardModal}
              >
                <img
                  src={iconBoardPurple}
                  aria-hidden='true'
                  className='inline-block mr-3 fill-purple'
                />
                <span aria-hidden='true'>+</span> Create New Board
              </button>

              <div
                className='w-full px-4'
                onKeyDown={(e) => {
                  if (!e.shiftKey && e.key === 'Tab') {
                    e.preventDefault()
                    menuItemsRef.current[0]?.focus()
                  }
                }}
              >
                <ThemeSwitch ref={themeSwitchRef} />
              </div>
            </div>
          </Modal>
          <Modal open={newBoardOpen} setOpen={setNewBoardOpen} dialogClass='container'>
            <div
              role='menu'
              className='flex flex-col items-start bg-white rounded-lg whitespace-nowrap'
            >
              <NewBoardForm setNewBoardOpen={setNewBoardOpen} />
            </div>
          </Modal>
          <div role='alert' aria-live='assertive' aria-atomic='true' className='sr-only'>
            {menuFeedback}
          </div>
        </>
      )}
    </>
  )
}

export default Menu
