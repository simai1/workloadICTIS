import { Router } from 'express';
import colorController from '../controllers/color.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/getAllColors')
    .get(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(colorController.getAllColors)
    );
router
    .route('/setColor')
    .post(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(colorController.setColor)
    );
router
    .route('/changeColor')
    .patch(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(colorController.changeColors)
    );
router
    .route('/deleteColors')
    .delete(
        asyncRoute(checkRole([role.UNIT_ADMIN, role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER, role.EDUCATOR])),
        asyncRoute(colorController.deleteColor)
    );
export default router;
