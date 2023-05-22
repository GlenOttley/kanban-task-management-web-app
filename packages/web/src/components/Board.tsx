import React, { useContext } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../App'

const Board = () => {
  const context = useContext(AppContext)
  const { selectedBoardId, setSelectedBoardId } = context
  const { status, data: board, error } = useBoard(selectedBoardId)
  return (
    <>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <div className='flex gap-6'>
          {board.columns.map((col) => (
            <div key={col._id}>
              <h1 className='text-xl'>{col.name}</h1>
              {col.tasks.map((task) => (
                <h3 key={task._id} className='text-lg'>
                  {task.title}
                </h3>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Board
