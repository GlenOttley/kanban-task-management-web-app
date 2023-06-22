import React, { useContext } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../Context'
import TaskCard from './TaskCard'

const Board = () => {
  const { selectedBoardId } = useContext(AppContext)
  const { status, data: board, error } = useBoard(selectedBoardId)
  const colors = ['bg-blue', 'bg-purple', 'bg-green']

  function getBgColor(index: number) {
    const colorIndex = index % colors.length
    return colors[colorIndex]
  }

  return (
    <div className='py-6'>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <ul className='flex gap-6'>
          {board?.columns?.map((column, index) => (
            <li key={column._id} className='min-w-[280px] max-w-[280px]'>
              <h2 className='mb-6 uppercase heading-sm text-grey-medium'>
                <span
                  className={`h-[15px] w-[15px] relative top-[3px] inline-block rounded-full mr-3 ${getBgColor(
                    index
                  )} `}
                ></span>
                {column.name} ({column.tasks?.length})
              </h2>
              <ul className='flex flex-col gap-5'>
                {column?.tasks?.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Board
