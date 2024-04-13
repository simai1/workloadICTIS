import { Router } from 'express';
import notificationController from '../controllers/notification.js';
import { asyncRoute } from '../utils/errors.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';
import verify from '../middlewares/verify-token.js';

const router = Router();
router.use(verify.general);

router
    .route('/')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.METHODIST, role.DIRECTORATE])),
        asyncRoute(notificationController.getAllNotifications)
    );

export default router;
