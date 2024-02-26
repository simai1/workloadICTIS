import { Router } from 'express';
import eduController from '../controllers/educator.js';
import { asyncRoute } from '../utils/errors.js';

const router = Router();

router.route('/:educatorId').get(asyncRoute(eduController.getOne)).patch(asyncRoute(eduController.update));
router.route('/').get(asyncRoute(eduController.getAll)).post(asyncRoute(eduController.create));
router.route('/get/positions').get(asyncRoute(eduController.getPositions));
router.route('/get/typeOfEmployments').get(asyncRoute(eduController.getTypeOfEmployments));
router.route('/delete/:id').delete(asyncRoute(eduController.deleteEducator));
export default router;
        