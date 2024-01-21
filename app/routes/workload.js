import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
export default router;
