import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import userController from '../controllers/user.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';

const router = Router();
router.use(verify.general);

router.route('/').get(asyncRoute(userController.getUser));
router
    .route('/setDepartments')
    .patch(
        asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN, role.DIRECTORATE, role.DEPUTY_DIRECTORATE])),
        asyncRoute(userController.setUnitAdminDepartments)
    );

router.route('/getAll').get(asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN])), asyncRoute(userController.getAll));
router
    .route('/:id/update')
    .put(asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN])), asyncRoute(userController.updateUser));
router.route('/getRoles').get(asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN])), asyncRoute(userController.getRoles))

export default router;
