import { Router } from 'express';
import uWorkloadController from '../controllers/uWorkloadController.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
// import checkHours from '../utils/notification.js';

const router = Router();
router.use(verify.general);

router
  .route('/copy')
  .post(
    asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
    asyncRoute(uWorkloadController.copy)
  );
export default router;
