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
import useBoards from '../hooks/useBoards'
import EditBoardForm from '../components/EditBoardForm'
import ConfirmDeleteTask from '../components/ConfirmDeleteTask'
import ConfirmDeleteBoard from '../components/ConfirmDeleteBoard'
import NewTaskForm from '../components/NewTaskForm'

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
    setSelectedBoardId,
    editBoardFormOpen,
    setEditBoardFormOpen,
    confirmDeleteTaskOpen,
    setConfirmDeleteTaskOpen,
    confirmDeleteBoardOpen,
    setConfirmDeleteBoardOpen,
    newTaskFormOpen,
    setNewTaskFormOpen,
  } = useContext(AppContext)

  const { data: allBoards } = useBoards()

  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    allBoards &&
      setSelectedBoardId(localStorage.getItem('selectedBoardId') || allBoards[0]._id)
  }, [allBoards])

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
              <NewBoardForm />
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

          {editBoardFormOpen && (
            <Modal open={editBoardFormOpen} setOpen={setEditBoardFormOpen}>
              <EditBoardForm />
            </Modal>
          )}

          {confirmDeleteTaskOpen && (
            <Modal open={confirmDeleteTaskOpen} setOpen={setConfirmDeleteTaskOpen}>
              <ConfirmDeleteTask />
            </Modal>
          )}

          {confirmDeleteBoardOpen && (
            <Modal open={confirmDeleteBoardOpen} setOpen={setConfirmDeleteBoardOpen}>
              <ConfirmDeleteBoard />
            </Modal>
          )}

          {newTaskFormOpen && (
            <Modal open={newTaskFormOpen} setOpen={setNewTaskFormOpen}>
              <NewTaskForm />
            </Modal>
          )}
        </main>
      </div>
    </>
  )
}

export default App
