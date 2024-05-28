import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
 // import checkHours from '../utils/notification.js';

const router = Router();
//router.use(verify.general);

router
    .route('/:department')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(workloadController.getDepartment)
    );
router
    .route('/split')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE])),
        asyncRoute(workloadController.splitRow)
    );
router
    .route('/faculty')
    .patch(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER])),
        asyncRoute(workloadController.facultyEducator)
    )
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(workloadController.unfacultyEducator)
    );
router
    .route('/unFaculty')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(workloadController.unfacultyEducator)
    );
router
    .route('/:id/update')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER])),
        asyncRoute(workloadController.getOne)
    )
    .patch(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER])),
        asyncRoute(workloadController.update)
    );
router
    .route('/map')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE])),
        asyncRoute(workloadController.mapRow)
    );
router
    .route('/delete/:id')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE])),
        asyncRoute(workloadController.deleteWorkload)
    );
router
    .route('/deleteSeveralWorkloads')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE])),
        asyncRoute(workloadController.deleteSeveralWorkloads)
    );
router
    .route('/')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(workloadController.getAllWorkload)
    );
router
    .route('/get/departments')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(workloadController.getAllDepartment)
    );
router
    .route('/get/department')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.EDUCATOR, role.METHODIST, role.LECTURER, role.DIRECTORATE])),
        asyncRoute(workloadController.getDepartmentWorkload)
    );
router
    .route('/get/usableDepartments')
    .get(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(workloadController.getUsableDepartments)
    );
export default router;
