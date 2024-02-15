import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/:id/split').post(asyncRoute(workloadController.splitRow));
router.route('/faculty').post(asyncRoute(workloadController.facultyEducator));
router.route('/:id/update').get(asyncRoute(workloadController.getOne)).patch(asyncRoute(workloadController.update));
router.route('/map').post(asyncRoute(workloadController.mapRow));
// router.route('/hours/:id').get(asyncRoute(workloadController.getHours));
export default router;
