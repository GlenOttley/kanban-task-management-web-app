import React, { useContext, useRef } from 'react'
import { AppContext } from '../Context'
import { Task } from 'types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ComponentProps {
  task: Task
  id: string
  onClick?: void
}

const SortableTaskCard = ({ task, id }: ComponentProps) => {
  const { title, subtasks, columnId } = task
  const { setSelectedTask, setTaskDetailOpen } = useContext(AppContext)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    data: {
      prevColumn: columnId,
    },
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
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role='button'
    >
      <h3
        className='mb-2 heading-md group-hover:text-purple dark:text-white'
        aria-describedby={`subtasks-complete-${id}`}
      >
        <button
          className='text-left'
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openTaskDetail()
            }
          }}
        >
          {title}
        </button>
      </h3>
      <p className='body-md text-grey-medium' id={`subtasks-complete-${id}`}>
        {subtasks?.filter((subtask) => subtask.isCompleted).length} of {subtasks?.length}{' '}
        subtasks
      </p>
    </li>
  )
}

export default SortableTaskCard
