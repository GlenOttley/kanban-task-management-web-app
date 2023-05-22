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
  dialogStyles?: React.CSSProperties
  backdropStyles?: React.CSSProperties
}

const Modal = ({
  children,
  open,
  setOpen,
  triggerElement,
  dialogStyles,
  backdropStyles,
}: ComponentProps): JSX.Element => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isModalContentClicked = dialogRef.current?.contains(target)
      const isTriggerElementClicked = triggerElement?.current?.contains(target)
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
      <div
        style={{
          // TODO add defaults for transition
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          height: '100%',
          position: 'fixed',
          inset: '0px',
          zIndex: '10',
          ...backdropStyles,
        }}
      >
        <div
          role='dialog'
          ref={dialogRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: '20',
            ...dialogStyles,
          }}
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
