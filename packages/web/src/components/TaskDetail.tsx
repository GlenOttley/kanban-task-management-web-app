import React, { useState, useRef } from 'react'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import { Task } from 'types'
import useToggleComplete from '../hooks/useToggleComplete'
import StatusMenu from './StatusMenu'
import DetailMenu from './DetailMenu'

interface ComponentProps {
  task: Task
}

const TaskDetail = ({ task }: ComponentProps) => {
  const { _id, title, description, subtasks, column } = task
  const { mutate } = useToggleComplete()

  function toggleComplete(e: React.ChangeEvent<HTMLInputElement>) {
    mutate({ columnId: column, taskId: _id, subtaskId: e.target.id })
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className='w-full p-6 bg-white rounded-md'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='heading-lg'>{title}</h3>
        <div className='relative translate-x-4'>
          <button
            className='px-4'
            onClick={() => setMenuOpen(!menuOpen)}
            ref={menuButtonRef}
          >
            <img
              className='min-h-[20px] min-w-[5px]'
              src={iconVerticalEllipsis}
              aria-hidden='true'
            />
            <span className='sr-only'>Open menu</span>
          </button>
          {menuOpen && (
            <DetailMenu
              task={task}
              setOpen={setMenuOpen}
              triggerElement={menuButtonRef}
            />
          )}
        </div>
      </div>
      <p className='mb-6 body-lg text-grey-medium'>{description}</p>
      <form>
        <fieldset>
          <legend className='mb-4 text-xs font-bold text-grey-medium'>
            Subtasks ({subtasks?.filter((subtask) => subtask.isCompleted).length} of{' '}
            {subtasks?.length})
          </legend>
          <div className='flex flex-col gap-2 mb-6'>
            {subtasks?.map((subtask) => (
              <div
                className='p-3 rounded-sm bg-grey-light hover:bg-purple hover:bg-opacity-25'
                key={subtask._id}
              >
                <label
                  className={`flex items-center gap-4 text-xs font-bold cursor-pointer ${
                    subtask.isCompleted ? 'text-grey-medium line-through' : ''
                  }`}
                >
                  <input
                    className='border-opacity-25 cursor-pointer border-grey-medium checked:bg-purple checked:hover:bg-purple checked:focus:bg-purple checked:border-purple checked:border-opacity-100 rounded-xs'
                    type='checkbox'
                    name={subtask._id}
                    id={subtask._id}
                    checked={subtask.isCompleted}
                    onChange={toggleComplete}
                  />
                  {subtask.title}
                </label>
              </div>
            ))}
          </div>
          <StatusMenu task={task} />
        </fieldset>
      </form>
    </div>
  )
}

export default TaskDetail
