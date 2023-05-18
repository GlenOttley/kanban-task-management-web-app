import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Board, { ISavedBoardDocument } from '../models/boardModel'
import { Board as IBoard } from 'types'

// @desc    Fetch all boards
// @route   GET /api/boards
// @access  Public
const getBoards = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const boards: IBoard[] = await Board.find({})
    res.status(200).json(boards)
  } catch (error) {
    res.status(404).json(error)
  }
})

export { getBoards }
