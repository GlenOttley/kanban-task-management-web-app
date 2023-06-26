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
  nextItemRef: RefObject<HTMLButtonElement>
}

const StatusMenu = forwardRef<HTMLButtonElement, ComponentProps>(
  ({ nextItemRef }: ComponentProps, ref) => {
    const { selectedBoardId, selectedTask, setTaskDetailOpen } = useContext(AppContext)
    const { data: board } = useBoard(selectedBoardId)
    const { mutate, isSuccess } = useUpdateStatus()

    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([])
    const wrapperRef = useRef<any>(null)

    function updateStatus(newColumnName: string, newColumnId: string) {
      mutate({
        taskId: selectedTask._id,
        column: newColumnId,
        status: newColumnName,
        prevColumn: selectedTask.column,
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

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const isTriggerElementClicked = wrapperRef?.current?.contains(event.target)
        if (!isTriggerElementClicked) {
          setOpen(false)
        }
      }

      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    useEffect(() => {
      if (isSuccess) {
        setTaskDetailOpen(false)
      }
    }, [isSuccess])

    return (
      <div className='relative'>
        <legend className='mb-2 text-xs font-bold text-grey-medium dark:text-white'>
          Status
        </legend>
        <div ref={wrapperRef}>
          <button
            className={`flex items-center justify-between w-full px-4 py-2 border border-opacity-25 rounded-sm border-grey-medium body-lg dark:text-white ${
              open ? 'ring-1 ring-purple' : ''
            }`}
            type='button'
            aria-haspopup='true'
            aria-controls='statusmenu'
            tabIndex={0}
            aria-label={`Current status: ${selectedTask.status}`}
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
            {selectedTask.status}
            <img
              src={open ? iconChevronUp : iconChevronDown}
              aria-hidden='true'
              className='ml-[9px] inline-block'
            />
          </button>
        </div>
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
                aria-checked={selectedTask.status === column.name}
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
