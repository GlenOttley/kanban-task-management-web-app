import React, { useContext, useState } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../Context'
import { Task } from 'types'
import iconChevronUp from '../images/icon-chevron-up.svg'
import iconChevronDown from '../images/icon-chevron-down.svg'

interface ComponentProps {
  task: Task
}

const StatusMenu = ({ task }: ComponentProps) => {
  const { selectedBoardId } = useContext(AppContext)
  const { data: board } = useBoard(selectedBoardId)

  const [open, setOpen] = useState(false)

  return (
    <div className='relative '>
      <legend className='mb-2 text-xs font-bold text-grey-medium '>Status</legend>
      <button
        className='flex items-center justify-between w-full px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg'
        type='button'
        aria-haspopup='true'
        aria-controls='statusmenu'
        tabIndex={0}
        aria-label={`Current status: ${task.status}`}
        onClick={() => setOpen(!open)}
      >
        {task.status}
        <img
          src={open ? iconChevronUp : iconChevronDown}
          aria-hidden='true'
          className='ml-[9px] inline-block'
        />
      </button>
      {open && (
        <div
          className='absolute w-full p-4 bg-white rounded-lg top-[75px] flex flex-col items-start'
          role='menu'
          id='statusmenu'
          aria-label='Select Status'
          tabIndex={-1}
        >
          {board?.columns?.map((column) => (
            <button
              className='py-[2px] body-lg text-grey-medium w-full text-left'
              key={column._id}
              role='menuitem'
              aria-checked={task.status === column.name}
              tabIndex={-1}
              type='button'
            >
              {column.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusMenu
