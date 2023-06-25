import React, { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../Context'
import iconVerticalEllipsis from '../images/icon-vertical-ellipsis.svg'
import { Task } from 'types'
import useToggleComplete from '../hooks/useToggleComplete'
import StatusMenu from './StatusMenu'
import DetailMenu from './DetailMenu'

interface ComponentProps {
  task: Task
}

const TaskDetail = () => {
  const { selectedTask } = useContext(AppContext)
  const { _id, title, description, subtasks, column } = selectedTask
  const { mutate } = useToggleComplete()

  function toggleComplete(subtaskId: string) {
    mutate({ columnId: column, taskId: _id, subtaskId })
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const statusMenuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    menuButtonRef?.current?.focus()
  })

  return (
    <div className='w-full p-6 bg-white rounded-md dark:bg-grey-dark'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='heading-lg dark:text-white'>{title}</h3>
        <div className='relative translate-x-4'>
          <button
            className='px-4'
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={(e) => {
              if (e.shiftKey && e.key === 'Tab') {
                e.preventDefault()
                statusMenuRef.current?.focus()
              }
            }}
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
              task={selectedTask}
              setOpen={setMenuOpen}
              triggerElement={menuButtonRef}
            />
          )}
        </div>
      </div>
      <p className='mb-6 body-lg text-grey-medium'>{description}</p>
      <form>
        <fieldset>
          <legend className='mb-4 text-xs font-bold text-grey-medium dark:text-white'>
            Subtasks ({subtasks?.filter((subtask) => subtask.isCompleted).length} of{' '}
            {subtasks?.length})
          </legend>
          <div className='flex flex-col gap-2 mb-6'>
            {subtasks?.map((subtask) => (
              <div
                className='p-3 rounded-sm bg-grey-light hover:bg-purple hover:bg-opacity-25 dark:bg-grey-very-dark hover:dark:bg-purple hover:dark:bg-opacity-25'
                key={subtask._id}
              >
                <label
                  className={`flex items-center gap-4 text-xs font-bold cursor-pointer dark:text-white ${
                    subtask.isCompleted
                      ? 'text-grey-medium line-through dark:text-grey-medium'
                      : ''
                  }`}
                >
                  <input
                    className='border-opacity-25 cursor-pointer border-grey-medium checked:bg-purple checked:hover:bg-purple checked:focus:bg-purple checked:border-purple checked:border-opacity-100 rounded-xs'
                    type='checkbox'
                    name={subtask._id}
                    value={subtask._id}
                    checked={subtask.isCompleted}
                    onChange={() => toggleComplete(subtask._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        toggleComplete(subtask._id)
                      }
                    }}
                  />
                  {subtask.title}
                </label>
              </div>
            ))}
          </div>
          <StatusMenu ref={statusMenuRef} nextItemRef={menuButtonRef} />
        </fieldset>
      </form>
    </div>
  )
}

export default TaskDetail
