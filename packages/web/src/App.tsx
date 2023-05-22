import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Nav from './components/Nav'
import Boards from './components/Boards'

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      <Boards />
      <ReactQueryDevtools panelPosition='bottom' position='bottom-right' />
    </QueryClientProvider>
  )
}

export default App
