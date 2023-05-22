import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../App'
import useBoard from '../hooks/useBoard'
import useBoards from '../hooks/useBoards'
import iconBoard from '../images/icon-board.svg'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'
import Modal from './Modal'

const Menu = (): JSX.Element => {
  const context = useContext(AppContext)
  const { selectedBoardId, setSelectedBoardId } = context
  const { status: allBoardsStatus, data: allBoards, error: allBoardsError } = useBoards()
  const {
    status: selectedBoardStatus,
    data: selectedBoard,
    error: selectedBoardError,
  } = useBoard(selectedBoardId)

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
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
      setSelectedBoardId(e.currentTarget.value)
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
    setSelectedBoardId(e.currentTarget.value)
    closeDialog()
  }

  function moveFocus(e: React.KeyboardEvent<HTMLButtonElement>) {
    e.preventDefault()
    setActiveIndex((prevIndex) =>
      e.key === 'ArrowDown' || (!e.shiftKey && e.key === 'Tab')
        ? (prevIndex + 1) % Number(allBoards?.length)
        : (prevIndex - 1 + Number(allBoards?.length)) % Number(allBoards?.length)
    )
  }

  useEffect(() => {
    if (dialogOpen) {
      menuItemsRef.current[activeIndex]?.focus()
    }
  }, [dialogOpen, activeIndex])

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
            aria-expanded={dialogOpen}
            onKeyDown={handleMenuKeydown}
            onClick={handleMenuClick}
          >
            {selectedBoard.name}
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
              className='flex flex-col items-start bg-white rounded-lg whitespace-nowrap'
            >
              <h2 className='px-6 py-4 heading-sm text-grey-medium'>
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
                  className={`text-grey-medium py-3 px-6 ${
                    board._id === selectedBoard._id &&
                    'bg-purple text-white rounded-e-full'
                  }`}
                >
                  <img src={iconBoard} aria-hidden='true' className='inline-block mr-3' />
                  {board.name}
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
      )}
    </>
  )
}

export default Menu
