import { Router } from 'express'
import { getBoards } from '../controllers/boardController'

const router = Router()

router.get('/', getBoards)

export default router
