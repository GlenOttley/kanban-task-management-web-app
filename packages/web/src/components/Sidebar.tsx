import React, { useContext } from 'react'
import Menu from './Menu'
import logoDark from '../images/logo-dark.svg'
import { AppContext } from '../Context'

const Sidebar = (): JSX.Element | null => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext)
  return sidebarOpen ? (
    <aside className='bg-white py-4 min-w-[260px] fixed top-0 left-0 h-full border-r border-r-lines-light'>
      <img src={logoDark} alt='Kanban' className='px-6 xl:px-8' />
      <Menu />
    </aside>
  ) : null
}

export default Sidebar
