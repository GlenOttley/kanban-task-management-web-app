import { Schema, model, Document, ObjectId } from 'mongoose'
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

interface TaskSchema extends Omit<Task, 'column'> {
  column: ObjectId
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
  column: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
  },
  position: {
    type: Number,
    required: true,
  },
})

taskSchema.pre('save', async function (next) {
  if (!this.position) {
    const matchingTasksCount = await this.$model('Task').countDocuments({
      column: this.column,
    })
    this.position = matchingTasksCount
  }
  next()
})

export interface SavedTaskDocument extends TaskSchema, Omit<Document, '_id'> {}

export default model<SavedTaskDocument>('Task', taskSchema)
