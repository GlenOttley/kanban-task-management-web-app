import { useContext } from 'react'
import { AppContext } from '../Context'
import iconHide from '../images/icon-hide-sidebar.svg'
import iconShow from '../images/icon-show-sidebar.svg'
import logoDark from '../images/logo-dark.svg'
import logoLight from '../images/logo-light.svg'
import BoardSelectMenu from './BoardSelectMenu'
import ThemeSwitch from './ThemeSwitch'

const Sidebar = (): JSX.Element | null => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext)
  return (
    <aside
      className={`absolute z-30 h-screen md:min-w-[260px] xl:min-w-[300px] bg-white dark:bg-grey-dark pt-4 pb-8 top-0 left-0 border-r 
    border-lines-light dark:border-lines-dark flex flex-col  transition-transform 
    ${
      !sidebarOpen
        ? 'md:-translate-x-sidebar-tablet xl:-translate-x-sidebar-desktop justify-end'
        : ''
    }
    `}
    >
      {sidebarOpen && (
        <div className='flex flex-col justify-between h-full '>
          <div>
            <img src={logoDark} alt='Kanban' className='px-6 py-3 mb-5 dark:hidden' />
            <img
              src={logoLight}
              alt='Kanban'
              className='hidden px-6 py-3 mb-5 dark:block'
            />
            <BoardSelectMenu />
          </div>
          <div className='flex flex-col gap-4'>
            <div className={`${sidebarOpen ? 'block px-4' : 'hidden'}`}>
              <ThemeSwitch />
            </div>
            <button
              className='flex items-center gap-2 px-6 py-3 mr-4 text-grey-medium rounded-e-full group hover:bg-purple hover:bg-opacity-10 hover:text-purple dark:hover:bg-white focus:bg-purple focus:bg-opacity-10 focus:text-purple dark:focus:bg-white '
              onClick={() => setSidebarOpen(false)}
            >
              <img src={iconHide} aria-hidden='true' />
              Hide Sidebar
            </button>
          </div>
        </div>
      )}
      <button
        className={`hidden md:block relative md:left-sidebar-tablet xl:left-sidebar-desktop self-start py-[18px] pl-[18px] pr-[22px] rounded-l-none rounded-r-full btn-primary bottom-8 
          ${sidebarOpen ? 'md:hidden' : ''}
        `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-pressed={sidebarOpen}
      >
        <span className='sr-only'>Show sidebar</span>
        <img src={iconShow} aria-hidden='true' alt=''></img>
      </button>
    </aside>
  )
}

export default Sidebar
