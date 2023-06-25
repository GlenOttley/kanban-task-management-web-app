import { Router } from 'express'
import {
  getBoards,
  getBoard,
  createBoard,
  editBoard,
} from '../controllers/boardController'

const router = Router()

router.get('/', getBoards)
router.post('/', createBoard)
router.get('/:id', getBoard)
router.patch('/:id', editBoard)

export default router
