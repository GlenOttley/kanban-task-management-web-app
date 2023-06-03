import React, { useContext } from 'react'
import Nav from '../components/Nav'
import Board from '../components/Board'
import Toast from '../components/Toast'
import Sidebar from '../components/Sidebar'
import LiveRegion from '../components/LiveRegion'
import { AppContext } from '../Context'

const App = (): JSX.Element => {
  const { sidebarOpen } = useContext(AppContext)
  return (
    <>
      <div
        className={`h-full transition-all ${
          sidebarOpen
            ? 'md:translate-x-sidebar-tablet xl:translate-x-sidebar-desktop md:pr-sidebar-tablet xl:pr-sidebar-desktop'
            : ''
        }`}
      >
        <Nav />
        <main className='h-full px-4 md:px-6'>
          <Board />
          <LiveRegion />
          <Toast />
        </main>
      </div>
      <Sidebar />
    </>
  )
}

export default App
