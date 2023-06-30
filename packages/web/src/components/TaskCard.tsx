import React, { useContext, MouseEvent, useRef, useEffect } from 'react'
import { AppContext } from '../Context'
import { Task } from 'types'
import { useSortable } from '@dnd-kit/sortable'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface ComponentProps {
  task: Task
  id: string
}

const TaskCard = ({ task, id }: ComponentProps) => {
  const { title, subtasks, status, column } = task
  const { setSelectedTask, setTaskDetailOpen } = useContext(AppContext)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    // data: {
    //   taskId: id,
    //   status: status,
    //   prevColumn: column,
    // },
  })

  function handleMouseDown() {
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null
    }, 300)
  }

  function handleMouseUp() {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      openTaskDetail()
    }
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function openTaskDetail() {
    setSelectedTask(task)
    setTaskDetailOpen(true)
  }

  return (
    <li
      ref={setNodeRef}
      id={id}
      className='px-4 py-6 bg-white rounded-lg shadow-md cursor-pointer group dark:bg-grey-dark'
      {...attributes}
      {...listeners}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <h3
        className='mb-2 heading-md group-hover:text-purple dark:text-white'
        aria-describedby={`subtasks-complete-${id}`}
      >
        <button className='text-left'>{title}</button>
      </h3>
      <p className='body-md text-grey-medium' id={`subtasks-complete-${id}`}>
        {subtasks?.filter((subtask) => subtask.isCompleted).length} of {subtasks?.length}{' '}
        subtasks
      </p>
    </li>
  )
}

export default TaskCard
