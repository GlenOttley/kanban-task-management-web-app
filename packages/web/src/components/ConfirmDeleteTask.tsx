import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../Context'
import useDeleteTask from '../hooks/useDeleteTask'

const ConfirmDeleteTask = () => {
  const { selectedTask, setConfirmDeleteTaskOpen, setTaskDetailOpen } =
    useContext(AppContext)
  const { mutate, isSuccess } = useDeleteTask()

  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  function handleCancel() {
    setConfirmDeleteTaskOpen(false)
    setTaskDetailOpen(true)
  }

  useEffect(() => {
    if (isSuccess) {
      setConfirmDeleteTaskOpen(false)
    }
  }, [isSuccess])

  useEffect(() => {
    cancelButtonRef.current?.focus()
  }, [])

  return (
    <div
      className='w-full p-6 bg-white rounded-md dark:bg-grey-dark'
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          handleCancel()
        }
      }}
    >
      <div className='flex flex-col justify-between gap-6'>
        <h3 className='heading-lg text-red'>Delete this task?</h3>
        <p className='body-lg text-grey-medium'>
          Are you sure you want to delete the ‘{selectedTask.title}’ task and its
          subtasks? This action cannot be reversed.
        </p>
        <div className='flex flex-col gap-4'>
          <button
            ref={deleteButtonRef}
            type='button'
            className='btn btn-sm btn-destructive'
            onClick={() => mutate(selectedTask)}
            onKeyDown={(e) => {
              if (e.shiftKey && e.key === 'Tab') {
                e.preventDefault()
                cancelButtonRef.current?.focus()
              }
            }}
          >
            Delete
          </button>
          <button
            ref={cancelButtonRef}
            type='button'
            className='btn btn-sm btn-secondary'
            onClick={handleCancel}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                deleteButtonRef.current?.focus()
              }
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteTask
