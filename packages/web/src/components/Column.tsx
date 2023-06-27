import React, { useContext } from 'react'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import { Column as IColumn } from 'types'

interface ComponentProps {
  column: IColumn
  bgColor: string
}

const Column = ({ column, bgColor }: ComponentProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: column._id,
  })

  return (
    <li key={column._id} className='min-w-[280px] max-w-[280px]'>
      <h2 className='mb-6 uppercase heading-sm text-grey-medium'>
        <span
          className={` h-[15px] w-[15px] relative top-[3px] inline-block rounded-full mr-3 ${bgColor} `}
        ></span>
        {column.name} ({column.tasks?.length})
      </h2>
      <ul
        className='flex flex-col gap-5'
        aria-label={column.name}
        id={column._id}
        ref={setNodeRef}
      >
        {column?.tasks?.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </ul>
    </li>
  )
}

export default Column
