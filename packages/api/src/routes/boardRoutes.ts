import { Router } from 'express'
import { getBoards, getBoard, createBoard } from '../controllers/boardController'

const router = Router()

router.get('/', getBoards)
router.get('/:id', getBoard)
router.post('/', createBoard)

export default router
