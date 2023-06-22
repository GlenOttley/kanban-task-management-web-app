import { Router } from 'express'
import { toggleSubtaskComplete, updateTaskStatus } from '../controllers/taskController'

const router = Router()

router.patch('/:id/toggle-subtask', toggleSubtaskComplete)
router.patch('/:id/update-status', updateTaskStatus)

export default router
