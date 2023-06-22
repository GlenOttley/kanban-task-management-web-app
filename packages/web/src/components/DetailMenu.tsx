import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
import useDeleteTask from '../hooks/useDeleteTask'
import { Task } from 'types'

interface ComponentProps {
  task: Task
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerElement: MutableRefObject<any>
}

const DetailMenu = ({ task, setOpen, triggerElement }: ComponentProps) => {
  const { mutate } = useDeleteTask()
  const menuRef = useRef<HTMLDivElement>(null)

  function deleteTask() {
    mutate(task)
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
      className='absolute flex flex-col items-start w-[120px] md:w-48 gap-4 p-4 -left-[60px] bg-white rounded-lg whitespace-nowrap top-10'
      role='menu'
      tabIndex={-1}
    >
      <button className='w-full text-left body-lg text-grey-medium'>Edit Task</button>
      <button className='w-full text-left body-lg text-red' onClick={deleteTask}>
        Delete Task
      </button>
    </div>
  )
}

export default DetailMenu
