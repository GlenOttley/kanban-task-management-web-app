import { Router } from 'express'
import { toggleComplete } from '../controllers/taskController'

const router = Router()

router.patch('/:id', toggleComplete)

export default router
