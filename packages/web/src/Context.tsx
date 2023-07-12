import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  MutableRefObject,
} from 'react'
import { type Toast } from './components/Toast'
import { Task } from '@kanban/types'

interface ComponentProps {
  children: ReactNode
}

export interface Context {
  selectedBoardId: string
  setSelectedBoardId: Dispatch<SetStateAction<string>>
  selectedTask: Task
  setSelectedTask: Dispatch<SetStateAction<Task>>
  toastDetails: Toast
  setToastDetails: Dispatch<SetStateAction<Toast>>
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  liveFeedback: string
  setLiveFeedback: Dispatch<SetStateAction<string>>
  darkMode: boolean
  setDarkMode: Dispatch<SetStateAction<boolean>>
  newBoardFormOpen: boolean
  setNewBoardFormOpen: Dispatch<SetStateAction<boolean>>
  editTaskFormOpen: boolean
  setEditTaskFormOpen: Dispatch<SetStateAction<boolean>>
  taskDetailOpen: boolean
  setTaskDetailOpen: Dispatch<SetStateAction<boolean>>
  editBoardFormOpen: boolean
  setEditBoardFormOpen: Dispatch<SetStateAction<boolean>>
  confirmDeleteTaskOpen: boolean
  setConfirmDeleteTaskOpen: Dispatch<SetStateAction<boolean>>
  confirmDeleteBoardOpen: boolean
  setConfirmDeleteBoardOpen: Dispatch<SetStateAction<boolean>>
  newTaskFormOpen: boolean
  setNewTaskFormOpen: Dispatch<SetStateAction<boolean>>
  boardSelectMenuOpen: boolean
  setBoardSelectMenuOpen: Dispatch<SetStateAction<boolean>>
  modalTriggerElement: MutableRefObject<any> | null
  setModalTriggerElement: Dispatch<SetStateAction<MutableRefObject<any> | null>>
}

export const AppContext = createContext<Context>({
  selectedBoardId: '',
  setSelectedBoardId: () => {},
  selectedTask: {} as Task,
  setSelectedTask: () => {},
  toastDetails: {} as Toast,
  setToastDetails: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
  liveFeedback: '',
  setLiveFeedback: () => {},
  darkMode: false,
  setDarkMode: () => {},
  newBoardFormOpen: false,
  setNewBoardFormOpen: () => {},
  editTaskFormOpen: false,
  setEditTaskFormOpen: () => {},
  taskDetailOpen: false,
  setTaskDetailOpen: () => {},
  editBoardFormOpen: false,
  setEditBoardFormOpen: () => {},
  confirmDeleteTaskOpen: false,
  setConfirmDeleteTaskOpen: () => {},
  confirmDeleteBoardOpen: false,
  setConfirmDeleteBoardOpen: () => {},
  newTaskFormOpen: false,
  setNewTaskFormOpen: () => {},
  boardSelectMenuOpen: false,
  setBoardSelectMenuOpen: () => {},
  modalTriggerElement: null,
  setModalTriggerElement: () => {},
})

const Context = ({ children }: ComponentProps) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>(
    localStorage.getItem('selectedBoardId') || ''
  )
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task)
  const [toastDetails, setToastDetails] = useState<Toast>({
    message: '',
  })
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [liveFeedback, setLiveFeedback] = useState<string>('')
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('dark') === 'true'
  )
  const [newBoardFormOpen, setNewBoardFormOpen] = useState<boolean>(false)
  const [editTaskFormOpen, setEditTaskFormOpen] = useState<boolean>(false)
  const [taskDetailOpen, setTaskDetailOpen] = useState<boolean>(false)
  const [editBoardFormOpen, setEditBoardFormOpen] = useState<boolean>(false)
  const [confirmDeleteTaskOpen, setConfirmDeleteTaskOpen] = useState<boolean>(false)
  const [confirmDeleteBoardOpen, setConfirmDeleteBoardOpen] = useState<boolean>(false)
  const [newTaskFormOpen, setNewTaskFormOpen] = useState<boolean>(false)
  const [boardSelectMenuOpen, setBoardSelectMenuOpen] = useState<boolean>(false)
  const [modalTriggerElement, setModalTriggerElement] =
    useState<MutableRefObject<any> | null>(null)

  return (
    <AppContext.Provider
      value={{
        selectedBoardId,
        setSelectedBoardId,
        selectedTask,
        setSelectedTask,
        toastDetails,
        setToastDetails,
        sidebarOpen,
        setSidebarOpen,
        liveFeedback,
        setLiveFeedback,
        darkMode,
        setDarkMode,
        newBoardFormOpen,
        setNewBoardFormOpen,
        editTaskFormOpen,
        setEditTaskFormOpen,
        taskDetailOpen,
        setTaskDetailOpen,

        editBoardFormOpen,
        setEditBoardFormOpen,
        confirmDeleteTaskOpen,
        setConfirmDeleteTaskOpen,
        confirmDeleteBoardOpen,
        setConfirmDeleteBoardOpen,
        newTaskFormOpen,
        setNewTaskFormOpen,
        boardSelectMenuOpen,
        setBoardSelectMenuOpen,
        modalTriggerElement,
        setModalTriggerElement,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default Context
