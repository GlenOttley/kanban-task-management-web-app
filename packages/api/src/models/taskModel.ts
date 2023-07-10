import { Schema, model, Document, ObjectId } from 'mongoose'
import { Task, Subtask } from '@kanban/types'

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

interface TaskSchema extends Omit<Task, 'columnId'> {
  columnId: ObjectId
}

export const taskSchema: Schema<TaskSchema> = new Schema({
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
  },
  columnId: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
  },
})

export interface SavedTaskDocument extends TaskSchema, Omit<Document, '_id'> {}

export default model<SavedTaskDocument>('Task', taskSchema)
