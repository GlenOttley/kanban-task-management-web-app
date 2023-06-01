import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Context, { AppContext } from './Context'
import Nav from './components/Nav'
import Boards from './components/Boards'
import Board from './components/Board'
import Toast from './components/Toast'
import Sidebar from './components/Sidebar'

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Context>
        <Nav />
        <main className='h-full bg-grey-light'>
          <Sidebar />
          <div className='px-4 xl:container md:px-6'>
            <Board />
            <Toast />
          </div>
        </main>
      </Context>
      <ReactQueryDevtools panelPosition='bottom' position='bottom-right' />
    </QueryClientProvider>
  )
}

export default App
