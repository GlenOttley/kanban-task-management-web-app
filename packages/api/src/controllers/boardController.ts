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
    const board = await Board.findById(req.params.id).populate({
      path: 'columns',
      populate: {
        path: 'tasks',
        model: 'Task',
      },
    })

    if (board) {
      res.status(200).json(board)
    } else {
      res.status(404).json({ error: `Board with ID: ${req.params.id} not found` })
    }
  } catch (error) {
    res.json(error)
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

  try {
    const board = await Board.findById(req.params.id)

    if (board) {
      board.name = name
      board.columns = columns

      const updatedBoard = await board.save()
      res.status(200).json(updatedBoard)
    } else {
      res.status(404).json({ error: `Board with ID: ${req.params.id} not found` })
    }
  } catch (error) {
    res.status(404).json({ error })
  }
})

// @desc Delete a board
// @route DELETE /api/board/:id
// @access Private
const deleteBoard = asyncHandler(async (req: Request, res: Response) => {
  const boardId = req.params.id
  try {
    await Board.findByIdAndDelete(boardId)
    res.status(200).json(`Board id: ${boardId} has been deleted`)
  } catch (error) {
    res.status(404).json({ error: 'Board not found' })
  }
})

// @desc Update a column
// @route PATCH /api/board/:id/update-column
// @access Private
const updateColumn = asyncHandler(async (req: Request, res: Response) => {
  const boardId = req.params.id
  const { columnId, prevColumnId, tasks, taskToRemove } = req.body
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      {
        _id: boardId,
        'columns._id': columnId,
      },
      {
        $set: { 'columns.$.tasks': tasks },
      },
      { new: true }
    )

    let prevBoard = null
    let updatedTask = null
    if (prevColumnId && taskToRemove) {
      prevBoard = await Board.findOneAndUpdate(
        {
          _id: boardId,
          'columns._id': prevColumnId,
        },
        {
          $pull: { 'columns.$.tasks': taskToRemove },
        },
        { new: true }
      )
      updatedTask = await Task.findByIdAndUpdate(
        taskToRemove,
        { $set: { columnId: columnId } },
        { new: true }
      )
    }

    res.status(200).json({
      updatedBoard: updatedBoard,
      prevBoard: prevBoard,
    })
  } catch (error) {
    res.json(error)
  }
})

export { getBoards, getBoard, createBoard, editBoard, deleteBoard, updateColumn }
