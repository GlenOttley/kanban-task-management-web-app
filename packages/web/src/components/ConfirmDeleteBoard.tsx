import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../Context'
import useDeleteBoard from '../hooks/useDeleteBoard'
import useBoard from '../hooks/useBoard'
import useBoards from '../hooks/useBoards'

const ConfirmDeleteBoard = () => {
  const { selectedBoardId, setSelectedBoardId, setConfirmDeleteBoardOpen } =
    useContext(AppContext)
  const { mutate, isSuccess } = useDeleteBoard()
  const { data: allBoards, refetch: refetchBoards } = useBoards()
  const { data: selectedBoard } = useBoard(selectedBoardId)

  const deleteButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  function handleCancel() {
    setConfirmDeleteBoardOpen(false)
  }

  useEffect(() => {
    if (isSuccess) {
      refetchBoards()
      setSelectedBoardId(allBoards![0]._id)
      localStorage.setItem('selectedBoardId', allBoards![0]._id)
      setConfirmDeleteBoardOpen(false)
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
        <h3 className='heading-lg text-red'>Delete this board?</h3>
        <p className='body-lg text-grey-medium'>
          Are you sure you want to delete the ‘{selectedBoard?.name}’ board? This action
          will remove all columns and tasks and cannot be reversed.
        </p>
        <div className='flex flex-col gap-4'>
          <button
            ref={deleteButtonRef}
            type='button'
            className='btn btn-sm btn-destructive'
            onClick={() => mutate(selectedBoardId)}
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

export default ConfirmDeleteBoard
