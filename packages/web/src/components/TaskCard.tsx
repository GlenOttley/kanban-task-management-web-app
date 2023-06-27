import React, { useContext } from 'react'
import { AppContext } from '../Context'
import { Task } from 'types'
import { useDraggable } from '@dnd-kit/core'

interface ComponentProps {
  task: Task
}

const TaskCard = ({ task }: ComponentProps) => {
  const { setSelectedTask, setTaskDetailOpen } = useContext(AppContext)
  const { _id, title, subtasks } = task

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: {
      taskId: task._id,
      status: task.status,
      prevColumn: task.column,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  function openTaskDetail() {
    setSelectedTask(task)
    setTaskDetailOpen(true)
  }

  return (
    <li
      className='px-4 py-6 bg-white rounded-lg shadow-md cursor-pointer group dark:bg-grey-dark'
      onClick={openTaskDetail}
      key={task._id}
      id={task._id}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <h3
        className='mb-2 heading-md group-hover:text-purple dark:text-white'
        aria-describedby={`subtasks-complete-${_id}`}
      >
        <button className='text-left'>{title}</button>
      </h3>
      <p className='body-md text-grey-medium' id={`subtasks-complete-${_id}`}>
        {subtasks?.filter((subtask) => subtask.isCompleted).length} of {subtasks?.length}{' '}
        subtasks
      </p>
    </li>
  )
}

export default TaskCard
