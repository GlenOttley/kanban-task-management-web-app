import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import { type Toast } from './components/Toast'

interface ComponentProps {
  children: ReactNode
}

export interface Context {
  selectedBoardId: string
  setSelectedBoardId: Dispatch<SetStateAction<string>>
  toastDetails: Toast
  setToastDetails: Dispatch<SetStateAction<Toast>>
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
}

export const AppContext = createContext<Context>({
  selectedBoardId: '',
  setSelectedBoardId: () => {},
  toastDetails: {} as Toast,
  setToastDetails: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
})

const Context = ({ children }: ComponentProps) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    '646bed58f3f236e423e58f30'
  )
  const [toastDetails, setToastDetails] = useState<Toast>({
    message: '',
  })
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

  return (
    <AppContext.Provider
      value={{
        selectedBoardId,
        setSelectedBoardId,
        toastDetails,
        setToastDetails,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
