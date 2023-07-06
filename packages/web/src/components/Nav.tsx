import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../Context'
import logoMobile from '../images/logo-mobile.svg'
import logoLight from '../images/logo-light.svg'
import logoDark from '../images/logo-dark.svg'
import iconPlus from '../images/icon-add-task-mobile.svg'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import useBoard from '../hooks/useBoard'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'
import BoardOptionsMenu from './BoardOptionsMenu'

const Nav = (): JSX.Element => {
  const {
    selectedBoardId,
    sidebarOpen,
    setNewTaskFormOpen,
    boardSelectMenuOpen,
    setBoardSelectMenuOpen,
    setModalTriggerElement,
  } = useContext(AppContext)
  const {
    status: selectedBoardStatus,
    data: selectedBoard,
    error: selectedBoardError,
  } = useBoard(selectedBoardId)

  const [boardOptionsMenuOpen, setBoardOptionsMenuOpen] = useState<boolean>(false)

  const boardSelectMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const boardOptionsMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const addTaskButtonRef = useRef<HTMLButtonElement | null>(null)

  function handleBoardSelectMenuKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter' || key === 'ArrowDown' || key === 'ArrowUp' || key === ' ') {
      e.preventDefault()
      setBoardSelectMenuOpen(!boardSelectMenuOpen)
    }
  }

  return (
    <header className='top-0 z-20 flex items-center justify-between px-4 py-4 bg-white md:px-6 lg:py-6 dark:bg-grey-dark dark:text-white'>
      <div className='flex items-center gap-4 md:hidden'>
        <img src={logoMobile} alt='Kanban' />
        {selectedBoardStatus === 'loading' ? (
          <span>Loading...</span>
        ) : selectedBoardStatus === 'error' ? (
          <span>Error: {selectedBoardError?.message}</span>
        ) : (
          <button
            ref={boardSelectMenuButtonRef}
            className='heading-lg'
            aria-haspopup='true'
            aria-expanded={boardSelectMenuOpen}
            onKeyDown={handleBoardSelectMenuKeyDown}
            onClick={() => {
              setModalTriggerElement(boardSelectMenuButtonRef)
              setBoardSelectMenuOpen(!boardSelectMenuOpen)
            }}
          >
            {selectedBoard.name}
            <img
              src={boardSelectMenuOpen ? iconChevronUp : iconChevronDown}
              aria-hidden='true'
              className='ml-[9px] inline-block'
            />
          </button>
        )}
      </div>
      {!sidebarOpen && (
        <div className='hidden md:block'>
          <img src={logoDark} alt='Kanban' className='dark:hidden' />
          <img src={logoLight} alt='Kanban' className='hidden dark:block' />
          <span className='w-px'></span>
        </div>
      )}
      <div className='hidden md:block text-[20px] lg:heading-xl font-bold'>
        {selectedBoard?.name}
      </div>

      <div className='relative flex'>
        <button
          ref={addTaskButtonRef}
          className='btn btn-primary py-[10px] md:btn-lg'
          disabled={selectedBoard?.columns?.length === 0}
          onClick={() => {
            setModalTriggerElement(addTaskButtonRef)
            setNewTaskFormOpen(true)
          }}
        >
          <img src={iconPlus} aria-hidden='true' className='md:hidden' />
          <span className='sr-only md:not-sr-only'>+ Add new task</span>
        </button>

        <button
          className='px-4'
          ref={boardOptionsMenuButtonRef}
          onClick={() => setBoardOptionsMenuOpen(!boardOptionsMenuOpen)}
        >
          <img className='h-4' src={iconVerticalEllipsis} aria-hidden='true' />
          <span className='sr-only'>Open menu</span>
        </button>
        {boardOptionsMenuOpen && selectedBoard && (
          <BoardOptionsMenu
            board={selectedBoard}
            setOpen={setBoardOptionsMenuOpen}
            triggerElement={boardOptionsMenuButtonRef}
          />
        )}
      </div>
    </header>
  )
}

export default Nav
