import React, { useContext } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../Context'

const Board = () => {
  const { selectedBoardId, setSelectedBoardId } = useContext(AppContext)
  const { status, data: board, error } = useBoard(selectedBoardId)
  return (
    <>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <div className='flex gap-6'>
          {board?.columns?.map((column) => (
            <div key={column._id}>
              <h1 className='text-xl'>{column.name}</h1>
              {column?.tasks?.map((task) => (
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
