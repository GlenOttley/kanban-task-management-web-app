import React, {
  ReactNode,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react'
import { createPortal } from 'react-dom'

interface ComponentProps {
  children: ReactNode
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  triggerElement: MutableRefObject<any>
}

const Modal = ({
  children,
  open,
  setOpen,
  triggerElement,
}: ComponentProps): JSX.Element => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    console.log(triggerElement.current)
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isModalContentClicked = dialogRef.current?.contains(target)
      const isTriggerElementClicked = triggerElement.current?.contains(target)
      const isTargetHigherZIndex =
        target.style.zIndex && parseInt(target.style.zIndex, 10) > 20

      if (!isModalContentClicked && !isTargetHigherZIndex && !isTriggerElementClicked) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setOpen])

  if (open) {
    return createPortal(
      <div className='bg-black bg-opacity-50 w-full h-full fixed inset-0 z-10'>
        <div
          role='dialog'
          ref={dialogRef}
          className='flex flex-col bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 z-20'
        >
          {children}
        </div>
      </div>,
      document.body
    )
  } else {
    return <></>
  }
}

export default Modal
