import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import userController from '../controllers/user.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';

const router = Router();
router.use(verify.general);

router.route('/').get(asyncRoute(userController.getUser));
router.route('/setDepartments').patch(asyncRoute(checkRole([role.DIRECTORATE, role.DEPUTY_DIRECTORATE])), asyncRoute(userController.setUnitAdminDepartments));

export default router;
