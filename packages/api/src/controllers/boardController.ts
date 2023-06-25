import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Board, { SavedBoardDocument } from '../models/boardModel'
import Task from '../models/taskModel'
import { Board as IBoard, Column } from 'packages/types/src'

// @desc    Fetch all boards
// @route   GET /api/boards
// @access  Public
const getBoards = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const boards: SavedBoardDocument[] = await Board.find({})
    res.status(200).json(boards)
  } catch (error) {
    res.status(404).json({ error })
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
    res.status(404).json({ error: `Board with ID: ${req.params.id} not found` })
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

// @desc    Edit board
// @route   PATCH /api/boards/:id
// @access  Private
const editBoard = asyncHandler(async (req: Request, res: Response) => {
  const requestBody: IBoard = req.body
  const { name, columns } = requestBody

  const board = await Board.findById(req.params.id)

  if (board) {
    board.name = name

    const originalColumns: Column[] = board.columns || []

    columns?.forEach((newColumn: Column) => {
      const matchingIndex = originalColumns.findIndex(
        (originalColumn) => originalColumn._id.toString() === newColumn._id
      )

      if (matchingIndex !== -1) {
        originalColumns[matchingIndex].name = newColumn.name
      } else {
        originalColumns.push(newColumn)
      }
    })

    const updatedBoard = await board.save()
    res.status(200).json(updatedBoard)
  } else {
    res.status(404).json({ error: `Board with ID: ${req.params.id} not found` })
  }
})

export { getBoards, getBoard, createBoard, editBoard }
