import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AppContext } from '../Context'
import useBoard from '../hooks/useBoard'
import useBoards from '../hooks/useBoards'
import iconBoard from '../images/icon-board.svg'
import iconBoardWhite from '../images/icon-board-white.svg'
import iconBoardPurple from '../images/icon-board-purple.svg'
import ThemeSwitch from './ThemeSwitch'

interface ComponentProps {
  setModalOpen?: Dispatch<SetStateAction<boolean>>
}

const BoardSelectMenu = ({ setModalOpen }: ComponentProps): JSX.Element => {
  const {
    selectedBoardId,
    setSelectedBoardId,
    setLiveFeedback,
    sidebarOpen,
    setSidebarOpen,
    setNewBoardFormOpen,
  } = useContext(AppContext)
  const { data: allBoards } = useBoards()
  const { data: selectedBoard } = useBoard(selectedBoardId)

  const [activeIndex, setActiveIndex] = useState<number>(0)
  // const [menuFeedback, setMenuFeedback] = useState<string>('')

  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
  const themeSwitchRef = useRef<HTMLButtonElement>(null)

  function closeMenu() {
    setModalOpen && setModalOpen(false)
    sidebarOpen && setSidebarOpen(false)
  }

  function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const { key } = e
    if (key === 'Enter') {
      handleItemSelect(e)
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      moveFocus(e)
    } else if (!e.shiftKey && key === 'Tab' && setModalOpen) {
      setActiveIndex(0)
    } else if (e.shiftKey && key === 'Tab' && setModalOpen) {
      e.preventDefault()
      themeSwitchRef.current?.focus()
    }
  }

  function handleItemSelect(
    e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault()
    setSelectedBoardId(e.currentTarget.value)
    localStorage.setItem('selectedBoardId', e.currentTarget.value)
    setLiveFeedback(`${selectedBoard?.name} selected`)
    closeMenu()
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
    setNewBoardFormOpen(true)
    closeMenu()
  }

  useEffect(() => {
    menuItemsRef.current[activeIndex]?.focus()
  }, [activeIndex])

  useEffect(() => {
    setActiveIndex(Number(allBoards?.findIndex((board) => board._id === selectedBoardId)))
  }, [selectedBoard, selectedBoardId, allBoards])

  return (
    <>
      <div
        ref={menuRef}
        role='menu'
        className='flex flex-col items-stretch pb-4 pr-4 bg-white rounded-md dark:bg-grey-dark whitespace-nowrap md:pr-5'
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
            onClick={handleItemSelect}
            className={`text-grey-medium text-left py-3 px-6 rounded-e-full ${
              board._id === selectedBoard?._id && 'bg-purple text-white rounded-e-full'
            }
                ${
                  board._id !== selectedBoard?._id &&
                  'group hover:bg-purple hover:bg-opacity-10 hover:text-purple dark:hover:bg-white focus:bg-purple focus:bg-opacity-10 focus:text-purple dark:focus:bg-white'
                }`}
          >
            <img
              src={board._id === selectedBoard?._id ? iconBoardWhite : iconBoard}
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
          className='w-full px-4 md:hidden'
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === 'Tab' && setModalOpen) {
              e.preventDefault()
              menuItemsRef.current[0]?.focus()
            }
          }}
        >
          <ThemeSwitch ref={themeSwitchRef} />
        </div>
      </div>

      {/* <div role='alert' aria-live='assertive' aria-atomic='true' className='sr-only'>
        {menuFeedback}
      </div> */}
    </>
  )
}

export default BoardSelectMenu
