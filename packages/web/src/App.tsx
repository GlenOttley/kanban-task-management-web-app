import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Context from './Context'
import Nav from './components/Nav'
import Boards from './components/Boards'
import Board from './components/Board'
import Toast from './components/Toast'

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Context>
        <Nav />
        <Board />
        <Toast />
      </Context>
      <ReactQueryDevtools panelPosition='bottom' position='bottom-right' />
    </QueryClientProvider>
  )
}

export default App
