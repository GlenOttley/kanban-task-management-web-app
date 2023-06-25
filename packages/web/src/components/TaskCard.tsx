import React, { useContext } from 'react'
import { AppContext } from '../Context'
import { Task } from 'types'

interface ComponentProps {
  task: Task
}

const TaskCard = ({ task }: ComponentProps) => {
  const { setSelectedTask, setTaskDetailOpen } = useContext(AppContext)
  const { _id, title, subtasks } = task

  function openTaskDetail() {
    setSelectedTask(task)
    setTaskDetailOpen(true)
  }

  return (
    <>
      <li
        className='px-4 py-6 bg-white rounded-lg shadow-md cursor-pointer group dark:bg-grey-dark'
        onClick={openTaskDetail}
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
      {/* <Modal open={viewTaskOpen} setOpen={setViewTaskOpen}>
        <TaskDetail task={task} />
      </Modal> */}
    </>
  )
}

export default TaskCard
