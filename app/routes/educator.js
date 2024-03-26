import { Router } from 'express';
import eduController from '../controllers/educator.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import checkRole from '../middlewares/checkRoles.js';
import role from '../config/roles.js';

const router = Router();
router.use(verify.general);

router
    .route('/:educatorId')
    .get(asyncRoute(eduController.getOne))
    .patch(asyncRoute(eduController.update))
    .delete(asyncRoute(eduController.deleteEducator));
router
    .route('/')
    .get(asyncRoute(checkRole([role.LECTURER, role.DIRECTORATE])), asyncRoute(eduController.getAll))
    .post(asyncRoute(eduController.create));
router.route('/get/positions').get(asyncRoute(eduController.getPositions));
router.route('/get/typeOfEmployments').get(asyncRoute(eduController.getTypeOfEmployments));
export default router;
