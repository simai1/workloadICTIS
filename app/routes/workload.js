import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';
// import checkHours from '../utils/notification.js';

const router = Router();

router.route('/:department').get(asyncRoute(workloadController.getDepartment));
router.route('/:id/split').post(asyncRoute(workloadController.splitRow));
router
    .route('/faculty')
    .patch(asyncRoute(workloadController.facultyEducator))
    .delete(asyncRoute(workloadController.unfacultyEducator));
router.route('/unFaculty').delete(asyncRoute(workloadController.unfacultyEducator));
router.route('/:id/update').get(asyncRoute(workloadController.getOne)).patch(asyncRoute(workloadController.update));
router.route('/map').post(asyncRoute(workloadController.mapRow));
router.route('/delete/:id').delete(asyncRoute(workloadController.deleteWorkload));
router.route('/').get(asyncRoute(workloadController.getAllWorkload));
router.route('/getSummaryWorkload/:id').get(asyncRoute(workloadController.getSummaryWorkload));
// router.route('/hours/:id').get(asyncRoute(workloadController.getHours));
router.route('/get/departments').get(asyncRoute(workloadController.getAllDepartment));
router.route('/get/department').get(asyncRoute(workloadController.getDepartmentWorkload));
export default router;
