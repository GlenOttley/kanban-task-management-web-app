import React, { useContext, useEffect, useState, useRef } from 'react'
import useBoard from '../hooks/useBoard'
import { AppContext } from '../Context'
import Column from './Column'
import useUpdateColumn from '../hooks/useUpdateColumn'

import {
  DndContext,
  closestCorners,
  PointerSensor,
  MouseSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { Column as IColumn } from 'packages/types/src'

const Board = () => {
  const {
    selectedBoardId,
    setEditBoardFormOpen,
    editBoardFormOpen,
    setModalTriggerElement,
  } = useContext(AppContext)
  const { status, data: board, error, refetch: refetchBoard } = useBoard(selectedBoardId)
  const { mutate: updateColumn, isSuccess: updateColumnSuccess } = useUpdateColumn()
  const addNewColumnButtonRef = useRef<HTMLButtonElement>(null)

  const colors = ['bg-blue', 'bg-purple', 'bg-green']
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    })
  )

  function getBgColor(index: number) {
    const colorIndex = index % colors.length
    return colors[colorIndex]
  }

  const [columns, setColumns] = useState<IColumn[]>(board?.columns || [])

  const findColumn = (activeId: string | null) => {
    if (!activeId) {
      return null
    }

    if (columns.some((column) => column._id === activeId)) {
      return columns.find((column) => column._id === activeId) ?? null
    }
    const taskIdsWithColumnIds = columns.flatMap((column) => {
      const columnId = column._id
      return column.tasks.map((task) => ({ itemId: task._id, columnId: columnId }))
    })
    const columnId = taskIdsWithColumnIds.find(
      (task) => task.itemId === String(activeId)
    )?.columnId
    return columns.find((column) => column._id === columnId) ?? null
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event
    const activeId = String(active.id)
    const overId = over ? String(over.id) : null
    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null
    }
    setColumns((prevState) => {
      const activeItems = activeColumn.tasks
      const overItems = overColumn.tasks
      const activeIndex = activeItems.findIndex((i) => i._id === activeId)
      const overIndex = overItems.findIndex((i) => i._id === overId)
      const newIndex = () => {
        const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0
        const modifier = putOnBelowLastItem ? 1 : 0
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }
      return prevState.map((c) => {
        if (c._id === activeColumn._id) {
          c.tasks = activeItems.filter((i) => i._id !== activeId)
          return c
        } else if (c._id === overColumn._id) {
          c.tasks = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length),
          ]
          return c
        } else {
          return c
        }
      })
    })
  }

  // TODO batch these requests
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    const activeId = String(active.id)
    const overId = over ? String(over.id) : null
    const activeColumn = findColumn(activeId)
    const overColumn = findColumn(overId)
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null
    }
    const activeIndex = activeColumn.tasks.findIndex((i) => i._id === activeId)
    const overIndex = overColumn.tasks.findIndex((i) => i._id === overId)
    if (active.data.current?.prevColumn !== overColumn._id) {
      // move task between columns
      updateColumn({
        boardId: selectedBoardId,
        columnId: overColumn._id,
        tasks: overColumn.tasks.map((task) => task._id),
        prevColumnId: active.data.current?.prevColumn,
        taskToRemove: activeId,
        status: overColumn.name,
      })
    } else if (activeIndex !== overIndex) {
      // reorder tasks within a single column
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column._id === activeColumn._id) {
            column.tasks = arrayMove(overColumn.tasks, activeIndex, overIndex)
            updateColumn({
              boardId: selectedBoardId,
              columnId: overColumn._id,
              tasks: column.tasks.map((task) => task._id),
            })
            return column
          } else {
            return column
          }
        })
      })
    }
  }

  useEffect(() => {
    board?.columns && setColumns(board.columns)
  }, [board])

  useEffect(() => {
    if (updateColumnSuccess) {
      refetchBoard()
    }
  }, [updateColumnSuccess])

  return (
    <div className='py-6 '>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error?.message}</span>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <ul className='inline-flex min-h-screen gap-6 px-4 md:px-6 '>
            {columns.map((column, index) => (
              <Column
                key={column._id}
                id={column._id}
                name={column.name}
                tasks={column.tasks}
                bgColor={getBgColor(index)}
              />
            ))}
            {columns.length ? (
              <li className='bg-[#E9EFFA] dark:bg-grey-dark min-w-[280px] max-w-[280px] rounded-md flex justify-center items-center mt-[42px] '>
                <button
                  type='button'
                  ref={addNewColumnButtonRef}
                  id='newColumnButton'
                  onClick={() => {
                    setModalTriggerElement(addNewColumnButtonRef)
                    setEditBoardFormOpen(true)
                  }}
                  className='btn heading-xl text-grey-medium hover:text-purple'
                >
                  + New Column
                </button>
              </li>
            ) : (
              <li className='absolute w-full h-full px-4 md:px-6'>
                <div className='relative flex flex-col items-center justify-center h-full gap-6 bottom-nav-mobile'>
                  <h2 className='text-center heading-lg text-grey-medium'>
                    This board is empty. Create a new column to get started.
                  </h2>
                  <button
                    type='button'
                    ref={addNewColumnButtonRef}
                    id='newColumnButton'
                    onClick={() => {
                      setModalTriggerElement(addNewColumnButtonRef)
                      setEditBoardFormOpen(true)
                    }}
                    className='btn btn-lg btn-primary'
                  >
                    + Add New Column
                  </button>
                </div>
              </li>
            )}
          </ul>
        </DndContext>
      )}
    </div>
  )
}

export default Board
