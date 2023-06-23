import React, { useState } from 'react'
import { Task } from 'types'
import Modal from './Modal'
import TaskDetail from './TaskDetail'

interface ComponentProps {
  task: Task
}

const TaskCard = ({ task }: ComponentProps) => {
  const { _id, title, subtasks } = task
  const [viewTaskOpen, setViewTaskOpen] = useState<boolean>(false)

  return (
    <>
      <li
        className='px-4 py-6 bg-white rounded-lg shadow-md cursor-pointer group dark:bg-grey-dark'
        onClick={() => setViewTaskOpen(true)}
      >
        <h3
          className='mb-2 heading-md group-hover:text-purple dark:text-white'
          aria-describedby={`subtasks-complete-${_id}`}
        >
          <button className='text-left'>{title}</button>
        </h3>
        <p className='body-md text-grey-medium' id={`subtasks-complete-${_id}`}>
          {subtasks?.filter((subtask) => subtask.isCompleted).length} of{' '}
          {subtasks?.length} subtasks
        </p>
      </li>
      <Modal open={viewTaskOpen} setOpen={setViewTaskOpen}>
        <TaskDetail task={task} />
      </Modal>
    </>
  )
}

export default TaskCard
