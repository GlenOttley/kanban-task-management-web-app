import { Router } from 'express'
import {
  getBoards,
  getBoard,
  createBoard,
  editBoard,
  deleteBoard,
  updateColumn,
} from '../controllers/boardController'

const router = Router()

router.get('/', getBoards)
router.post('/', createBoard)
router.get('/:id', getBoard)
router.patch('/:id', editBoard)
router.delete('/:id', deleteBoard)
router.patch('/:id/update-column', updateColumn)

export default router
