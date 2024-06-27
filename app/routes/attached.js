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
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.LECTURER,
                role.EDUCATOR,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(attacheController.getAllAttaches)
    );
router
    .route('/setAttaches')
    .post(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.LECTURER,
                role.EDUCATOR,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(attacheController.setAttaches)
    );
router
    .route('/unAttaches')
    .delete(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.LECTURER,
                role.EDUCATOR,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(attacheController.unAttaches)
    );
export default router;
