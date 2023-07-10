import React from 'react'
import TaskCard from './TaskCard'
import { Task } from '@kanban/types'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

interface ComponentProps {
  id: string
  name: string
  tasks: Task[]
  bgColor: string
}

const Column = ({ id, name, tasks, bgColor }: ComponentProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <>
      <SortableContext
        id={id}
        items={tasks.map((task: Task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <li className='min-w-[280px] max-w-[280px]'>
          <h2 className='mb-6 uppercase heading-sm text-grey-medium'>
            <span
              className={` h-[15px] w-[15px] relative top-[3px] inline-block rounded-full mr-3 ${bgColor} `}
            ></span>
            {name} ({tasks?.length})
          </h2>
          <ul className='flex flex-col gap-5' aria-label={name} ref={setNodeRef}>
            {tasks.map((task) => (
              <TaskCard key={task._id} id={task._id} task={task} />
            ))}
          </ul>
        </li>
      </SortableContext>
    </>
  )
}

export default Column
