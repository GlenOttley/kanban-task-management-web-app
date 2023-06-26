import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../Context'
import logoMobile from '../images/logo-mobile.svg'
import logoLight from '../images/logo-light.svg'
import logoDark from '../images/logo-dark.svg'
import iconPlus from '../images/icon-add-task-mobile.svg'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import Menu from './BoardSelectMenu'
import useBoard from '../hooks/useBoard'
import iconChevronDown from '../images/icon-chevron-down.svg'
import iconChevronUp from '../images/icon-chevron-up.svg'
import Modal from './Modal'
import BoardDetailMenu from './BoardDetailMenu'

const Nav = (): JSX.Element => {
  const { selectedBoardId, sidebarOpen } = useContext(AppContext)
  const {
    status: selectedBoardStatus,
    data: selectedBoard,
    error: selectedBoardError,
  } = useBoard(selectedBoardId)

  const [boardSelectMenuOpen, setBoardSelectMenuOpen] = useState<boolean>(false)
  const [boardDetailMenuOpen, setBoardDetailMenuOpen] = useState(false)

  const boardSelectMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const boardDetailMenuButtonRef = useRef<HTMLButtonElement | null>(null)

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
            onClick={() => setBoardSelectMenuOpen(!boardSelectMenuOpen)}
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
      <Modal
        open={boardSelectMenuOpen}
        setOpen={setBoardSelectMenuOpen}
        triggerElement={boardSelectMenuButtonRef}
        backdropClass='top-[64px]'
        dialogClass='min-w-[264px] top-4 translate-y-0 max-h-[450px] overflow-y-scroll no-scrollbar'
      >
        <Menu setModalOpen={setBoardSelectMenuOpen} />
      </Modal>

      <div className='relative flex'>
        <button className='btn btn-primary py-[10px] md:btn-lg'>
          <img src={iconPlus} aria-hidden='true' className='md:hidden' />
          <span className='sr-only md:not-sr-only'>+ Add new task</span>
        </button>

        <button
          className='px-4'
          ref={boardDetailMenuButtonRef}
          onClick={() => setBoardDetailMenuOpen(!boardDetailMenuOpen)}
        >
          <img className='h-4' src={iconVerticalEllipsis} aria-hidden='true' />
          <span className='sr-only'>Open menu</span>
        </button>
        {boardDetailMenuOpen && selectedBoard && (
          <BoardDetailMenu
            board={selectedBoard}
            setOpen={setBoardDetailMenuOpen}
            triggerElement={boardDetailMenuButtonRef}
          />
        )}
      </div>
    </header>
  )
}

export default Nav
