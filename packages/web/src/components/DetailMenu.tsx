import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useContext,
} from 'react'
import { AppContext } from '../Context'
import useDeleteTask from '../hooks/useDeleteTask'
import { Task } from 'types'

interface ComponentProps {
  task: Task
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerElement: MutableRefObject<any>
}

const DetailMenu = ({ task, setOpen, triggerElement }: ComponentProps) => {
  const { setEditTaskFormOpen, setTaskDetailOpen } = useContext(AppContext)
  const { mutate } = useDeleteTask()
  const menuRef = useRef<HTMLDivElement>(null)

  function deleteTask() {
    mutate(task)
  }

  function handleOpenEditTask() {
    setTaskDetailOpen(false)
    setEditTaskFormOpen((open) => !open)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isTriggerElementClicked = triggerElement?.current?.contains(event.target)
      if (!isTriggerElementClicked) {
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
    >
      <button
        onClick={handleOpenEditTask}
        className='w-full text-left body-lg text-grey-medium'
      >
        Edit Task
      </button>
      <button onClick={deleteTask} className='w-full text-left body-lg text-red'>
        Delete Task
      </button>
    </div>
  )
}

export default DetailMenu
