import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Board, { SavedBoardDocument } from '../models/boardModel'
import Task from '../models/taskModel'

// @desc    Fetch all boards
// @route   GET /api/boards
// @access  Public
const getBoards = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const boards: SavedBoardDocument[] = await Board.find({})
    res.status(200).json(boards)
  } catch (error) {
    res.status(404).json(error)
  }
})

// @desc    Get single board by ID
// @route   GET /api/boards/:id
// @access  Public
const getBoard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const board: SavedBoardDocument | null = await Board.findById(req.params.id)
    const columnIds = board?.columns?.map((column) => column._id)
    const tasks = await Task.find({ column: { $in: columnIds } })
    const populatedBoard = board?.toObject()
    populatedBoard.columns.forEach((column: any) => {
      column.tasks = tasks.filter(
        (task) => task.column.toString() === column._id.toString()
      )
    })
    res.status(200).json(populatedBoard)
  } catch (error) {
    res.status(404).json(error)
    console.log(error)
    // throw new Error('Something went wrong, please try again')
  }
})

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req: Request, res: Response) => {
  const board: SavedBoardDocument = new Board(req.body)

  const createdBoard = await board.save()

  res.status(201).json(createdBoard)
})

export { getBoards, getBoard, createBoard }
