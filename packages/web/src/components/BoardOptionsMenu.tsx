import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
} from 'react'
import { AppContext } from '../Context'
import { Board } from '@kanban/types'

interface ComponentProps {
  board: Board
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerElement: MutableRefObject<any>
}

const BoardOptionsMenu = ({ setOpen, triggerElement }: ComponentProps) => {
  const { setEditBoardFormOpen, setConfirmDeleteBoardOpen, setModalTriggerElement } =
    useContext(AppContext)
  const menuRef = useRef<HTMLDivElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  function handleOpenEditBoardForm() {
    setModalTriggerElement(editButtonRef)
    setEditBoardFormOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 1)
  }

  function handleOpenDeleteBoardModal() {
    setModalTriggerElement(deleteButtonRef)
    setConfirmDeleteBoardOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 1)
  }

  useEffect(() => {
    editButtonRef.current?.focus()
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isMenuContentClicked = (menuRef as MutableRefObject<any>)?.current?.contains(
        event.target
      )
      const isTriggerElementClicked = triggerElement?.current?.contains(event.target)
      if (!isMenuContentClicked && !isTriggerElementClicked) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div
      ref={menuRef}
      className='z-10 absolute flex flex-col items-start w-[120px] md:w-48 
      gap-4 p-4 right-0 bg-white rounded-lg whitespace-nowrap top-10 md:top-[55px] lg:top-16 dark:bg-grey-very-dark'
      role='menu'
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <button
        onClick={handleOpenEditBoardForm}
        type='button'
        className='w-full text-left body-lg text-grey-medium'
        ref={editButtonRef}
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === 'Tab') {
            e.preventDefault()
            deleteButtonRef.current?.focus()
          }
        }}
      >
        Edit Board
      </button>
      <button
        onClick={handleOpenDeleteBoardModal}
        type='button'
        className='w-full text-left body-lg text-red'
        ref={deleteButtonRef}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault()
            editButtonRef.current?.focus()
          }
        }}
      >
        Delete Board
      </button>
    </div>
  )
}

export default BoardOptionsMenu
