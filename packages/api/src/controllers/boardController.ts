import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Board, { SavedBoardDocument } from '../models/boardModel'
import { Board as IBoard } from 'packages/types/src'

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
    const board: SavedBoardDocument | null = await Board.findById(req.params.id).populate(
      {
        path: 'columns.tasks',
        model: 'Task',
      }
    )
    res.status(200).json(board)
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

// @desc Update a board
// @route PATCH /api/boards/:id
// @access Private

// const updateBoard = asyncHandler(async (req: Request<{}, {}, IBoard>, res: Response) => {
//   const { _id } = req.body

//   const invoice = await Invoice.findById(req.params.id)

//   if (invoice) {
//     invoice.createdAt = createdAt
//     invoice.paymentTerms = paymentTerms
//     invoice.paymentDue = paymentDue
//     invoice.description = description
//     invoice.status = status
//     invoice.client = client
//     invoice.items = items
//     invoice.total = total
//     const updatedInvoice = await invoice.save()
//     res.json(updatedInvoice)
//   } else {
//     res.status(404)
//     throw new Error('Invoice not found')
//   }
// })

export { getBoards, getBoard, createBoard }
