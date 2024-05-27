import { Router } from 'express';
import attacheController from '../controllers/attached.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/getAllAttaches')
    .get(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(attacheController.getAllAttaches)
    );
router
    .route('/setAttaches')
    .post(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(attacheController.setAttaches)
    );
router
    .route('/unAttaches')
    .delete(
        asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(attacheController.unAttaches)
    );
export default router;
