import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
import roleController from '../controllers/role.js';
// import checkHours from '../utils/notification.js';

const router = Router();
//router.use(verify.general);

router
    .route('/changeRole')
    .post(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.EDUCATOR, role.LECTURER])),
        asyncRoute(roleController.changeRole)
    );

export default router;
