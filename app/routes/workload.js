import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/:id/split').post(asyncRoute(workloadController.splitRow));
router
    .route('/faculty')
    .patch(asyncRoute(workloadController.facultyEducator))
    .delete(asyncRoute(workloadController.unfacultyEducator));
router.route('/:id/update').get(asyncRoute(workloadController.getOne)).patch(asyncRoute(workloadController.update));
router.route('/map').post(asyncRoute(workloadController.mapRow));
router.route('/delete/:id').delete(asyncRoute(workloadController.deleteWorkload));
// router.route('/hours/:id').get(asyncRoute(workloadController.getHours));
export default router;
