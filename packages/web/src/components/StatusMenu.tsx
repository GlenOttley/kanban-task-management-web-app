import React, {
  useContext,
  useState,
  forwardRef,
  RefObject,
  useRef,
  useEffect,
} from 'react'
import useBoard from '../hooks/useBoard'
import useUpdateStatus from '../hooks/useUpdateStatus'
import { AppContext } from '../Context'
import { Task } from 'types'
import iconChevronUp from '../images/icon-chevron-up.svg'
import iconChevronDown from '../images/icon-chevron-down.svg'

interface ComponentProps {
  task: Task
  nextItemRef: RefObject<HTMLButtonElement>
}

const StatusMenu = forwardRef<HTMLButtonElement, ComponentProps>(
  ({ task, nextItemRef }: ComponentProps, ref) => {
    const { selectedBoardId } = useContext(AppContext)
    const { data: board } = useBoard(selectedBoardId)
    const { mutate } = useUpdateStatus()

    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])

    function updateStatus(newColumnName: string, newColumnId: string) {
      mutate({
        taskId: task._id,
        column: newColumnId,
        status: newColumnName,
        prevColumn: task.column,
      })
    }

    function handleItemKeydown(e: React.KeyboardEvent<HTMLButtonElement>) {
      const { key } = e
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        moveFocus(e)
      } else if (!e.shiftKey && e.key === 'Tab') {
        e.preventDefault()
        setOpen(false)
        nextItemRef.current?.focus()
      } else if (e.shiftKey && key === 'Tab') {
        setOpen(false)
      }
    }

    function moveFocus(e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) {
      e.preventDefault()
      setActiveIndex((prevIndex) =>
        e.key === 'ArrowDown'
          ? (prevIndex + 1) % Number(board?.columns?.length)
          : (prevIndex - 1 + Number(board?.columns?.length)) %
            Number(board?.columns?.length)
      )
    }

    useEffect(() => {
      menuItemsRef.current[activeIndex]?.focus()
    }, [activeIndex, open])

    return (
      <div className='relative'>
        <legend className='mb-2 text-xs font-bold text-grey-medium dark:text-white'>
          Status
        </legend>
        <button
          className={`flex items-center justify-between w-full px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg dark:text-white ${
            open ? 'ring-1 ring-purple' : ''
          }`}
          type='button'
          aria-haspopup='true'
          aria-controls='statusmenu'
          tabIndex={0}
          aria-label={`Current status: ${task.status}`}
          ref={ref}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (!e.shiftKey && e.key === 'Tab') {
              e.preventDefault()
              nextItemRef.current?.focus()
            } else if (e.key === 'Enter' || e.key === ' ') {
              menuItemsRef.current[activeIndex]?.focus()
            }
          }}
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
            className='absolute w-full p-4 bg-white rounded-lg top-[75px] flex flex-col items-start dark:bg-grey-very-dark'
            role='menu'
            id='statusmenu'
            aria-label='Select Status'
            tabIndex={-1}
          >
            {board?.columns?.map((column, index) => (
              <button
                className='py-[2px] body-lg text-grey-medium w-full text-left'
                ref={(el) => (menuItemsRef.current[index] = el)}
                tabIndex={index === activeIndex ? 0 : -1}
                key={column._id}
                role='menuitem'
                aria-checked={task.status === column.name}
                type='button'
                onClick={() => updateStatus(column.name, column._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    updateStatus(column.name, column._id)
                    setOpen(false)
                  } else {
                    handleItemKeydown(e)
                  }
                }}
              >
                {column.name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

export default StatusMenu
