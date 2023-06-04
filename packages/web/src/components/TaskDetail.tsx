import React from 'react'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import { Task } from 'packages/types/src'

interface ComponentProps {
  task: Task
}

const TaskDetail = ({ task: { title, description, subtasks } }: ComponentProps) => {
  return (
    <div className='w-full p-6 bg-white rounded-md'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='heading-lg'>{title}</h3>
        <button className='px-4'>
          <img className='w-4 h-5' src={iconVerticalEllipsis} aria-hidden='true' />
          <span className='sr-only'>Open menu</span>
        </button>
      </div>
      <p className='mb-6 body-lg text-grey-medium'>{description}</p>
      <form>
        <fieldset>
          <legend className='mb-4 text-xs font-bold text-grey-medium'>
            Subtasks ({subtasks?.filter((subtask) => subtask.isCompleted).length} of{' '}
            {subtasks?.length})
          </legend>
          <div className='flex flex-col gap-2'>
            {subtasks?.map((subtask) => (
              <div className='p-3 rounded-sm bg-grey-light'>
                <label
                  className={`flex gap-4 text-xs font-bold cursor-pointer ${
                    subtask.isCompleted ? 'text-grey-medium line-through' : ''
                  }`}
                >
                  <input
                    type='checkbox'
                    name={subtask._id}
                    id={subtask._id}
                    checked={subtask.isCompleted}
                    onClick={() => console.log(subtask.title)}
                  />
                  {subtask.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default TaskDetail
