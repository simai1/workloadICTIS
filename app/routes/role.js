import { Router } from 'express';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import role from '../config/roles.js';
import checkRole from '../middlewares/checkRoles.js';
import roleController from '../controllers/role.js';

const router = Router();
router.use(verify.general);

router
    .route('/changeRole')
    .post(
        asyncRoute(
            checkRole([
                role.GOD,
                role.GIGA_ADMIN,
                role.UNIT_ADMIN,
                role.DEPARTMENT_HEAD,
                role.DIRECTORATE,
                role.METHODIST,
                role.EDUCATOR,
                role.LECTURER,
                role.DEPUTY_DIRECTORATE,
                role.DEPUTY_DEPARTMENT_HEAD,
            ])
        ),
        asyncRoute(roleController.changeRole)
    );
router
    .route('/changeInstitutionalAffiliation')
    .post(
        asyncRoute(checkRole([role.GOD, role.GIGA_ADMIN, role.DIRECTORATE, role.DEPUTY_DIRECTORATE])),
        asyncRoute(roleController.changeInstitutionalAffiliation)
    );

export default router;
