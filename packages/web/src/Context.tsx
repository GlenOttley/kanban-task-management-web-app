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
}

export const AppContext = createContext<Context>({
  selectedBoardId: '',
  setSelectedBoardId: () => {},
  toastDetails: {} as Toast,
  setToastDetails: () => {},
})

const Context = ({ children }: ComponentProps) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    '646bed58f3f236e423e58f30'
  )
  const [toastDetails, setToastDetails] = useState<Toast>({
    message: 'App rendered',
  })

  return (
    <AppContext.Provider
      value={{
        selectedBoardId,
        setSelectedBoardId,
        toastDetails: toastDetails,
        setToastDetails: setToastDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
