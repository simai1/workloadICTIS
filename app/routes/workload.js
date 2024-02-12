import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/:id/split').post(workloadController.splitRow);
router.route('/:id/update').get(asyncRoute(workloadController.getOne)).patch(asyncRoute(workloadController.update));
export default router;
