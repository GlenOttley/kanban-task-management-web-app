export interface Board {
  _id?: string
  name: string
  columns?: Column[]
}

export interface Column {
  _id?: string
  name: string
  tasks?: Task[]
}

export interface Task {
  _id: string
  title: string
  description: string
  status: string
  subtasks?: Subtask[]
  column: string
}

export interface Subtask {
  _id: string
  title: string
  isCompleted: boolean
}
