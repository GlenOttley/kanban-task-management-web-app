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
  liveFeedback: string
  setLiveFeedback: Dispatch<SetStateAction<string>>
  darkMode: boolean
  setDarkMode: Dispatch<SetStateAction<boolean>>
  newBoardFormOpen: boolean
  setNewBoardFormOpen: Dispatch<SetStateAction<boolean>>
}

export const AppContext = createContext<Context>({
  selectedBoardId: '',
  setSelectedBoardId: () => {},
  toastDetails: {} as Toast,
  setToastDetails: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
  liveFeedback: '',
  setLiveFeedback: () => {},
  darkMode: false,
  setDarkMode: () => {},
  newBoardFormOpen: false,
  setNewBoardFormOpen: () => {},
})

const Context = ({ children }: ComponentProps) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    localStorage.getItem('selectedBoardId') ?? '646bed58f3f236e423e58f30'
  )
  const [toastDetails, setToastDetails] = useState<Toast>({
    message: '',
  })
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [liveFeedback, setLiveFeedback] = useState<string>('')
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('dark') === 'true'
  )
  const [newBoardFormOpen, setNewBoardFormOpen] = useState<boolean>(false)

  return (
    <AppContext.Provider
      value={{
        selectedBoardId,
        setSelectedBoardId,
        toastDetails,
        setToastDetails,
        sidebarOpen,
        setSidebarOpen,
        liveFeedback,
        setLiveFeedback,
        darkMode,
        setDarkMode,
        newBoardFormOpen,
        setNewBoardFormOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
