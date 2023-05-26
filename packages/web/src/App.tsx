import React, { useState, createContext, Dispatch, SetStateAction } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Nav from './components/Nav'
import Boards from './components/Boards'
import Board from './components/Board'
import Demo from './components/Demo'

export interface Context {
  selectedBoardId: string
  setSelectedBoardId: Dispatch<SetStateAction<string>>
}

export const AppContext = createContext<Context>({
  selectedBoardId: '',
  setSelectedBoardId: () => {},
})

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    '646bed58f3f236e423e58f30'
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          selectedBoardId,
          setSelectedBoardId,
        }}
      >
        <Nav />
        {/* <Demo /> */}
        <ReactQueryDevtools panelPosition='bottom' position='bottom-right' />
      </AppContext.Provider>
    </QueryClientProvider>
  )
}

export default App
