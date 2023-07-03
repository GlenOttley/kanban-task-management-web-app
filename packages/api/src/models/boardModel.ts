import { Schema, model, Document } from 'mongoose'
import { Board, Column } from 'types'

const columnSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
})

const boardSchema: Schema<Board> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    columns: {
      type: [columnSchema],
    },
  },
  { versionKey: false }
)

export interface SavedBoardDocument extends Board, Omit<Document, '_id'> {}
export default model<SavedBoardDocument>('Board', boardSchema)
