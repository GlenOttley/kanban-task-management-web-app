import React, { useState } from 'react'
import { Task } from 'packages/types/src'
import Modal from './Modal'

interface ComponentProps {
  task: Task
}

const TaskCard = ({ task: { title, subtasks } }: ComponentProps) => {
  const [viewTaskOpen, setViewTaskOpen] = useState<boolean>(false)

  return (
    <>
      <li
        className='px-4 py-6 bg-white rounded-lg w-[280px] shadow-md cursor-pointer group'
        onClick={() => setViewTaskOpen(true)}
      >
        <h3 className='mb-2 heading-md group-hover:text-purple'>
          <button>{title}</button>
        </h3>
        <p className='body-md text-grey-medium'>
          {subtasks?.filter((subtask) => subtask.isCompleted).length} of{' '}
          {subtasks?.length} subtasks
        </p>
      </li>
      <Modal open={viewTaskOpen} setOpen={setViewTaskOpen}>
        <div className='w-full p-6 bg-white rounded-md'>{title}</div>
      </Modal>
    </>
  )
}

export default TaskCard
