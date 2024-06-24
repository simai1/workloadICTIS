import { Router } from 'express';
import workloadController from '../controllers/workload.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
 // import checkHours from '../utils/notification.js';

const router = Router();
router.use(verify.general);

router
  .route('/split')
  .post(
    asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
    asyncRoute(workloadController.splitRow)
  );
router
    .route('/getDepartment/:department')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getDepartment)
    );
router
    .route('/faculty')
    .patch(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.facultyEducator)
    )
    .delete(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.unfacultyEducator)
    );
router
    .route('/unFaculty')
    .delete(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.unfacultyEducator)
    );
router
    .route('/:id/update')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getOne)
    )
    .patch(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.update)
    );
router
    .route('/map')
    .post(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.mapRow)
    );
router
    .route('/delete/:id')
    .delete(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.deleteWorkload)
    );
router
    .route('/deleteSeveralWorkloads')
    .delete(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.deleteSeveralWorkloads)
    );
router
    .route('/')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.EDUCATOR, role.LECTURER, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getAllWorkload)
    );
router
    .route('/get/departments')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getAllDepartment)
    );
router
    .route('/get/department')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.EDUCATOR, role.METHODIST, role.LECTURER, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getDepartmentWorkload)
    );
router
    .route('/get/usableDepartments')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
        asyncRoute(workloadController.getUsableDepartments)
    );
router
  .route('/block/:department')
  .patch(
    asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
    asyncRoute(workloadController.blockWorkload)
  );
router
  .route('/unblock/:department')
  .patch(
    asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.DEPUTY_DIRECTORATE, role.DEPUTY_DEPARTMENT_HEAD])),
    asyncRoute(workloadController.unblockWorkload)
  );
router
  .route('/get/departmentsForDirectorate')
  .get(
    asyncRoute(checkRole([role.DIRECTORATE, role.DEPUTY_DIRECTORATE])),
    asyncRoute(workloadController.getDepartmentsForDirectorate)
  );
export default router;
