import { Schema, model, Document } from 'mongoose'
import { Board, Column, Task, Subtask } from 'types'

const subtaskSchema: Schema<Subtask> = new Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
})

const taskSchema: Schema<Task> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  subtasks: {
    type: [subtaskSchema],
    _id: false,
  },
})

const columnSchema: Schema<Column> = new Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: {
    type: [taskSchema],
    _id: false,
  },
})

const boardSchema: Schema<Board> = new Schema({
  name: {
    type: String,
    required: true,
  },
  columns: {
    type: [columnSchema],
  },
})

export interface ISavedBoardDocument extends Board, Omit<Document, '_id'> {}

export default model<Board>('Board', boardSchema)
