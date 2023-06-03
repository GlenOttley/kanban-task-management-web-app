import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Context from './Context'
import Home from './views/Home'

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Context>
        <Home />
      </Context>
      <ReactQueryDevtools panelPosition='bottom' position='bottom-right' />
    </QueryClientProvider>
  )
}

export default App
