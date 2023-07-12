import React, { useContext, useEffect, useRef, useState } from 'react'
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
import BoardSelectMenu from '../components/BoardSelectMenu'
import NewTaskForm from '../components/NewTaskForm'
import iconChevronLeft from '../images/icon-chevron-left.svg'
import iconChevronRight from '../images/icon-chevron-right.svg'

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
    boardSelectMenuOpen,
    setBoardSelectMenuOpen,
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

  const [scrollX, setScrollX] = useState<number>(0) // For detecting start scroll postion
  const [scrollEnd, setScrollEnd] = useState<boolean>(false) // For detecting end of scrolling

  const mainViewRef = useRef<HTMLElement>(null)

  function scrollHorizontal(scrollValue: number) {
    if (mainViewRef.current) {
      mainViewRef.current.scrollLeft += scrollValue
      setScrollX(scrollX + scrollValue)
      checkScrollable()
    }
  }

  function checkScrollable() {
    if (mainViewRef.current) {
      setScrollX(mainViewRef.current.scrollLeft)
      if (
        Math.floor(mainViewRef.current.scrollWidth - mainViewRef.current.scrollLeft) <=
        mainViewRef.current.offsetWidth
      ) {
        setScrollEnd(true)
      } else {
        setScrollEnd(false)
      }
    }
  }

  useEffect(() => {
    if (mainViewRef.current) {
      if (mainViewRef.current.scrollWidth === mainViewRef.current.offsetWidth) {
        setScrollEnd(true)
      } else {
        setScrollEnd(false)
      }
    }
    return () => {}
  }, [mainViewRef.current?.scrollWidth, mainViewRef.current?.offsetWidth])

  return (
    <>
      <Sidebar />
      <div
        className={`transition-all  ${
          sidebarOpen
            ? 'md:translate-x-sidebar-tablet xl:translate-x-sidebar-desktop md:pr-sidebar-tablet xl:pr-sidebar-desktop'
            : ''
        }`}
      >
        <Nav />
        <main
          ref={mainViewRef}
          onScroll={checkScrollable}
          className='overflow-x-scroll  no-scrollbar'
        >
          {scrollX !== 0 && (
            <button
              className='fixed block p-3 bg-opacity-50 rounded-full left-1 bg-purple top-1/2 lg:hidden hover:bg-opacity-100'
              onClick={() => scrollHorizontal(-280)}
              aria-description='scroll left'
            >
              <img src={iconChevronLeft} className='w-4 h-4' alt='' />
            </button>
          )}
          <Board />
          <LiveRegion />
          <Toast />

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

          {newBoardFormOpen && (
            <Modal open={newBoardFormOpen} setOpen={setNewBoardFormOpen}>
              <NewBoardForm />
            </Modal>
          )}

          {boardSelectMenuOpen && (
            <Modal
              open={boardSelectMenuOpen}
              setOpen={setBoardSelectMenuOpen}
              backdropClass='top-[64px]'
              dialogClass='min-w-[264px] top-4 translate-y-0 max-h-[450px] overflow-y-scroll no-scrollbar'
            >
              <BoardSelectMenu />
            </Modal>
          )}

          {newTaskFormOpen && (
            <Modal open={newTaskFormOpen} setOpen={setNewTaskFormOpen}>
              <NewTaskForm />
            </Modal>
          )}
          {!scrollEnd && (
            <button
              className='fixed block p-3 bg-opacity-50 rounded-full right-1 bg-purple top-1/2 lg:hidden hover:bg-opacity-100'
              onClick={() => scrollHorizontal(280)}
              aria-description='scroll right'
            >
              <img src={iconChevronRight} className='w-4 h-4' alt='' />
            </button>
          )}
        </main>
      </div>
    </>
  )
}

export default App
