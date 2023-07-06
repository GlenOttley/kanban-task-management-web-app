import React, {
  ReactNode,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { AppContext } from '../Context'

interface ComponentProps {
  children: ReactNode
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  dialogClass?: string
  backdropClass?: string
}

const Modal = ({
  children,
  setOpen,
  open,
  dialogClass,
  backdropClass,
}: ComponentProps): JSX.Element => {
  const { modalTriggerElement } = useContext(AppContext)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isModalContentClicked = dialogRef.current?.contains(target)
      const isTriggerElementClicked = modalTriggerElement?.current?.contains(target)
      // const isTargetHigherZIndex =
      //   target.style.zIndex && parseInt(target.style.zIndex, 10) > 20
      if (!isModalContentClicked && !isTriggerElementClicked) {
        setIsOpen(false)
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [setOpen, modalTriggerElement])

  useEffect(() => {
    // Ensure the transition class is applied after a delay when opening the modal
    const timeoutId = setTimeout(() => {
      setIsOpen(true)
    }, 1)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div
      // TODO add defaults for transition
      className={`bg-[rgba(0,0,0)] transition-all duration-300  w-full h-full fixed inset-0 z-10 px-4 
      ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}
      ${' '}`.concat(backdropClass ?? '')}
      onKeyDown={({ key }) => {
        if (key === 'Escape') {
          setOpen(false)
        }
      }}
    >
      <div
        role='dialog'
        ref={dialogRef}
        className={`transition-all duration-300 container max-w-[512px] absolute top-1/2 left-1/2 -translate-x-1/2  w-full z-20
        ${isOpen ? '-translate-y-1/2' : 'translate-y-[150%]'}
        ${' '}`.concat(dialogClass ?? '')}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
