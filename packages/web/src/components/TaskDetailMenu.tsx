import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { AppContext } from '../Context'

interface ComponentProps {
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerElement: MutableRefObject<any>
}

const TaskDetailMenu = ({ setOpen, triggerElement }: ComponentProps) => {
  const { setEditTaskFormOpen, setTaskDetailOpen, setConfirmDeleteTaskOpen } =
    useContext(AppContext)

  const menuRef = useRef<HTMLDivElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  function handleDeleteTask() {
    setTaskDetailOpen(false)
    setConfirmDeleteTaskOpen(true)
  }

  function handleOpenEditTask() {
    setTaskDetailOpen(false)
    setEditTaskFormOpen((open) => !open)
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
      className='absolute flex flex-col items-start w-[120px] md:w-48 gap-4 p-4 -left-[60px] bg-white rounded-lg whitespace-nowrap top-10 dark:bg-grey-very-dark'
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
        onClick={handleOpenEditTask}
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
        Edit Task
      </button>
      <button
        onClick={handleDeleteTask}
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
        Delete Task
      </button>
    </div>
  )
}

export default TaskDetailMenu
