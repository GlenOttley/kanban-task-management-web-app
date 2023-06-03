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
  triggerElement?: MutableRefObject<any>
  dialogClass?: string
  backdropClass?: string
}

const Modal = ({
  children,
  open,
  setOpen,
  triggerElement,
  dialogClass,
  backdropClass,
}: ComponentProps): JSX.Element => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isModalContentClicked = dialogRef.current?.contains(target)
      const isTriggerElementClicked = triggerElement?.current?.contains(target)
      const isTargetHigherZIndex =
        target.style.zIndex && parseInt(target.style.zIndex, 10) > 20

      /* 
      TODO re-implement this function so that clicking outside will close the modal 
      currently this prevents the Add New Board button from working within the Menu component
      */
      // if (!isModalContentClicked && !isTargetHigherZIndex && !isTriggerElementClicked) {
      //   setOpen(false)
      // }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setOpen])

  if (open) {
    return createPortal(
      <div
        // TODO add defaults for transition
        className={`bg-[rgba(0,0,0,0.5)] bg-opacity-50 w-full h-full fixed inset-0 z-10 px-4 ${' '}`.concat(
          backdropClass ?? ''
        )}
        onKeyDown={({ key }) => key === 'Escape' && setOpen(false)}
      >
        <div
          role='dialog'
          ref={dialogRef}
          className={`container max-w-[512px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-20 ${' '}`.concat(
            dialogClass ?? ''
          )}
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
