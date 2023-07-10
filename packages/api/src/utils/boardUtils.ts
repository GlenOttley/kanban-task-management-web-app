import { Board } from '@kanban/types'
import BoardModel from '../models/boardModel'

export async function createBoard(board: Board) {
  return BoardModel.create(board)
}
export async function deleteBoard(id: string) {
  return BoardModel.findByIdAndDelete(id)
}
