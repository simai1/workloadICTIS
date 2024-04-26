import { Router } from 'express';
import eduController from '../controllers/educator.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
//router.use(verify.general);

router
    .route('/:educatorId')
    .get(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST, role.LECTURER])),
        asyncRoute(eduController.getOne)
    )
    .patch(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(eduController.update)
    )
    .delete(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(eduController.deleteEducator)
    );
router
    .route('/')
    .get(
        //asyncRoute(checkRole([role.DIRECTORATE, role.DEPARTMENT_HEAD, role.METHODIST])),
        asyncRoute(eduController.getAll)
    )
    .post(
        asyncRoute(
            //checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST]),
            asyncRoute(eduController.create)
        )
    );
router
    .route('/get/positions')
    .get(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.DIRECTORATE, role.METHODIST])),
        asyncRoute(eduController.getPositions)
    );
router
    .route('/get/typeOfEmployments')
    .get(
        //asyncRoute(checkRole([role.DEPARTMENT_HEAD, role.METHODIST, role.DIRECTORATE])),
        asyncRoute(eduController.getTypeOfEmployments)
    );
router.route('/get/educatorsByDepartment').get(asyncRoute(eduController.getEducatorsByDepartment));

export default router;
