import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/:id/split').post(workloadController.splitRow);
export default router;
