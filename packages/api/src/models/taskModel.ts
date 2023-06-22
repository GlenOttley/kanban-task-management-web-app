import { Schema, model, Document } from 'mongoose'
import { Task, Subtask } from 'types'

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

export const taskSchema: Schema<Task> = new Schema({
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
  column: {
    // type: Schema.Types.ObjectId,
    ref: 'Column',
  },
})

export interface SavedTaskDocument extends Task, Omit<Document, '_id'> {}

export default model<SavedTaskDocument>('Task', taskSchema)
