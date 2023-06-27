import React, { useContext } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../Context'
import { DndContext } from '@dnd-kit/core'
import Column from './Column'
import useUpdateStatus from '../hooks/useUpdateStatus'

const Board = () => {
  const { selectedBoardId } = useContext(AppContext)
  const { status, data: board, error } = useBoard(selectedBoardId)
  const { mutate } = useUpdateStatus()

  const colors = ['bg-blue', 'bg-purple', 'bg-green']

  function getBgColor(index: number) {
    const colorIndex = index % colors.length
    return colors[colorIndex]
  }

  function handleDragEnd(e: any) {
    const { active: selectedTask, over: selectedColumn } = e
    mutate({ ...selectedTask.data.current, column: selectedColumn.id })
  }

  return (
    <div className='py-6'>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <ul className='flex gap-6'>
            {board?.columns?.map((column, index) => (
              <Column key={column._id} column={column} bgColor={getBgColor(index)} />
            ))}
          </ul>
        </DndContext>
      )}
    </div>
  )
}

export default Board
