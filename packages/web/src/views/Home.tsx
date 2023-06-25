import React, { useContext, useEffect } from 'react'
import Nav from '../components/Nav'
import Board from '../components/Board'
import Toast from '../components/Toast'
import Sidebar from '../components/Sidebar'
import LiveRegion from '../components/LiveRegion'
import NewBoardForm from '../components/NewBoardForm'
import Modal from '../components/Modal'
import { AppContext } from '../Context'
import EditTaskForm from '../components/EditTaskForm'
import TaskDetail from '../components/TaskDetail'

const App = (): JSX.Element => {
  const {
    sidebarOpen,
    darkMode,
    newBoardFormOpen,
    setNewBoardFormOpen,
    editTaskFormOpen,
    setEditTaskFormOpen,
    taskDetailOpen,
    setTaskDetailOpen,
  } = useContext(AppContext)

  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark')
  }, [darkMode])

  return (
    <>
      <Sidebar />
      <div
        className={`h-full transition-all ${
          sidebarOpen
            ? 'md:translate-x-sidebar-tablet xl:translate-x-sidebar-desktop md:pr-sidebar-tablet xl:pr-sidebar-desktop'
            : ''
        }`}
      >
        <Nav />
        <main className='h-full px-4 overflow-scroll no-scrollbar md:px-6'>
          <Board />
          <LiveRegion />
          <Toast />

          {newBoardFormOpen && (
            <Modal open={newBoardFormOpen} setOpen={setNewBoardFormOpen}>
              <div
                role='menu'
                className='flex flex-col items-start bg-white rounded-lg whitespace-nowrap'
              >
                <NewBoardForm />
              </div>
            </Modal>
          )}

          {taskDetailOpen && (
            <Modal open={taskDetailOpen} setOpen={setTaskDetailOpen}>
              <TaskDetail />
            </Modal>
          )}

          {editTaskFormOpen && (
            <Modal open={editTaskFormOpen} setOpen={setEditTaskFormOpen}>
              <EditTaskForm />
            </Modal>
          )}
        </main>
      </div>
    </>
  )
}

export default App
